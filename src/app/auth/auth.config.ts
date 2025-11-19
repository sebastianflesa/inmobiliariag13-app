export const oidcConfig = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ekjhhlIOU',
  clientId: '53m5nqdko6io2kcc1upke47vc6',
  redirectUrl: 'http://localhost:4200/auth/callback',
  postLogoutRedirectUri: 'http://localhost:4200/auth/logout-callback',
  scope: 'email openid phone',
  responseType: 'code',
  useRefreshToken: true,
  renewTimeBeforeTokenExpiresInSeconds: 60
};
