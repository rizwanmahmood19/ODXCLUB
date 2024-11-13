import React from 'react';
import { Image, ScrollBar, TouchableOpacity, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import PersonIcon from '../../../../assets/icons/matchapp_ic_account_circle.svg';
import AddIcon from '../../../../assets/icons/matchapp_add_picture.svg';
import { appColors } from '../../../style/appColors';
import { appStyles } from '../../../style/appStyle';
import { is_android } from '../../../util/osCheck';
import VideoIcon from '../../../../assets/icons/matchapp_ic_video-galerie-Icon_on_pic.svg';
import { ChatInputActionSheet } from './chat.input.actionsheet';
import { useToggle } from '../../../util/useToggle';

const IMAGE_SIZE = 100;
const PERSON_ICON_SIZE = 48;

export type LocalAttachment = {
  filePath: string;
  thumbnailPath?: string;
  isVideo?: boolean;
  localId?: string;
  usedAtTimestamp?: number;
};

interface SavedPicturesListProps {
  attachments: LocalAttachment[];
  onSelect: (attachment: LocalAttachment) => void;
  onNewVideo: (filePath: string) => void;
  onNewPicture: (filePath: string) => void;
}

const SavedAttachmentList = (props: SavedPicturesListProps) => {
  const { attachments, onNewPicture, onNewVideo, onSelect } = props;
  const [isMenuOpen, toggleMenu] = useToggle(false);
  return (
    <>
      <ChatInputActionSheet
        isOpen={isMenuOpen}
        onImage={onNewPicture}
        onVideo={onNewVideo}
        onClose={toggleMenu}
      />
      <View style={styles.container}>
        <ScrollBar containerProps={{ style: styles.scrollbar }}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={[styles.addNewImageButton, styles.addImageButton]}
              onPress={() => toggleMenu(true)}>
              <PersonIcon width={PERSON_ICON_SIZE} height={PERSON_ICON_SIZE} />
              <AddIcon style={styles.addButton} height={25} width={25} />
            </TouchableOpacity>
          </View>
          {attachments.map((attachment) => (
            <View style={styles.imageContainer} key={attachment.filePath}>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={() => onSelect(attachment)}>
                <Image
                  height={IMAGE_SIZE}
                  width={IMAGE_SIZE}
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
                <AddIcon style={styles.addButton} height={25} width={25} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollBar>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    bottom: 6,
    position: 'absolute',
  },
  addImageButton: {
    alignItems: 'center',
    borderRadius: appStyles.borderRadius,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  addNewImageButton: {
    backgroundColor: appColors.lightGrey,
    borderColor: appColors.mediumGrey,
    borderStyle: 'solid',
  },
  container: {
    height: 120,
    paddingHorizontal: 12,
  },
  image: {
    borderRadius: appStyles.borderRadius,
    flex: 1,
    height: IMAGE_SIZE,
    padding: 5,
    resizeMode: 'cover',
    width: IMAGE_SIZE,
  },
  imageContainer: {
    alignItems: 'center',
    height: IMAGE_SIZE,
    justifyContent: 'center',
    margin: 5,
    width: IMAGE_SIZE,
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

export default SavedAttachmentList;
