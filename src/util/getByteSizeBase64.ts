const BASE64_INITIALIZER = ';base64,';

export function getByteSizeBase64(base64: string): number {
  const index = base64.indexOf(BASE64_INITIALIZER);
  const stringLength = base64.length - index - BASE64_INITIALIZER.length;
  if (!index || stringLength < 1) {
    return 0;
  }
  return 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
}
