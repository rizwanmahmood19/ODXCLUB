import { is_android } from '../../../util/osCheck';
import RNFetchBlob from 'rn-fetch-blob';
import { LocalAttachment } from './saved.attachment.list.component';

export function extractDuration(
  mediaInformation: Record<string, string>,
): number | null {
  if (mediaInformation.duration) {
    return Number(mediaInformation.duration) * 1000;
  }
  if (mediaInformation.rawInformation) {
    // iOS - for some reason the duration is only available in the raw information
    const foundDuration = mediaInformation.raw.match('Duration: (.*),');
    if (foundDuration) {
      const hms = foundDuration[1].substring(0, 8).split(':');
      return (+hms[0] * 60 * 60 + +hms[1] * 60 + +hms[2]) * 1000;
    }
  }
  return null;
}

export function removeFilePrefixIfNecessary(x: string): string {
  if (is_android) {
    return x;
  }
  return x.startsWith('file://') ? x.substr(7) : x;
}

export function getVideoUri(filePath: string): string {
  const filePrefix = 'file:///';
  if (is_android) {
    return `${filePrefix}${filePath}`;
  }
  return filePath.startsWith(filePrefix)
    ? filePath
    : `${filePrefix}${filePath}`;
}

// lists directory contents and removes everything that is not included in localAttachments
export async function purgeRecentAttachmentFiles(
  recentAttachmentsDir: string,
  recentThumbnailsDir: string,
  localAttachments: LocalAttachment[],
) {
  (await RNFetchBlob.fs.ls(recentAttachmentsDir)).forEach((filename) => {
    const isStillUsed = !!localAttachments.find(
      (x) => x.filePath.indexOf(filename) !== -1,
    );
    if (!isStillUsed) {
      RNFetchBlob.fs.unlink(`${recentAttachmentsDir}/${filename}`);
    }
  });
  (await RNFetchBlob.fs.ls(recentThumbnailsDir)).forEach((filename) => {
    const isStillUsed = !!localAttachments.find(
      (x) => x.thumbnailPath && x.thumbnailPath.indexOf(filename) !== -1,
    );
    if (!isStillUsed) {
      RNFetchBlob.fs.unlink(`${recentThumbnailsDir}/${filename}`);
    }
  });
}
