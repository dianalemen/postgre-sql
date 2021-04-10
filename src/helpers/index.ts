import { UserInterface } from './../models/user';

export const generateUserId = (): string => {
  return Math.floor(Math.random() * 999).toString();
};

export const getActiveUserLogins = (users: Array<UserInterface>): string => {
  return users
    .filter(user => !user.isdeleted)
    .map(user => user.login).join(', ');
};

