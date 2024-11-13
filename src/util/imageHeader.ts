export const imageHeader = (token: string, extraConfig?: any) => ({
  Authorization: 'Bearer ' + token,
  ...extraConfig,
});
