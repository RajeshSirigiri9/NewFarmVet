# Admin Panel - Visual Guide & API Reference

## 🎨 UI Layout Reference

### Admin Panel Main Screen
```
┌─────────────────────────────────────────────┐
│           Admin Panel Header                 │
│        (Green background #27ae60)            │
│       "Welcome, Admin!"                      │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  📢 Notifications │ 💬 Feedback │ 📝 Content │
│  (Tab Navigation with green active indicator) │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│                                               │
│      Content Area (Changes per tab)           │
│                                               │
│      - Scrollable                             │
│      - Modals for add/edit/detail             │
│                                               │
└─────────────────────────────────────────────┘
```

---

## 📢 Notifications Tab Layout

### Main View
```
┌─────────────────────────────────────────────┐
│  Notification Form:                          │
│  [Title Input (3-100 chars)]                │
│  Remaining: 100                              │
│                                              │
│  [Message Input (10-500 chars)]             │
│  Remaining: 500                              │
│                                              │
│  [Send Notification Button (Green)]         │
└─────────────────────────────────────────────┘
│                                              │
│  Recent Notifications:                       │
│  ┌──────────────────────────────────────┐   │
│  │ Title                          [❌]   │   │
│  │ Message preview...                   │   │
│  │ Date: 2024-01-15                     │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │ Another notification          [❌]   │   │
│  │ ...                                  │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Notifications Tab - Features
| Feature | Input | Validation | Database |
|---------|-------|-----------|----------|
| Title | Text input | 3-100 chars | String |
| Message | Text input | 10-500 chars | String |
| Send | Button | All fields required | Auto-creates |
| Delete | Icon button | Confirmation | Auto-deletes |
| Character count | Live counter | Shows remaining | N/A |

---

## 💬 Feedback Tab Layout

### Filter View
```
┌──────────────────────────────────────────────┐
│ [All]  [Pending]  [Reviewed]  [Resolved]    │
│  (100)     (15)       (45)        (40)       │
└──────────────────────────────────────────────┘
```

### Feedback List
```
┌──────────────────────────────────────────────┐
│ Feedback Subject Here          [🔴 Pending]  │
│ user@example.com                             │
│ Message preview text...                      │
│ Date: 2024-01-15                             │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│ Another Subject                [🟠 Reviewed] │
│ farmer@email.com                             │
│ Another message preview...                   │
│ Date: 2024-01-14                             │
└──────────────────────────────────────────────┘
```

### Feedback Detail Modal (On Click)
```
┌──────────────────────────────────────────────┐
│                                               │
│  Full Subject Title Here                      │
│  user@example.com                             │
│                                               │
│  [🔴 Pending Status]                          │
│                                               │
│  Message:                                     │
│  Full message content displayed here...       │
│  Multiple lines of text...                    │
│  ...                                          │
│                                               │
│  Submitted: 2024-01-15 14:30                  │
│                                               │
│  Change Status:                               │
│  [Pending] [Reviewed] [Resolved]              │
│                                               │
│  [Close Button]                               │
└──────────────────────────────────────────────┘
```

### Feedback Tab - Features
| Feature | Options | Color | Action |
|---------|---------|-------|--------|
| Filter | All/Pending/Reviewed/Resolved | Gray | Switch view |
| Status Badge | 🔴 Pending | Red (#e74c3c) | Show status |
| Status Badge | 🟠 Reviewed | Orange (#f39c12) | Show status |
| Status Badge | 🟢 Resolved | Green (#27ae60) | Show status |
| Click Feedback | - | - | Open modal |
| Change Status | 3 buttons | Color-coded | Update DB |

---

## 📝 Content Tab Layout

### Main View with Add Button
```
┌──────────────────────────────────────────────┐
│  [+ Add New Content]                          │
│  (Green button, full width)                   │
└──────────────────────────────────────────────┘
```

### Content List
```
┌──────────────────────────────────────────────┐
│  ┌────────────────────────────────────────┐  │
│  │ [📷 Image Thumbnail]                   │  │
│  │ Title: Learning about Dairy Cows       │  │
│  │ Category: cattle                       │  │
│  │ Description preview: This page teaches │  │
│  │ the basics of dairy cow farming...     │  │
│  │                                        │  │
│  │  [Edit]  [Delete]                     │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ [📷 Image Thumbnail]                   │  │
│  │ Title: Sheep Breeding Guide            │  │
│  │ Category: sheep                        │  │
│  │ ...                                    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Add/Edit Content Modal
```
┌──────────────────────────────────────────────┐
│  Add New Content / Edit Content               │
│                                               │
│  ┌──────────────────────────────────────┐   │
│  │  [Add Image or Replace Image]        │   │
│  │       (Tap to select from gallery)   │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Title (5-100 characters)                   │
│  [Title Input Field]                        │
│  Remaining: 100                             │
│                                              │
│  Description (10-2000 characters)           │
│  [Description Multi-line Input]             │
│  [Description continues...]                 │
│  Remaining: 2000                            │
│                                              │
│  Category:                                   │
│  [general] [cattle] [sheep]                 │
│  [farming] [health] [other]                 │
│                                              │
│  [Cancel]         [Add/Update]              │
└──────────────────────────────────────────────┘
```

