export const generateUserId = (): string => {
  return Math.floor(Math.random() * 999).toString();
};
