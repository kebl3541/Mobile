# Advanced Diary App 📖

Mobile Piscine, Module 05: Manage Data and Display. Continuation of Module 04.

A diary app protected by an authentication system. Users sign in with
Google or GitHub (Firebase Authentication) and their entries are stored
in Cloud Firestore.

## Exercises

- **Ex00, Profile Page**: shows the user's name, a logout button, the
  last 2 entries (date, feeling, title), the total number of entries,
  and the percentage of use of each feeling. Entries can be opened for
  details and deleted; a + button adds a new one. Everything updates
  in real time via a Firestore snapshot listener.
- **Ex01, Agenda Page**: a calendar (react-native-calendars) that opens
  on the current date. Selecting a day shows a scrollable list of that
  day's entries; entries can be opened for details and deleted, and the
  list updates accordingly.

Login works as in Module 04: Google or GitHub via Firebase
Authentication, with the session persisted.

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
advanced_diary_app/
├── App.js                  # Navigation, gated by auth state
├── firebaseConfig.js       # Your Firebase keys (see SETUP.md)
├── context/AuthContext.js  # Firebase auth state for the whole app
├── services/
│   ├── firebase.js         # App/auth/Firestore initialization
│   ├── authService.js      # Google/GitHub sign-in, sign-out
│   └── diaryService.js     # Entries: live subscribe, create, delete
├── hooks/useNativeAuth.js  # expo-auth-session flows for native builds
├── screens/
│   ├── LoginScreen.js      # Login button
│   ├── AuthScreen.js       # Google / GitHub sign-in
│   ├── ProfileScreen.js    # Ex00: stats, last 2 entries, feelings
│   └── AgendaScreen.js     # Ex01: calendar + entries per day
├── components/             # EntryCard, FeelingStats, modals
├── constants/              # Theme, feelings list
└── utils/format.js         # Date formatting
```

## Run

First complete [SETUP.md](SETUP.md) (Firebase project, providers, Firestore).

```bash
npm install
npm run web        # or: npm start / npm run android / npm run ios
```
