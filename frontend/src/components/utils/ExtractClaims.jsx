export const extractClaims = token => {
  const base64Payload = token.split('.')[1];
  const jsonPayload = atob(base64Payload);
  const payload = JSON.parse(jsonPayload);
  return { id: payload.id, display_name: payload.display_name, role: payload.role };
}
