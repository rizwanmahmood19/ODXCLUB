import React, { useContext } from 'react';
import {
  KeyboardAwareScrollView,
  Picker,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import { Formik } from 'formik';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { openSettings } from 'react-native-permissions';
import {
  Gender,
  MAX_SEARCH_RADIUS,
  MIN_SEARCH_RADIUS,
  USER_MAX_AGE,
  USER_MIN_AGE,
} from '@match-app/shared/src';

import { LocalizationContext } from '../../services/LocalizationContext';
import useProfileSettingsSelector, {
  SettingsLinkAction,
} from './profile.settings.selector';
import CustomPicker from '../custom/styleguide-components/custom.picker.component';
import CustomSlider from '../custom/styleguide-components/custom.slider.component';
import { enumToArray } from '../../util/enumToArray';
import CustomMultiSlider from '../custom/styleguide-components/custom.multi.slider';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import CustomActionSheet from '../custom/custom.action.sheet.component';
import Headline from '../custom/styleguide-components/headline.component';
import InfoText from '../custom/styleguide-components/info.text.component';
import { Separator } from '../custom/styleguide-components/Separator';
import Label from '../custom/styleguide-components/label.component';
import { CustomTextFieldStageComponent } from '../custom/styleguide-components/custom.text.field.stage.component';
import { CustomSwitch } from '../custom/styleguide-components/custom.switch.component';
import { getVersion } from 'react-native-device-info';
import { noop } from '../../util/noop';
import { TrackingContext } from '../../analytics/tracking.context';

interface ProfileSettingsFormProps {
  onChangeCredential: (email: boolean) => void;
}

const ProfileSettingsForm = (props: ProfileSettingsFormProps) => {
  const { onChangeCredential } = props;
  const { l10n } = useContext(LocalizationContext);
  const { trackingEnabled, toggleTracking } = useContext(TrackingContext);
  const {
    initialValues,
    handleAgeChange,
    handleAgeChangeEnd,
    handleSearchRadiusChange,
    handleSearchRadiusChangeEnd,
    handleLinkAction,
    handleDeleteAccount,
    handleSignOut,
    handlePickerChange,
    handleAllowsPassionAlertsChange,
    handleAllowsPushNotificationsChange,
    isSigningOut,
    deleteAccountMenuPresented,
    dismissDeleteAccountMenu,
    isDeletingAccount,
    dismissSignOutMenu,
    signOutMenuPresented,
    user,
    hasPermissionForPushNotifications,
  } = useProfileSettingsSelector();

  const deleteAccountOptions = [
    {
      id: 'option-deleteAccount',
      label: l10n.general.deleteAccountMenu.options.confirm,
      onPress: handleDeleteAccount,
      loading: isDeletingAccount,
    },
  ];

  const signOutOptions = [
    {
      id: 'option-signOut',
      label: l10n.general.logoutAccountMenu.options.confirm,
      onPress: handleSignOut,
      loading: isSigningOut,
    },
  ];

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Formik
        initialValues={initialValues || {}}
        enableReinitialize={true}
        onSubmit={noop}>
        {({ values, setFieldValue }) => (
          <View>
            <View style={styles.section}>
              <Headline type="h3" isCentered style={styles.heading}>
                {l10n.profile.settings.headers.searchParams}
              </Headline>
              <View style={[styles.sectionContent, styles.genderSection]}>
                <CustomPicker
                  mode="MULTI"
                  label={l10n.profile.settings.form.preferredGender.title}
                  onChange={handlePickerChange(
                    'preferredGender',
                    setFieldValue,
                  )}
                  value={values.preferredGender || []}
                  isValid={values.preferredGender?.length !== 0}>
                  {enumToArray(Gender).map((gender) => (
                    <Picker.Item
                      key={gender}
                      value={Gender[gender as keyof typeof Gender]}
                      label={
                        l10n.profile.settings.form.preferredGender.options[
                          Gender[gender as keyof typeof Gender]
                        ]
                      }
                    />
                  ))}
                </CustomPicker>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.splitTitle}>
                  <Label>{l10n.profile.settings.form.age}</Label>
                  <Label>{`${values.preferredAgeMin} - ${values.preferredAgeMax}`}</Label>
                </View>
                <CustomMultiSlider
                  min={USER_MIN_AGE}
                  max={USER_MAX_AGE}
                  values={[values.preferredAgeMin, values.preferredAgeMax]}
                  onValuesChange={handleAgeChange(setFieldValue, values)}
                  onValuesChangeFinish={handleAgeChangeEnd}
                />
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.splitTitle}>
                  <Label>{l10n.profile.settings.form.searchRadius}</Label>
                  <Label>{`${values.searchRadius} KM`}</Label>
                </View>
                <CustomSlider
                  value={values.searchRadius}
                  maximumValue={MAX_SEARCH_RADIUS}
                  minimumValue={MIN_SEARCH_RADIUS}
                  step={1}
                  onValueChange={handleSearchRadiusChange(setFieldValue)}
                  onSeekEnd={handleSearchRadiusChangeEnd(values.searchRadius)}
                />
              </View>
            </View>
            <Separator />
            <View style={styles.section}>
              <Headline type="h3" isCentered style={styles.heading}>
                {l10n.profile.settings.headers.accountParams}
              </Headline>
              <View style={styles.sectionContent}>
                <Label style={styles.label}>
                  {l10n.profile.settings.form.email.title}
                </Label>
                <CustomTextFieldStageComponent
                  value={user?.email}
                  placeholder={l10n.profile.settings.form.visibleToYou}
                  onPress={() => {
                    onChangeCredential(true);
                  }}
                  isVerified={!(user?.email && !user.emailVerified)}
                />
                {user?.email && !user.emailVerified && (
                  <Text style={styles.notVerifiedText}>
                    {l10n.profile.settings.form.email.notVerified}
                  </Text>
                )}
              </View>
              <View style={styles.sectionContent}>
                <Label style={styles.label}>
                  {l10n.profile.settings.form.phone}
                </Label>
                <CustomTextFieldStageComponent
                  value={user?.phoneNumber}
                  placeholder={l10n.profile.settings.form.visibleToYou}
                  onPress={() => {
                    onChangeCredential(false);
                  }}
                />
              </View>
            </View>
            <Separator />
            <View style={styles.section}>
              <Headline type="h3" isCentered style={styles.heading}>
                {l10n.profile.settings.headers.moreParams}
              </Headline>
              <View style={styles.sectionContent}>
                <View style={styles.toggleContainer}>
                  <Label>
                    {l10n.profile.settings.form.passionAlertsToggle}
                  </Label>
                  <CustomSwitch
                    value={values.allowsPassionAlerts}
                    onValueChange={handleAllowsPassionAlertsChange}
                  />
                </View>
                <View style={styles.spacer} />
                <TouchableOpacity
                  style={styles.toggleContainer}
                  onPress={
                    hasPermissionForPushNotifications !== false
                      ? undefined
                      : openSettings
                  }
                  activeOpacity={hasPermissionForPushNotifications ? 1 : 0.8}>
                  <Label
                    style={
                      hasPermissionForPushNotifications === false
                        ? styles.disabledText
                        : undefined
                    }>
                    {l10n.profile.settings.form.pushToggle}
                  </Label>
                  <CustomSwitch
                    disabled={hasPermissionForPushNotifications === false}
                    value={!!values.allowsPushNotifications}
                    onValueChange={handleAllowsPushNotificationsChange}
                  />
                </TouchableOpacity>
                <View style={styles.spacer} />
                <View style={styles.toggleContainer}>
                  <Label>{l10n.profile.settings.form.trackingToggle}</Label>
                  <CustomSwitch
                    value={trackingEnabled}
                    onValueChange={toggleTracking}
                  />
                </View>
              </View>
            </View>
            <Separator />
            <View style={styles.section}>
              <Headline type="h3" isCentered style={styles.heading}>
                {l10n.profile.settings.headers.contactParams}
              </Headline>
              <TouchableOpacity
                onPress={() => handleLinkAction(SettingsLinkAction.Support)}>
                <InfoText style={styles.link}>
                  {l10n.profile.settings.form.emailSupport}
                </InfoText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLinkAction(SettingsLinkAction.FAQ)}>
                <InfoText style={styles.link}>
                  {l10n.profile.settings.form.faq}
                </InfoText>
              </TouchableOpacity>
            </View>
            <Separator />
            <View style={styles.section}>
              <Headline type="h3" isCentered style={styles.heading}>
                {l10n.profile.settings.headers.legalParams}
              </Headline>
              <TouchableOpacity
                onPress={() => handleLinkAction(SettingsLinkAction.Privacy)}>
                <InfoText style={styles.link}>
                  {l10n.profile.settings.form.privacy}
                </InfoText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLinkAction(SettingsLinkAction.Conditions)}>
                <InfoText style={styles.link}>
                  {l10n.profile.settings.form.conditions}
                </InfoText>
              </TouchableOpacity>
            </View>
            <Separator />
            <View style={styles.section}>
              <Headline type="h3" isCentered style={styles.heading}>
                {l10n.profile.settings.headers.account}
              </Headline>
              {isSigningOut ? (
                <ActivityIndicator
                  size={'small'}
                  color={appColors.primary}
                  style={styles.activity}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => handleLinkAction(SettingsLinkAction.Logout)}>
                  <InfoText style={styles.link}>
                    {l10n.profile.settings.form.logout}
                  </InfoText>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() =>
                  handleLinkAction(SettingsLinkAction.DeleteAccount)
                }>
                <InfoText style={styles.link}>
                  {l10n.profile.settings.form.deleteAccount}
                </InfoText>
              </TouchableOpacity>
              <CustomActionSheet
                title={l10n.general.deleteAccountMenu.title}
                visible={deleteAccountMenuPresented}
                options={deleteAccountOptions}
                handleMenuClose={dismissDeleteAccountMenu}
                renderCancel={!isDeletingAccount}
              />
              <CustomActionSheet
                title={l10n.general.logoutAccountMenu.title}
                visible={signOutMenuPresented}
                options={signOutOptions}
                handleMenuClose={dismissSignOutMenu}
                renderCancel={!isSigningOut}
              />
            </View>
            <Separator />
            <View style={styles.section}>
              <Headline type="h3" isCentered style={styles.heading}>
                {l10n.profile.settings.headers.version}
              </Headline>
              <InfoText style={styles.versionText}>{getVersion()}</InfoText>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  activity: {
    height: 17,
    paddingBottom: 9,
  },
  container: {
    flex: 1,
  },
  disabledText: {
    color: appColors.mediumGrey,
  },
  genderSection: {
    paddingBottom: 24,
  },
  heading: {
    paddingBottom: 21,
  },
  label: {
    paddingBottom: 6,
  },
  link: {
    paddingBottom: 9,
  },
  notVerifiedText: {
    alignSelf: 'center',
    color: appColors.secondary,
    fontFamily: appFont.medium,
    fontSize: 11,
  },
  section: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    paddingTop: 12,
  },
  sectionContent: {
    paddingBottom: 9,
    paddingHorizontal: '4%',
    width: '100%',
  },
  spacer: {
    height: 10,
  },
  splitTitle: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  versionText: {
    color: appColors.mediumGrey,
    fontFamily: appFont.bold,
    fontSize: 12,
    paddingBottom: 9,
  },
});

export default ProfileSettingsForm;
