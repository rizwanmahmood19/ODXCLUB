import React, { useContext } from 'react';
import { IBlockedProfile, IPublicProfile } from '@match-app/shared';
import { Text, Toast, View } from 'react-native-ui-lib';
import { LocalizationContext } from '../../services/LocalizationContext';
import InfoText from '../custom/styleguide-components/info.text.component';
import { ChatInputInner } from '../chat/chat-input/chat.input.inner.component';
import AudioIcon from '../../../assets/icons/matchapp_microphone_white.svg';
import SendIcon from '../../../assets/icons/matchapp_send_white.svg';
import { useSendSecretMessageSelector } from './send.secret.messsage.selector';
import { appColors } from '../../style/appColors';
import { secretMessageStyles } from './secret.message.styles';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { is_iOS } from '../../util/osCheck';

interface SendSecretMessageProps {
  profile: IPublicProfile | IBlockedProfile;
}

const SendSecretMessage: React.FC<SendSecretMessageProps> = ({ profile }) => {
  const { l10n } = useContext(LocalizationContext);
  const {
    error,
    onErrorDismiss,
    loading,
    setMessage,
    message,
    onAudio,
    onSend,
  } = useSendSecretMessageSelector(profile);
  return (
    <>
      <Toast
        visible={!!error}
        message={error && l10n.secretMessage.send.error}
        showDismiss
        allowDismiss
        zIndex={200}
        onDismiss={onErrorDismiss}
        backgroundColor={appColors.red}
      />

      <View useSafeArea style={styles.content}>
        <KeyboardAvoidingView behavior={is_iOS ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">
            <View style={secretMessageStyles.textContainer}>
              <Text style={secretMessageStyles.headline}>
                {l10n.secretMessage.title}
              </Text>
              <InfoText style={secretMessageStyles.infoText}>
                {l10n.formatString(l10n.secretMessage.send.text, profile.name)}
              </InfoText>
            </View>
            <ChatInputInner
              message={message}
              onAudio={onAudio}
              placeholder={l10n.formatString(
                l10n.secretMessage.send.placeholder,
                profile.name,
              )}
              onMessageChange={setMessage}
              isLoading={loading}
              isDisabled={loading || !message.length}
              SendIcon={SendIcon}
              AudioIcon={AudioIcon}
              color="#FFFFFF"
              textColor="#FFFFFF"
              placeholderColor="#FFFFFF"
              onSend={onSend}
              maxLength={140}
              isSecretMessage
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    zIndex: 3,
  },
});

export default SendSecretMessage;
