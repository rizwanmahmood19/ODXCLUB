import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import { appColors } from '../../style/appColors';
import { appFont } from '../../style/appFont';
import VideoOutgoingIcon from '../../../assets/icons/matchapp_video_icon_outgoing.svg';
import VideoIncomingIcon from '../../../assets/icons/matchapp_video_icon_incoming.svg';
import moment from 'moment';
import { LocalizationContext } from '../../services/LocalizationContext';
import { ChatContext } from '../../states/chat.state';
import { useMessageContext } from 'stream-chat-react-native';

const VideoCallInfoMessage = () => {
  const { isMyMessage, message } = useMessageContext();
  const { l10n } = useContext(LocalizationContext);

  const { openVideoModal } = useContext(ChatContext);

  return (
    <TouchableOpacity style={styles.container} onPress={openVideoModal}>
      <View style={styles.content}>
        {isMyMessage ? <VideoOutgoingIcon /> : <VideoIncomingIcon />}
        <Text style={styles.text}>
          {message.info === 'missed-call'
            ? l10n.videoCall.missed
            : l10n.videoCall.declined}{' '}
          {l10n.formatString(
            l10n.videoCall.timestamp,
            moment(message.created_at).format('LT'),
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: appColors.primary,
    borderRadius: 6,
    height: 24,
    justifyContent: 'center',
    marginVertical: 6,
    width: 230,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#ffffff',
    fontFamily: appFont.medium,
    fontSize: 10,
    paddingLeft: 11,
    textDecorationLine: 'underline',
  },
});
export default VideoCallInfoMessage;
