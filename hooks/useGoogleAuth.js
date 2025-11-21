import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "TU_EXPO_CLIENT_ID",
    iosClientId: "TU_IOS_CLIENT_ID",
    androidClientId: "TU_ANDROID_CLIENT_ID",
    webClientId: "TU_WEB_CLIENT_ID",
  });

  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params;

        const credential = GoogleAuthProvider.credential(id_token);

        await signInWithCredential(auth, credential);
      }
    };

    signInWithGoogle();
  }, [response]);

  return {
    promptGoogleLogin: () => promptAsync(),
    request
  };
}