### Content Detail Modal
```
┌──────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐   │
│  │      [Full Size Image Display]       │   │
│  │                                      │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Content Title Here                         │
│  [🟢 cattle]                                │
│                                              │
│  Full Description:                          │
│  Complete text displayed here...            │
│  Multiple paragraphs...                     │
│  ...                                        │
│                                              │
│  Added: 2024-01-15                          │
│                                              │
│  [Edit]  [Delete]                           │
│                                              │
│  [Close]                                    │
└──────────────────────────────────────────────┘
```

### Content Tab - Features
| Feature | Input | Character Limit | Category Options |
|---------|-------|-----------------|------------------|
| Title | Text | 5-100 | N/A |
| Description | Text | 10-2000 | N/A |
| Image | File picker | Optional | JPG/PNG |
| Category | Button group | N/A | 6 options |
| Edit | Button | Same | Same |
| Delete | Button | Confirmation | N/A |

---

## 🎯 Admin Functions Reference

### Notification Functions
```javascript
// Send notification to all users
sendNotificationToAllUsers(title, message, imageUrl)
// Returns: { id, title, message, createdAt, ... }
// Errors: Invalid title/message

// Get all notifications
getAllNotifications()
// Returns: Array of notifications (sorted by date)
// Errors: Database access

// Delete notification
deleteNotification(notificationId)
// Returns: true
// Errors: Document not found
```

### Feedback Functions
```javascript
// Get all feedback with admin access
getAllFeedbackAdmin()
// Returns: Array of feedback (sorted by newest first)
// Errors: Database access

// Update feedback status
updateFeedbackStatusAdmin(feedbackId, status)
// Status: "pending" | "reviewed" | "resolved"
// Returns: { id, status, updatedAt }
// Errors: Invalid status
```

### Content Functions
```javascript
// Add new content
addContent(title, description, imageUrl, category)
// Returns: { id, title, description, imageUrl, ... }
// Errors: Invalid inputs

// Get all content
getAllContent()
// Returns: Array of content (sorted by newest first)
// Errors: Database access

// Update content
updateContent(contentId, updates)
// Updates: { title, description, imageUrl, category }
// Returns: { id, ...updates }
// Errors: Invalid updates

// Delete content
deleteContent(contentId)
// Returns: true
// Errors: Document not found
```

### User Functions
```javascript
// Check if user is admin
isUserAdmin(userId)
// Returns: boolean
// Errors: Database access

// Get all users
getAllUsers()
// Returns: Array of users
// Errors: Database access

// Make user admin
makeUserAdmin(userId)
// Returns: true
// Errors: User not found

// Remove admin privileges
removeUserAdmin(userId)
// Returns: true
// Errors: User not found
```

---

## 🔤 Character Limits Reference

