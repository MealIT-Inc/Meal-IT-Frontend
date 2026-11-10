"use client";

import { useEffect } from "react";
import getFirebaseAuth from "@/lib/firebase";

// Create the Auth instance as soon as the login/signup pages load.
// Otherwise it's first created inside the Google button's click handler, and
// the popup starts before Firebase's auth iframe is ready — the first attempt
// then fails (e.g. auth/invalid-api-key) and only the second click works.
export function FirebaseAuthWarmup() {
  useEffect(() => {
    getFirebaseAuth();
  }, []);
  return null;
}
