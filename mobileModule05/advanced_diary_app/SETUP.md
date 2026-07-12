# Firebase setup (required before first run)

The app needs a Firebase project. This takes about 10 minutes and is all
point-and-click in the browser.

## 1. Create the Firebase project

1. Go to https://console.firebase.google.com and click **Add project**.
2. Name it `diary-app` (any name works). Analytics can stay off.

## 2. Register a Web app and copy the config

1. In the project overview, click the **`</>` (Web)** icon to add a web app.
2. Nickname: `diary_app`. No hosting needed.
3. Copy the `firebaseConfig` object it shows you into
   [firebaseConfig.js](firebaseConfig.js) (apiKey, authDomain, projectId,
   storageBucket, messagingSenderId, appId).

## 3. Enable Google sign-in

1. Left menu: **Build > Authentication > Get started**.
2. **Sign-in method** tab > **Add new provider > Google** > Enable.
3. Pick a support email, save.

## 4. Enable GitHub sign-in

1. Same **Sign-in method** tab > **Add new provider > GitHub**.
2. Firebase shows you a **callback URL** (like
   `https://YOUR_PROJECT.firebaseapp.com/__/auth/handler`). Copy it.
3. In another tab go to https://github.com/settings/developers >
   **New OAuth App**:
   - Application name: `diary_app`
   - Homepage URL: `https://YOUR_PROJECT.firebaseapp.com`
   - Authorization callback URL: paste the callback URL from Firebase.
4. Register, then **Generate a new client secret**.
5. Paste the GitHub **Client ID** and **Client secret** back into the
   Firebase GitHub provider dialog and save.

## 5. Create the Firestore database

1. Left menu: **Build > Firestore Database > Create database**.
2. Choose a location, start in **production mode**.
3. **Rules** tab: replace the rules with the ones below and publish.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /entries/{entryId} {
      allow read, delete: if request.auth != null
        && resource.data.usermail == request.auth.token.email;
      allow create: if request.auth != null
        && request.resource.data.usermail == request.auth.token.email;
    }
  }
}
```

No need to create the `entries` collection by hand; the first saved entry
creates it.

## 6. Run it

```bash
npm install
npm run web        # web: Google/GitHub popups work out of the box
```

For `localhost` sign-in to work, check that **Authentication > Settings >
Authorized domains** includes `localhost` (it does by default).

## 7. Native builds only (optional for now)

Web needs nothing beyond the steps above. To sign in from an Android/iOS
build, additionally fill in `googleNativeConfig` and `githubNativeConfig`
in [firebaseConfig.js](firebaseConfig.js):

- **Google client IDs**: Google Cloud console > APIs & Services >
  Credentials (Firebase already created a Web client; add Android/iOS
  clients with the package name `com.kebl3541.diaryapp`).
- **GitHub**: reuse the OAuth app from step 4, but GitHub OAuth apps only
  allow one callback URL. Create a second OAuth app with callback
  `diaryapp://` for native, and put its ID/secret in `githubNativeConfig`.

## 8. For the evaluation

The subject requires a throwaway Google account for the evaluator, with a
few diary entries already created. Make one at https://accounts.google.com
and log in with it once to seed some entries.
