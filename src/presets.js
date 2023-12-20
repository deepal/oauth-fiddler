export const PRESETS = [
    {
      name: "Google",
      authoriseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      prompt: "consent select_account",
      pkceEnabled: true,
      pkceType: "S256",
      responseMode: "query",
      responseType: "code",
      scope: "openid",
    },
    {
      name: "Facebook",
      authoriseUrl: "https://www.facebook.com/v14.0/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/v14.0/oauth/access_token",
      prompt: "",
    }
  ];