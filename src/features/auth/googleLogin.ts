import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../lib/firebase";

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  return result.user;
};
