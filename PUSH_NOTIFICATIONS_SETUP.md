# Push Notifications Implementation Guide

## Overview
The FarmVet app now includes push notifications using Expo's native push notification service. Users will receive real-time notifications when admins send messages.

## Components Added

### 1. **util/pushNotifications.js** - Core Push Notifications Module
This file contains all push notification functionality:

**Key Functions:**
- `registerForPushNotifications(userId)` - Registers device for push notifications and saves token to Firestore
- `sendPushNotification(expoPushToken, title, message, data)` - Sends push notification to a single device
- `setupNotificationListeners()` - Sets up listeners for incoming notifications
- `sendBulkPushNotifications(title, message)` - Sends notifications to all users
- `getAllUserTokens()` - Retrieves all user push tokens from Firestore
- `clearNotificationBadge()` - Clears notification badge count

### 2. **App.js Updates**
- Added push notification initialization on app startup
- Registers user device when authenticated
- Sets up notification listeners for foreground and background notifications

### 3. **NotificationManager.js Updates**
- Admin notifications now trigger push notifications to all devices
- Dual-channel delivery: Firestore + Device push notifications

## Setup Instructions

### Step 1: Update app.json with Expo Project ID
```json
{
  "expo": {
    "projectId": "YOUR_EXPO_PROJECT_ID",
    "name": "NewFarmVet",
    "slug": "newfarmvet"
  }
}
```

To get your Expo Project ID:
1. Run `eas build --platform android` or `expo publish`
2. Copy the project ID from the output
3. Add it to `app.json` and to `util/pushNotifications.js` (line 20)

### Step 2: Install Dependencies (if needed)
```bash
expo install expo-notifications
```

### Step 3: Update Firestore Security Rules
Add the following rule to allow storing push tokens:
```firestore
// Allow users to update their own push token
match /users/{userId} {
  allow read: if request.auth != null;
  allow update: if request.auth.uid == userId && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['expoPushToken', 'tokenUpdatedAt']);
}
```

### Step 4: Configure Firebase Cloud Messaging (Optional but Recommended)
For production deployment to Google Play Store:
1. Create a GCM sender ID in Google Cloud Console
2. Add it to your Android build configuration
3. This ensures notifications work reliably on Android

## How It Works

### User Device Registration
1. When user logs in → `registerForPushNotifications()` is called
2. Device receives a unique push token from Expo
3. Token is saved to user's Firestore document
4. Token is also cached in AsyncStorage

### Sending Notifications
1. Admin creates a notification in the Admin Panel
2. `NotificationManager` saves it to Firestore (shown in "Notifications" tab)
3. `sendBulkPushNotifications()` fetches all user tokens
4. Push notifications are sent to each device via Expo's service

### Receiving Notifications
1. **Foreground** (app open): Notification appears via `setupNotificationListeners()`
2. **Background** (app closed): System tray notification appears
3. **Tap on notification**: Optional handler can navigate to specific screen
4. Badge count is updated automatically

## File Structure
```
NewFarmVet/
├── util/
│   ├── pushNotifications.js      (NEW - Core push notification logic)
│   └── adminService.js           (Updated - stores user tokens)
├── components/
│   └── admin/
│       └── NotificationManager.js (Updated - sends push notifications)
├── App.js                        (Updated - initializes push notifications)
└── app.json                      (Must include projectId)
```

## Testing Push Notifications

### Test Locally
1. Run `npm start` or `expo start --dev-client`
2. Login to the app
3. Check console logs for: `"Push notification token obtained: ..."`
4. Go to Admin Panel → Notifications tab
5. Create a test notification
6. You should see the notification on your device

### Check Debugging
Open the Expo dev menu and look for:
- `✓ Push notification token registered` - Device is registered
- `Notification received:` - Notification delivered successfully
- `Notification tapped:` - User interacted with notification

## Troubleshooting

**Issue:** "Push notification token obtained: undefined"
- **Fix:** Check that `projectId` in app.json matches Expo project ID
- **Fix:** Ensure device has notification permissions enabled

**Issue:** Notifications not appearing
- **Fix:** Check device notification settings for the app
- **Fix:** Ensure Firebase Firestore has user tokens stored
- **Fix:** Check browser console for errors (use `expo start --web` for web testing)

**Issue:** "Missing or insufficient permissions" error
- **Fix:** Update Firestore rules to allow token storage (see Step 3 above)

## Production Checklist

- [ ] Update `projectId` in app.json
- [ ] Update Expo push token in `pushNotifications.js` (if different from projectId)
- [ ] Update Firestore security rules
- [ ] Test on physical device (iOS and Android)
- [ ] Verify notifications appear when app is in background
- [ ] Test notification taps and deep linking

## Security Notes

1. **Push Tokens** are device-specific and stored securely by Expo
2. **User Privacy** - Tokens are only used for sending notifications
3. **Admin Only** - Only verified admin accounts can send notifications
4. **No Data** - Push tokens don't expose personal information
5. **Token Rotation** - Tokens are updated automatically when they expire

## Future Enhancements

- [ ] Add notification categories (e.g., Jobs, Announcements, Updates)
- [ ] Send targeted notifications to specific user groups
- [ ] Add notification scheduling / delayed sending
- [ ] Add notification delivery analytics
- [ ] Support for rich media (images, action buttons)
- [ ] Implement notification preferences per user
