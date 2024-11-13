export enum MatchDecisionEvent {
  left = 'left',
  right = 'right',
  maybe = 'maybe',
}

export enum MatchDecisionResultEvent {
  newMatch = 'new_match',
}

export enum ScreenEvent {
  maybeList = 'maybe_list',
  newMatchesMessagesList = 'new_matches_messages_list',
  recommendationStream = 'recommendation_stream',
  recommendationDetail = 'recommendation_detail',
  settings = 'settings',
  myAccount = 'my_account',
  paywall = 'paywall_displayed',
}

export enum UserInteractionEvent {
  swipe = 'swipe',
  click = 'click',
  send = 'send',
}

export enum MessageEvent {
  passionAlert = 'message_passion_alert',
  text = 'message_text',
  audio = 'message_audio',
  photo = 'message_photo',
  video = 'message_video',
}

export enum SecretMessageEvent {
  text = 'secret_message_text',
  audio = 'secret_message_audio',
  open = 'secret_message_open',
}

export enum OnboardingEvent {
  started = 'onboarding_started',
  completed = 'onboarding_completed',
}

export enum VideoCallEvent {
  initiate = 'initiate_video_call',
  accept = 'accept_video_call',
}

export enum VideoUploadEvent {
  record = 'record_video',
  select = 'select_video_from_gallery',
}

export enum FunnelEvents {
  emailRegistration = 'fb_regpro_emailregistration',
  enterEmail = 'fb_regpro_enteremail',
  emailRegistrationSuccessful = 'fb_regpro_password_successful',
  emailRegistrationUnsuccessful = 'fb_regpro_password_unsuccessful',
  goToLogin = 'fb_regpro_gotologin',
  emailLoginSuccessful = 'fb_regpro_login_successful',
  emailLoginUnsuccessful = 'fb_regpro_login_unsuccessful',
  onBoardingDisplayName = 'fb_regpro_displayname',
  onBoardingAge = 'fb_regpro_age',
  onBoardingGender = 'fb_regpro_gender',
  onBoardingLookingFor = 'fb_regpro_lookingfor',
  onBoardingAgeRange = 'fb_regpro_agerange',
  onBoardingBlurEffect = 'fb_regpro_blureffect',
  onBoardingPhotos = 'fb_regpro_photos',
  letsDoThisButton = 'fb_regpro_letsdothis',
  phoneRegistration = 'fb_regpro_phonenumber',
  enterPhoneNumberSuccessful = 'fb_regpro_entermobilenumber_successful',
  enterPhoneNumberUnsuccessful = 'fb_regpro_entermobilenumber_unsuccessful',
  smsCodeSuccessful = 'fb_regpro_smscode_successful',
  smsCodeUnsuccessful = 'fb_regro_smscode_unsuccessful',
}
