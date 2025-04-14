export const host = import.meta.env.VITE_API_URL;
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setAvatar`;
export const allUserRoute  = `${host}/api/auth/allUsers`;
export const sendMessageRoute = `${host}/api/messages/addMessage`;
export const fetchMessageRoute = `${host}/api/messages/getAllMessages`