export const USER_LOGIN = 'USER_LOGIN';

export function userLogIn(tokens) {
  return { type: USER_LOGIN, tokens: tokens };
}
