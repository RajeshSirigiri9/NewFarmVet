# Admin Panel Setup Guide

## Overview
The admin panel allows administrators to:
1. **Send Notifications** - Broadcast messages to all registered users
2. **View Feedback** - See all user feedback with filtering and status management
3. **Manage Content** - Add, edit, delete content pages with optional images

## Installation Complete ✅

The following components have been created:

### New Files Created:
- `components/admin/AdminPanel.js` - Main admin interface with tab navigation
- `components/admin/NotificationManager.js` - Send notifications to all users
- `components/admin/FeedbackViewer.js` - View and manage feedback
- `components/admin/ContentManager.js` - Create and manage content pages
- `util/adminService.js` - Admin operations service with Firestore integration

### New Dependencies:
- `expo-image-picker` - For selecting images in ContentManager

### Route Added:
- `AdminPanel` route added to App.js stack navigation

## Firestore Collections Setup

You need to create the following Firestore collections manually in Firebase Console:

### 1. `notifications` Collection
Auto-generated with these fields:
```
{
  title: string (3+ characters),
  message: string (10+ characters),
  imageUrl: string (optional),
  createdAt: timestamp,
  status: "published"
}
```

### 2. `content` Collection
Auto-generated with these fields:
```
{
  title: string (5-100 characters),
  description: string (10-2000 characters),
  imageUrl: string (optional),
  category: string ("general", "cattle", "sheep", "farming", "health", "other"),
  createdAt: timestamp,
  updatedAt: timestamp,
  isPublished: boolean (true)
}
```

### 3. Update `users` Collection
Add admin field to user documents:
```
{
  email: string,
  displayName: string,
  phoneNumber: string,
  isAdmin: boolean (false by default),
  createdAt: timestamp,
  ...other fields
}
```

## Firestore Security Rules

Update your Firestore Security Rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - user can read/write their own, admin can manage isAdmin flag
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['isAdmin']);
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow delete: if false;
    }
    
    // Feedback collection - users can create their own, admin can read/manage all
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow update: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Notifications collection - admins only can write, all users can read
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Content collection - admins only can write, all users can read
    match /content/{contentId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## Making a User Admin

To grant admin privileges to a user:

1. Go to Firebase Console → Firestore Database
2. Navigate to `users` collection
3. Find the user document (by their UID)
4. Add or update the `isAdmin` field to `true`

Example user document with admin privileges:
```
{
  email: "admin@example.com",
  displayName: "Admin Name",
  phoneNumber: "+1234567890",
  isAdmin: true,
  createdAt: <timestamp>,
  updatedAt: <timestamp>
}
```

## Accessing the Admin Panel

1. Log in with an admin user account
2. Navigate to the Profile page or use the drawer menu
3. Click on "Admin Panel" button/link (you'll need to add this to Profile.js or CustomDrawer.js)
4. The app will verify admin status and show three tabs:
   - **📢 Notifications** - Send notifications to all users
   - **💬 Feedback** - View and manage feedback
   - **📝 Content** - Create and manage content pages

## Features Breakdown

### Notification Manager
- **Send Notification**: Enter title and message with character limits
- View recent notifications sent
- Delete notifications if needed
- Auto-broadcast to all users upon creation

### Feedback Viewer
- **Filter Options**: All / Pending / Reviewed / Resolved
- **View Details**: Click feedback to see full message
- **Change Status**: Update feedback status from the detail view
- **Feedback Info**: Email, subject, message, creation date
- **Sorting**: Automatically sorted by newest first

### Content Manager
- **Add Content**: Create new page with title, description, optional image, and category
- **Categories**: general, cattle, sheep, farming, health, other
- **Image Picker**: Select from device gallery (supports editing/cropping)
- **Edit Content**: Modify existing pages
- **Delete Content**: Remove content with confirmation
- **Character Limits**: 
  - Title: 5-100 characters
  - Description: 10-2000 characters

## Images (Firebase Storage Setup - Optional)

If you want to enable image upload to Firebase Storage:

1. Enable Firebase Storage in Firebase Console
2. Update storage security rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Admin can upload images
    match /admin/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

3. Note: Current implementation shows image preview locally but stores as URI. For production, implement image upload to Firebase Storage.

## API Functions Reference

All admin functions are in `util/adminService.js`:

```javascript
// Check admin status
isUserAdmin(userId)

// User management
getAllUsers()
makeUserAdmin(userId)
removeUserAdmin(userId)

// Notifications
sendNotificationToAllUsers(title, message, imageUrl)
getAllNotifications()
deleteNotification(notificationId)

// Feedback
getAllFeedbackAdmin()
updateFeedbackStatusAdmin(feedbackId, status)

// Content
addContent(title, description, imageUrl, category)
getAllContent()
updateContent(contentId, updates)
deleteContent(contentId)
```

## Testing the Admin Features

1. **Create test user**: Sign up as a regular user
2. **Make them admin**: In Firebase Console, set `isAdmin: true` in their user document
3. **Test Notifications**:
   - Send a notification with title and message
   - Verify it appears in the recent notifications list
   - Verify notification is stored in Firestore

4. **Test Content**:
   - Add new content with title, description, and optional image
   - Verify it appears in the content list
   - Edit and delete to confirm all operations work

5. **Test Feedback** (requires user to submit feedback first):
   - Use a regular user account to submit feedback
   - View it in admin panel feedback viewer
   - Change its status and verify update

## Troubleshooting

### "You do not have admin access"
- Check that user document has `isAdmin: true` in Firestore
- Ensure logged-in user UID matches the document ID

### Images not showing
- Verify image URI is correct and accessible
- For production, implement Firebase Storage upload in ContentManager

### Notifications not appearing
- Check Firestore security rules are correct
- Verify `notifications` collection exists in Firestore
- Check console for error messages

### Collections not created
- Admin operations will auto-create collections on first use
- If errors persist, manually create collections in Firebase Console

## Next Steps

1. Add admin button/link to Profile.js or CustomDrawer.js to navigate to AdminPanel
2. Create a user-facing page to display notifications
3. Create a user-facing page to display content from admin-created pages
4. Implement Firebase Storage image upload for production use
5. Add audit logging for admin actions
