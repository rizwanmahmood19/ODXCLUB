import React from 'react';
import { Image, ScrollBar, TouchableOpacity, View } from 'react-native-ui-lib';
import { ActivityIndicator, StyleSheet } from 'react-native';
import DeleteIcon from '../../../../assets/icons/matchapp_remove_picture.svg';
import { appStyles } from '../../../style/appStyle';
import { LocalAttachment } from './saved.attachment.list.component';
import { is_android } from '../../../util/osCheck';
import VideoIcon from '../../../../assets/icons/matchapp_ic_video-galerie-Icon_on_pic.svg';
import { appColors } from '../../../style/appColors';

interface ChatInputPicturesProps {
  selectedAttachments?: LocalAttachment[];
  isProcessingAttachment?: boolean;
  onDelete: (index: number) => void;
}

const ChatInputPictures = (props: ChatInputPicturesProps) => {
  const { selectedAttachments, onDelete, isProcessingAttachment } = props;

  const handleDelete = (index: number) => () => onDelete(index);
  return (
    <View style={styles.container}>
      <ScrollBar containerProps={{ style: styles.scrollbar }}>
        {isProcessingAttachment && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>
        )}
        {Array.isArray(selectedAttachments) &&
          selectedAttachments.map((attachment, index) => (
            <View style={styles.imageContainer} key={attachment.filePath}>
              <Image
                style={styles.image}
                source={{
                  uri: is_android
                    ? `file:///${
                        attachment.thumbnailPath || attachment.filePath
                      }`
                    : attachment.thumbnailPath || attachment.filePath,
                }}
              />
              {attachment.isVideo && (
                <VideoIcon style={styles.videoIcon} height={20} width={20} />
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete(index)}
                activeOpacity={0.8}>
                <DeleteIcon height={25} width={25} />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollBar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  deleteButton: {
    position: 'absolute',
    right: 16,
    top: 8,
  },
  image: {
    borderRadius: appStyles.borderRadius,
    flex: 1,
    height: 120,
    resizeMode: 'cover',
    width: 120,
  },
  imageContainer: {
    flex: 1,
    paddingRight: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: appStyles.borderRadius,
    display: 'flex',
    flex: 1,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  scrollbar: {
    flex: 1,
  },
  videoIcon: {
    bottom: 7,
    left: 10,
    position: 'absolute',
  },
});

export default ChatInputPictures;
