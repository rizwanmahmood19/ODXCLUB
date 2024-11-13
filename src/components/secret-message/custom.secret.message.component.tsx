import React from 'react';
import { MessageSimple } from 'stream-chat-react-native';
import { View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import CustomChatAttachment from '../chat/custom/custom.chat.attachment';

const CustomSecretMessage = (props: any) => {
  return (
    <>
      <MessageSimple
        {...props}
        ReactionList={null}
        Attachment={CustomChatAttachment}
        messageActions={() => []}
        actionsEnabled={false}
        reactionPickerVisible={false}
        actionSheetVisible={false}
        showMessageStatus={false}
      />
      <View style={styles.footer} />
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingBottom: 15,
  },
});

export default CustomSecretMessage;
