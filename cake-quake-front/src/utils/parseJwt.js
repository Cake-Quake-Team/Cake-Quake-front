export const parseJwt = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1]; // payload 부분
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Base64URL → Base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload); // { userId, uname, role }
  } catch (e) {
    console.error('Invalid JWT token', e);
    return null;
  }
};