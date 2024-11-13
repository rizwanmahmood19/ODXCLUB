import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { captureMessage } from '@sentry/react-native';

export enum FirebaseAuthError {
  emailAlreadyInUse = 'auth/email-already-in-use',
  noInternet = 'auth/no-internet',
  invalidEmail = 'auth/invalid-email',
  operationNotAllowed = 'auth/operation-not-allowed',
  weakPassword = 'auth/weak-password',
  userDisabled = 'auth/user-disabled',
  tooManyRequests = 'auth/too-many-requests',
  userNotFound = 'auth/user-not-found',
  userMismatch = 'auth/user-mismatch',
  invalidCredential = 'auth/invalid-credential',
  wrongPassword = 'auth/wrong-password',
  credentialAlreadyInUse = 'auth/credential-already-in-use',
  requiresRecentLogin = 'auth/requires-recent-login',
  invalidVerificationCode = 'auth/invalid-verification-code',
  invalidVerificationId = 'auth/invalid-verification-id',
  codeExpired = 'auth/code-expired',
}

export function extractFirebaseError(error: { code: string }) {
  if (
    error.code === 'auth/unknown' &&
    JSON.stringify(error).indexOf('Unable to resolve')
  ) {
    return FirebaseAuthError.noInternet;
  }
  return error.code;
}

export const signUp = async (
  email: string,
  password: string,
): Promise<void> => {
  try {
    if (auth().currentUser) {
      await auth().signOut();
    }
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const signIn = async (
  email: string,
  password: string,
): Promise<void> => {
  try {
    if (auth().currentUser) {
      await auth().signOut();
    }
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error) {
    console.log('failed to sign out');
    console.error(error);
    throw extractFirebaseError(error);
  }
};

export const currentUser = () => {
  return auth().currentUser;
};

export const userToken = async (
  shouldRefresh = true,
): Promise<string | undefined> => {
  try {
    return await auth().currentUser?.getIdToken(shouldRefresh);
  } catch (error) {
    throw error.code;
  }
};

export const sendEmailVerification = async (): Promise<void> => {
  try {
    await auth().currentUser?.sendEmailVerification();
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const signInWithPhoneNumber = async (
  phoneNumber: string,
): Promise<FirebaseAuthTypes.ConfirmationResult> => {
  try {
    if (auth().currentUser) {
      await auth().signOut();
    }
    // always forceResend (e.g. user submits number, goes back and submits it again)
    return await auth().signInWithPhoneNumber(phoneNumber, true);
  } catch (error) {
    console.error(error);
    throw extractFirebaseError(error);
  }
};

export const verifyBeforeUpdateEmail = async (email: string): Promise<void> => {
  try {
    await auth().currentUser?.verifyBeforeUpdateEmail(email);
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const resendVerificationEmail = async (): Promise<void> => {
  try {
    await auth().currentUser?.sendEmailVerification();
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const updateEmail = async (email: string): Promise<void> => {
  const user = auth().currentUser;
  if (!user) {
    throw FirebaseAuthError.operationNotAllowed;
  }

  await user.updateEmail(email);
};

export const updatePassword = async (password: string): Promise<void> => {
  const user = auth().currentUser;
  if (!user) {
    throw FirebaseAuthError.operationNotAllowed;
  }

  await user.updatePassword(password);
};

export const updatePhoneNumber = async (
  vId: string,
  code: string,
): Promise<void> => {
  const user = auth().currentUser;
  if (!user) {
    throw FirebaseAuthError.operationNotAllowed;
  }
  try {
    const credential = auth.PhoneAuthProvider.credential(vId, code);
    await user.updatePhoneNumber(credential);
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const createPhoneVerificationID = async (
  number?: string,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const user = auth().currentUser;

    if (!user) {
      reject();
      return;
    }
    const n = number ? number : user.phoneNumber;
    if (!n) {
      reject();
      return;
    }
    auth()
      .verifyPhoneNumber(n)
      .on('state_changed', (phoneAuthSnapshot) => {
        switch (phoneAuthSnapshot.state) {
          case 'sent':
          case 'verified':
            resolve(phoneAuthSnapshot.verificationId);
            break;
          case 'timeout':
          case 'error':
          default:
            reject();
            break;
        }
      });
  });
};

export const reauthenticateWithPhone = async (
  token: string,
  secret: string,
): Promise<void> => {
  const user = auth().currentUser;

  if (!user?.phoneNumber) {
    throw FirebaseAuthError.operationNotAllowed;
  }

  const credential = auth.PhoneAuthProvider.credential(token, secret);

  try {
    await user.reauthenticateWithCredential(credential);
  } catch (error) {
    throw extractFirebaseError(error);
  }
};

export const reauthenticateWithEmail = async (
  secret: string,
): Promise<void> => {
  const user = auth().currentUser;

  if (!user?.email) {
    throw FirebaseAuthError.invalidEmail;
  }

  const credential = auth.EmailAuthProvider.credential(user.email, secret);

  try {
    await user.reauthenticateWithCredential(credential);
  } catch (error) {
    throw extractFirebaseError(error);
  }
  return;
};

export const parseFirebaseSignUpError = (
  errorText: string,
  l10n: any,
): string => {
  switch (errorText) {
    case FirebaseAuthError.noInternet:
      return l10n.error.auth.signUp.noInternet;
    case FirebaseAuthError.emailAlreadyInUse:
      return l10n.error.auth.invalidEmailOrPassword;
    case FirebaseAuthError.invalidEmail:
      return l10n.error.auth.signUp.invalidEmail;
    case FirebaseAuthError.operationNotAllowed:
      return l10n.error.auth.signUp.operationNotAllowed;
    case FirebaseAuthError.weakPassword:
      return l10n.error.auth.signUp.weakPassword;
    case FirebaseAuthError.tooManyRequests:
      return l10n.error.auth.signUp.tooManyRequests;
    case FirebaseAuthError.invalidVerificationCode:
      return l10n.error.auth.signUp.invalidVerificationCode;
    case FirebaseAuthError.credentialAlreadyInUse:
      return l10n.error.auth.signUp.credentialAlreadyInUse;
    case FirebaseAuthError.codeExpired:
      return l10n.error.auth.signUp.codeExpired;
    case FirebaseAuthError.userNotFound:
      return l10n.error.auth.signUp.userNotFound;
    case FirebaseAuthError.userMismatch:
    case FirebaseAuthError.invalidCredential:
    case FirebaseAuthError.wrongPassword:
    case FirebaseAuthError.invalidVerificationId:
      return l10n.error.generalCredential;
    default:
      captureMessage('an unknown firebase error occurred', {
        extra: { errorText },
      });
      return l10n.error.unknown;
  }
};
