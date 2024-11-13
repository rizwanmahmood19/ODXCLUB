// List of route names for react navigation.
// Don't use the enum values for translations etc.

export enum AppRoute {
  LOADING = 'Loading',
  AUTH = 'Auth',
  ALLOW_GPS = 'AllowGPS',
  ALLOW_PUSH_NOTIFICATIONS = 'AllowPushNotifications',
  SIGN_IN_CHOICE = 'SignInChoice',
  SIGN_IN_MAIL = 'SignInMail',
  SIGN_UP_CHOICE = 'SignUpChoice',
  SIGN_UP_MAIL = 'SignUpMail',
  SIGN_UP_MAIL_ENTER_MAIL = 'SignUpMailEnterMail',
  SIGN_UP_MAIL_ENTER_PASSWORD = 'SignUpMailEnterPassword',
  SIGN_UP_PHONE = 'SignUpPhone',
  SIGN_UP_PHONE_ENTER_NUMBER = 'SignUpPhoneEnterNumber',
  SIGN_UP_PHONE_ENTER_CODE = 'SignUpPhoneEnterCode',
  HOME = 'Home',
  CONVERSATION = 'Conversation',
  DISCOVER = 'Discover',
  MAYBE = 'Maybe',
  PASSION_ALERT = 'PassionAlert',
  PROFILE = 'Profile',
  PROFILE_EDIT = 'ProfileEdit',
  PROFILE_EDIT_EDITOR = 'ProfileEditEditor',
  PROFILE_EDIT_PREVIEWER = 'ProfileEditPreviewer',
  PROFILE_EDIT_PHOTOS = 'ProfileEditPhotos',
  PROFILE_SETTINGS = 'ProfileSettings',
  PHOTO_EDIT = 'PhotoEdit',
  PHOTO_UPDATE = 'PhotoUpdate',
  CHAT = 'Chat',
  FORGOT_PASSWORD_ENTER_MAIL = 'ForgotPasswordEnterMail',
  ONBOARDING = 'Onboarding',
  MAIL_NOT_VERIFIED = 'MailNotVerified',
  CHANGE_CREDENTIAL = 'ChangeCredential',
  CHANGE_CREDENTIAL_MAIL = 'ChangeCredentialMail',
  CHANGE_CREDENTIAL_MAIL_SUCCESS = 'ChangeCredentialMailSuccess',
  CHANGE_CREDENTIAL_PHONE_NUMBER = 'ChangeCredentialPhoneNumber',
  APP_BLOCKER = 'AppBlocker',
  BLOCKED_USER = 'BlockedUser',
  TRACKING_DECISION = 'TrackingDecision',
  TUTORIAL = 'Tutorial',
  INITIAL_TOS = 'INITIAL_TOS',
  SECRET_MESSAGE = 'SecretMessage',
}

export enum ChangeCredentialMail {
  ENTER_NEW_MAIL = 'ChangeCredentialMailEnterNewMail',
  ENTER_PASSWORD = 'ChangeCredentialMailEnterPassword',
  VERIFY = 'ChangeCredentialMailVerify',
}

export enum ChangeCredentialPhone {
  ENTER_NEW_NUMBER = 'ChangeCredentialPhoneEnterNewNumber',
  ENTER_PASSWORD = 'ChangeCredentialPhoneEnterPassword',
  VERIFY = 'ChangeCredentialPhoneVerify',
}

export enum OnboardingRoute {
  NAME = 'OnboardingName',
  BIRTHDAY = 'OnboardingBirthday',
  GENDER = 'OnboardingGender',
  PREFERRED_GENDER = 'OnboardingPreferredGender',
  SEARCH_SETTINGS = 'OnboardingSearchSettings',
  PICTURES = 'OnboardingPictures',
  FINISH = 'OnboardingBirthdayFinish',
}
