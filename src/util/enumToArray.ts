export const enumToArray = (E: any) => {
  const keys = Object.keys(E).filter((k) => typeof E[k as any] === 'number');
  return !keys.length ? Object.keys(E) : keys;
};
