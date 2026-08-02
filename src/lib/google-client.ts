/** Web OAuth client ID used by Google One Tap (must be public). */
export function getGoogleClientId() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.AUTH_GOOGLE_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    ""
  );
}
