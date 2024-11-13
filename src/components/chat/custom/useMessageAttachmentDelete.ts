import { useState } from 'react';
import { useAxios } from '../../../util/useAxios';
import { MessageType } from 'stream-chat-react-native-core/src/components/MessageList/hooks/useMessageList';

const AttachmentDeleteMap: { [key: string]: string } = {
  audio: '/conversation/attachment/audio',
  video: '/conversation/attachment/video',
  image: '/conversation/attachment/picture',
  picture: '/conversation/attachment/picture',
};

export function useMessageAttachmentDelete(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [{ error }, deleteAttachment] = useAxios({
    method: 'DELETE',
    initial: false,
  });
  return {
    isLoading,
    error,
    deleteMessageAttachments: async (message: MessageType) => {
      setIsLoading(true);
      if (message.attachments && message.attachments.length > 0) {
        await Promise.all(
          message.attachments.map(async (attachment) => {
            const apiBase =
              AttachmentDeleteMap[(attachment.type || '')?.toLowerCase()];
            if (!apiBase) {
              return;
            }
            // If fileName is undefined, tries to get the fileName from the URL
            const fileName =
              attachment.fileName || attachment.asset_url?.split('/').pop();
            return deleteAttachment({
              url: `${apiBase}/${fileName}`,
            });
          }),
        );
      }
      setIsLoading(false);
      onSuccess?.();
    },
  };
}