| Field | Min | Max | Example |
|-------|-----|-----|---------|
| Notification Title | 3 | 100 | "Important Farm Update" |
| Notification Message | 10 | 500 | "Check out our new dairy farming guide..." |
| Content Title | 5 | 100 | "How to Care for Dairy Cows" |
| Content Description | 10 | 2000 | "This comprehensive guide covers everything..." |

---

## 🎨 Color Reference

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Primary (Admin theme) | Green | #27ae60 | Buttons, active states, headers |
| Pending Status | Red | #e74c3c | Unreviewed feedback |
| Reviewed Status | Orange | #f39c12 | Reviewed feedback |
| Resolved Status | Green | #27ae60 | Completed feedback |
| Edit Action | Blue | #3498db | Edit buttons |
| Secondary Text | Gray | #95a5a6 | Dates, hints |
| Background | Light gray | #ecf0f1 | Form backgrounds |

---

## 📱 Component Hierarchy

```
AdminPanel
├── Header (Title + Subtitle)
├── TabContainer
│   ├── NotificationsTab (Button)
│   ├── FeedbackTab (Button)
│   └── ContentTab (Button)
│
├── Content (Scrollable)
│   └── [Active Tab Component]
│       ├── NotificationManager
│       │   ├── Form (Title, Message)
│       │   └── FlatList (Recent Notifications)
│       │
│       ├── FeedbackViewer
│       │   ├── FilterButtons
│       │   ├── FlatList (Feedback Cards)
│       │   └── DetailModal
│       │
│       └── ContentManager
│           ├── AddButton
│           ├── FlatList (Content Cards)
│           ├── AddEditModal
│           └── DetailModal
```

---

## 🧪 Test Scenarios

### Scenario 1: Send Notification
```
1. Admin clicks Notifications tab
2. Enters title: "Weekly Update" (13 chars) ✓
3. Enters message: "New farming technique available" (32 chars) ✓
4. Clicks "Send Notification"
5. Alert shows "Success"
6. Notification appears in recent list
7. Firestore shows in notifications collection
```

### Scenario 2: Review Feedback
```
1. Admin clicks Feedback tab
2. Clicks "Pending" filter
3. Sees unreviewed feedback
4. Clicks on feedback to open detail modal
5. Reads full message
6. Clicks "Reviewed" button
7. Modal closes, status updated
8. Feedback moves from Pending to Reviewed count
```

### Scenario 3: Create Content
```
1. Admin clicks Content tab
2. Clicks "+ Add New Content"
3. Enters title: "Dairy Farming Guide" ✓
4. Enters description: "Complete guide to dairy farming practices..." ✓
5. Selects category: "cattle"
6. Taps image area, selects photo from gallery
7. Clicks "Add"
8. Success alert shows
9. Content appears in list
10. Card shows thumbnail and details
```

---

## ⚡ Performance Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| Admin verification | <500ms | Checks Firestore |
| Load notifications | <1s | Depends on list size |
| Send notification | <1s | Firestore write |
| Load feedback | <1s | Depends on list size |
| Update status | <500ms | Firestore update |
| Add content | <1s | Firestore write |
| Delete content | <500ms | Firestore delete |

---

## 🛠️ Troubleshooting Quick Reference

| Issue | Check | Fix |
|-------|-------|-----|
| No Admin Panel button | `isAdmin` field in Firestore | Set to `true` |
| Can't send notification | Character limits | Title 3-100, Message 10-500 |
| Notifications don't save | Firestore permissions | Check security rules |
| Can't change status | Firestore permissions | Check security rules |
| Image not showing | Image format | Use JPG/PNG |
| Lists empty | No data created | Create test data |
| Slow performance | Large datasets | Implement pagination |

---

## 📊 Data Flow Diagram

```
User Interface
    ↓
Form Validation
    ↓
adminService.js
    ↓
Firebase Auth (Admin check)
    ↓
Firestore Database
    ↓
Collections:
├── notifications (Read/Write)
├── content (Read/Write)
├── feedback (Read/Update)
└── users (Read for isAdmin)
```

---

**This guide provides complete visual and technical reference for the admin panel system.**
