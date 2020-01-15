export const USER_UPDATE = 'USER_UPDATE';

export function userUpdate(data) {
  return { type: USER_UPDATE, data: data };
}
