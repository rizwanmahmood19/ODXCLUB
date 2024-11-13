import React, { useContext } from 'react';
import { ActionSheet, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { LocalizationContext } from '../../services/LocalizationContext';
import { appFont } from '../../style/appFont';
import Headline from './styleguide-components/headline.component';

interface ActionSheetOption {
  id: string;
  label: string;
  onPress: () => void;
  loading?: boolean;
}

interface CustomActionSheetProps {
  title: string;
  visible: boolean;
  options: ActionSheetOption[];
  handleMenuClose: () => void;
  renderCancel?: boolean;
  cancelLabel?: string;
  onModalDismissed?: () => void;
}

const CustomActionSheet = (props: CustomActionSheetProps) => {
  const {
    title,
    visible,
    options,
    handleMenuClose,
    onModalDismissed,
    renderCancel,
    cancelLabel,
  } = props;
  const { l10n } = useContext(LocalizationContext);
  const actionOptions = renderCancel
    ? [
        ...options,
        {
          id: 'option-cancel',
          label: cancelLabel || l10n.buttons.cancel,
          onPress: handleMenuClose,
        },
      ]
    : options;

  const renderTitle = () => (
    <View>
      <Headline type="h3" style={styles.title}>
        {title}
      </Headline>
    </View>
  );

  // option was set to any because we need to pass the 'id to the options as well
  // So that we can identify which action shall render the loading spinner
  const renderAction = (option: ActionSheetOption, index: number) => (
    <View key={`action-${option.id}`}>
      <TouchableOpacity
        style={
          index === actionOptions.length - 1
            ? styles.optionButtonLast
            : styles.optionButton
        }
        disabled={option.loading}
        onPress={option.onPress}>
        <Text
          style={
            option.id === 'option-cancel'
              ? styles.optionTextCancel
              : styles.optionText
          }
          maxFontSizeMultiplier={2}>
          {option.label}
        </Text>
        {option.loading && (
          <ActivityIndicator
            style={
              index === 0
                ? [styles.loading, styles.loadingFirst]
                : styles.loading
            }
            size={'small'}
            color={appColors.primary}
          />
        )}
      </TouchableOpacity>
      {index !== actionOptions.length - 1 && <View style={styles.separator} />}
    </View>
  );

  return (
    <ActionSheet
      visible={visible}
      onDialogDismissed={() =>
        onModalDismissed ? onModalDismissed() : undefined
      }
      containerStyle={styles.container}
      renderTitle={renderTitle}
      renderAction={renderAction}
      options={actionOptions}
      onDismiss={handleMenuClose}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 0,
    marginHorizontal: 15,
  },
  loading: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loadingFirst: {
    top: 7,
  },
  optionButton: {
    padding: 14,
  },
  optionButtonLast: {
    padding: 14,
    paddingBottom: 20,
  },
  optionText: {
    color: 'black',
    fontFamily: appFont.bold,
    fontSize: 16,
    textAlign: 'center',
  },
  optionTextCancel: {
    color: appColors.darkGrey,
    fontFamily: appFont.bold,
    fontSize: 16,
    textAlign: 'center',
  },
  separator: {
    borderBottomColor: appColors.mediumGrey,
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    padding: 10,
    paddingBottom: 10,
    paddingTop: 20,
    textAlign: 'center',
  },
});

export default CustomActionSheet;
