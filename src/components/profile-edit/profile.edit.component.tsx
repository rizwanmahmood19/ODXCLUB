import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import { KeyboardAwareScrollView, Picker, View } from 'react-native-ui-lib';
import { Formik } from 'formik';

import CustomTextField from '../custom/styleguide-components/custom.text.field.component';
import { LocalizationContext } from '../../services/LocalizationContext';
import CustomPicker from '../custom/styleguide-components/custom.picker.component';
import { Gender, PreferredPlaces, RelationshipStatus } from '@match-app/shared';
import { enumToArray } from '../../util/enumToArray';
import CustomTextArea from '../custom/custom.text.area.component';
import CustomAgePicker from '../custom/custom.age.picker.component';
import ProfileImageLink from './profile.image.link.component';
import useProfileChangeSelector from '../../scenes/profile/profile.change.selector';
import { appColors } from '../../style/appColors';
import { is_iOS } from '../../util/osCheck';
import { noop } from '../../util/noop';

interface ProfileEditProps {
  goToEditPhotos: () => void;
}

const ProfileEdit = (props: ProfileEditProps) => {
  const { goToEditPhotos } = props;
  const { l10n } = useContext(LocalizationContext);

  const {
    initialValues,
    handleTextFieldBlur,
    handlePickerChange,
    validationSchema,
    scrollEnabled,
  } = useProfileChangeSelector();

  const iosLabelStyle = {
    paddingBottom: 5,
    lineHeight: 30,
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      scrollEnabled={scrollEnabled}>
      <ProfileImageLink
        image={
          Array.isArray(initialValues.pictures) &&
          initialValues.pictures.length > 0
            ? initialValues.pictures[0]
            : null
        }
        handlePress={goToEditPhotos}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={noop}>
        {({ values, handleChange, setFieldValue, errors }) => (
          <View style={styles.wrapper}>
            <View style={styles.section}>
              <CustomTextField
                style={
                  errors.name
                    ? [styles.error, styles.fullWidth]
                    : styles.fullWidth
                }
                label={l10n.profile.edit.form.DISPLAY_NAME}
                labelStyle={[
                  errors.name && styles.errorTitle,
                  is_iOS && iosLabelStyle,
                ]}
                value={values.name}
                maxLength={14}
                onChangeText={handleChange('name')}
                onBlur={() =>
                  handleTextFieldBlur('name', values.name, errors.name)
                }
              />
            </View>
            <View style={styles.section}>
              <CustomAgePicker
                label={l10n.profile.edit.form.AGE}
                labelStyle={[
                  errors.birthday && styles.errorTitle,
                  is_iOS && iosLabelStyle,
                ]}
                value={values.birthday}
                style={errors.birthday && styles.error}
                onChange={handlePickerChange(
                  'birthday',
                  setFieldValue,
                  errors.birthday,
                )}
                dateFormat="DD.MM.YYYY"
              />
            </View>
            <View style={styles.section}>
              <CustomTextArea
                label={l10n.profile.edit.form.description.title}
                labelStyle={is_iOS && iosLabelStyle}
                style={styles.fullWidth}
                value={values.description}
                onChangeText={handleChange('description')}
                maxLength={500}
                showCount={true}
                scrollEnabled={values.description.length > 200}
                onBlur={() =>
                  handleTextFieldBlur('description', values.description)
                }
                placeholder={l10n.profile.edit.form.description.description}
              />
            </View>
            <View style={styles.section}>
              <CustomPicker
                label={l10n.profile.edit.form.gender.title}
                labelStyle={[
                  errors.gender && styles.errorTitle,
                  is_iOS && iosLabelStyle,
                ]}
                onChange={handlePickerChange(
                  'gender',
                  setFieldValue,
                  errors.gender,
                )}
                style={
                  errors.gender
                    ? [styles.error, styles.fullWidth]
                    : styles.fullWidth
                }
                value={values.gender}>
                {Object.keys(Gender).map((gdr: string) => (
                  <Picker.Item
                    key={gdr}
                    value={{
                      value: Gender[gdr],
                      label: l10n.profile.edit.form.gender.options[Gender[gdr]],
                    }}
                  />
                ))}
              </CustomPicker>
            </View>
            <View style={styles.section}>
              <CustomPicker
                label={l10n.profile.edit.form.HEIGHT}
                labelStyle={is_iOS && iosLabelStyle}
                onChange={handlePickerChange('height', setFieldValue)}
                style={styles.fullWidth}
                listProps={{
                  initialScrollIndex: 120,
                  getItemLayout: (data: any, index: number) => ({
                    length: 56.5,
                    offset: 56.5 * index,
                    index,
                  }),
                }}
                value={
                  values.height.value
                    ? values.height
                    : { ...values.height, label: '' }
                }>
                {Array.from(Array(191), (_, i) => i + 50).map((height) => (
                  <Picker.Item
                    key={height}
                    value={{
                      value: height,
                      label: `${height} cm`,
                    }}
                  />
                ))}
              </CustomPicker>
            </View>
            <View style={styles.section}>
              <CustomPicker
                label={l10n.profile.edit.form.preferredPlaces.title}
                mode="MULTI"
                onChange={handlePickerChange('preferredPlaces', setFieldValue)}
                style={styles.fullWidth}
                value={values.preferredPlaces}>
                {enumToArray(PreferredPlaces).map((place) => (
                  <Picker.Item
                    key={place}
                    value={PreferredPlaces[place]}
                    label={
                      l10n.profile.edit.form.preferredPlaces.options[
                        PreferredPlaces[place]
                      ]
                    }
                  />
                ))}
              </CustomPicker>
            </View>
            <View style={styles.section}>
              <CustomPicker
                label={l10n.profile.edit.form.relationshipStatus.title}
                style={styles.fullWidth}
                value={values.relationshipStatus}
                onChange={handlePickerChange(
                  'relationshipStatus',
                  setFieldValue,
                )}>
                {enumToArray(RelationshipStatus).map((status) => (
                  <Picker.Item
                    key={status}
                    value={{
                      value: RelationshipStatus[status],
                      label:
                        l10n.profile.edit.form.relationshipStatus.options[
                          RelationshipStatus[status]
                        ],
                    }}
                  />
                ))}
              </CustomPicker>
            </View>
            <View style={styles.section}>
              <CustomTextField
                label={l10n.profile.edit.form.PLACE}
                style={styles.fullWidth}
                onChangeText={handleChange('place')}
                onBlur={() => handleTextFieldBlur('place', values.place)}
                value={values.place}
              />
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  error: {
    borderColor: appColors.secondary,
  },
  errorTitle: {
    color: appColors.secondary,
  },
  fullWidth: {
    flex: 1,
  },
  section: {
    flex: 1,
    marginBottom: 0,
    paddingBottom: is_iOS ? 10 : 15,
  },
  wrapper: {
    paddingBottom: 22,
  },
});

export default ProfileEdit;
