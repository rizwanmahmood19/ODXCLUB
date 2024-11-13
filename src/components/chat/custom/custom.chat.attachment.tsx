import React from 'react';
import { Attachment, useMessageContext } from 'stream-chat-react-native';
import AudioMessage from '../audio-messages/audio.message.component';
import VideoMessage from '../video-message/video.message.component';
import { Attachment as AttachmentType } from 'stream-chat/dist/types/types';

type CustomChatAttachmentProps = {
  attachment: AttachmentType;
  isDeckSecretMessage?: boolean;
};
const CustomChatAttachment: React.FC<CustomChatAttachmentProps> = ({
  attachment,
  isDeckSecretMessage,
}) => {
  const { isMyMessage, message } = useMessageContext();
  switch (attachment.type) {
    case 'audio':
      return attachment.asset_url ? (
        <AudioMessage
          isMyMessage={isMyMessage}
          audioUrl={attachment.asset_url}
          duration={attachment.duration as number}
          isChatSecretMessage={message?.isSecretMessage as boolean}
          isDeckSecretMessage={!!isDeckSecretMessage}
        />
      ) : null;
    case 'video':
      return attachment.asset_url ? (
        <VideoMessage
          videoUrl={attachment.asset_url}
          thumbnailUrl={attachment.thumb_url}
          hasText={!!message.text}
        />
      ) : null;
    default:
      return <Attachment attachment={attachment} />;
  }
};

export default CustomChatAttachment;
