// This file handles the authentication state.

import { Session } from "@ory/client"
import AsyncStore from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"
import { Platform } from "react-native"

// The key under which the session is being stored
const userSessionName = "user_session"

// The session type
export type SessionContext = {
  // The session token
  session_token: string

  // The session itself
  session: Session
} | null

// getAuthenticatedSession returns a promise with the session of the authenticated user, if the
// user is authenticated or null is the user is not authenticated.
//
// If an error (e.g. network error) occurs, the promise rejects with an error.
export const getAuthenticatedSession = (): Promise<SessionContext> => {
  const parse = (sessionRaw: string | null): SessionContext => {
    if (!sessionRaw) {
      return null
    }

    // sessionRaw is a JSON String that needs to be parsed.
    return JSON.parse(sessionRaw)
  }

  let p = AsyncStore.getItem(userSessionName)
  if (Platform.OS !== "web") {
    // We can use SecureStore if not on web instead!
    p = SecureStore.getItemAsync(userSessionName)
  }

  return p.then(parse)
}

// Sets the session.
export const setAuthenticatedSession = (
  session: SessionContext,
): Promise<void> => {
  if (!session) {
    return killAuthenticatedSession()
  }

  if (Platform.OS === "web") {
    // SecureStore is not available on the web platform. We need to use AsyncStore
    // instead.
    return AsyncStore.setItem(userSessionName, JSON.stringify(session))
  }

  return (
    SecureStore
      // The SecureStore only supports strings so we encode the session.
      .setItemAsync(userSessionName, JSON.stringify(session))
  )
}

// Removes the session from the store.
export const killAuthenticatedSession = () => {
  if (Platform.OS === "web") {
    // SecureStore is not available on the web platform. We need to use AsyncStore
    // instead.
    return AsyncStore.removeItem(userSessionName)
  }

  return SecureStore.deleteItemAsync(userSessionName)
}
