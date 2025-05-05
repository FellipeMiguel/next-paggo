export const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ??
  (() => {
    throw new Error("GOOGLE_CLIENT_ID não definido");
  })();
export const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET ??
  (() => {
    throw new Error("GOOGLE_CLIENT_SECRET não definido");
  })();
export const NEXTAUTH_URL =
  process.env.NEXTAUTH_URL ??
  (() => {
    throw new Error("NEXTAUTH_URL não definido");
  })();
export const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ??
  (() => {
    throw new Error("NEXTAUTH_SECRET não definido");
  })();
