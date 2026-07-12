import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';

import { googleNativeConfig, githubNativeConfig } from '../firebaseConfig';
import {
  signInWithGoogleIdToken,
  signInWithGithubAccessToken,
} from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

const githubDiscovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

// OAuth flows for native builds (Android/iOS), where Firebase popups
// are unavailable. Each flow ends by exchanging the provider token for
// a Firebase credential.
export function useNativeGoogleAuth(onError) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: googleNativeConfig.webClientId,
    androidClientId: googleNativeConfig.androidClientId || undefined,
    iosClientId: googleNativeConfig.iosClientId || undefined,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params?.id_token;
      if (idToken) {
        signInWithGoogleIdToken(idToken).catch(onError);
      }
    } else if (response?.type === 'error') {
      onError(response.error ?? new Error('Google sign-in failed'));
    }
  }, [response]);

  return { promptAsync, ready: !!request };
}

export function useNativeGithubAuth(onError) {
  const redirectUri = makeRedirectUri({ scheme: 'advanceddiaryapp' });
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: githubNativeConfig.clientId,
      scopes: ['read:user', 'user:email'],
      redirectUri,
    },
    githubDiscovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      exchangeGithubCode(response.params.code, redirectUri)
        .then(signInWithGithubAccessToken)
        .catch(onError);
    } else if (response?.type === 'error') {
      onError(response.error ?? new Error('GitHub sign-in failed'));
    }
  }, [response]);

  return { promptAsync, ready: !!request };
}

async function exchangeGithubCode(code, redirectUri) {
  const res = await fetch(githubDiscovery.tokenEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: githubNativeConfig.clientId,
      client_secret: githubNativeConfig.clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(data.error_description ?? 'GitHub token exchange failed');
  }
  return data.access_token;
}
