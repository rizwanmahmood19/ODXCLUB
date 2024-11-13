import RNFetchBlob from 'rn-fetch-blob';

export async function removeFile(filePath: string) {
  const fileExist = await RNFetchBlob.fs.exists(filePath);
  if (fileExist) {
    try {
      await RNFetchBlob.fs.unlink(filePath);
    } catch (e) {
      console.error(e);
    }
  }
}
