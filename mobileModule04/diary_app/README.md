# Diary App 📖

Mobile Piscine, Module 04: Auth and Database.

A diary app protected by an authentication system. Users sign in with
Google or GitHub (Firebase Authentication) and their entries are stored
in Cloud Firestore.

## Exercises

- **Ex00, Login Page**: a login button leading to the authentication
  page (Google / GitHub), or straight to the diary if a session already
  exists (Firebase persists it).
- **Ex01, Profile Page**: only reachable when logged in. Lists all of
  the user's diary entries live from Firestore, with create (the +
  button), read (tap an entry), and delete (trash icon or the detail
  view). The list updates in real time on create and delete.

## Data model

Firestore collection `entries`, one document per diary entry:

| Field    | Type      | Meaning                        |
|----------|-----------|--------------------------------|
| usermail | string    | Owner's email address          |
| date     | timestamp | When the entry was written     |
| title    | string    | Entry title                    |
| feeling  | string    | Feeling of the day (emoji key) |
| text     | string    | Entry content                  |

## Structure

```text
diary_app/
├── App.js                  # Navigation, gated by auth state
├── firebaseConfig.js       # Your Firebase keys (see SETUP.md)
├── context/AuthContext.js  # Firebase auth state for the whole app
├── services/
│   ├── firebase.js         # App/auth/Firestore initialization
│   ├── authService.js      # Google/GitHub sign-in, sign-out
│   └── diaryService.js     # Entries: live subscribe, create, delete
├── hooks/useNativeAuth.js  # expo-auth-session flows for native builds
├── screens/
│   ├── LoginScreen.js      # Ex00: login button
│   ├── AuthScreen.js       # Ex00: Google / GitHub sign-in
│   └── ProfileScreen.js    # Ex01: entry list + create/read/delete
├── components/             # EntryCard, NewEntryModal, EntryDetailModal
├── constants/              # Theme, feelings list
└── utils/format.js         # Date formatting
```

## Run

First complete [SETUP.md](SETUP.md) (Firebase project, providers, Firestore).

```bash
npm install
npm run web        # or: npm start / npm run android / npm run ios
```
