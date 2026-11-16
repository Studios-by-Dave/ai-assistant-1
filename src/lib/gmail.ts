import { google } from "googleapis";

export function getGmailClient(accessToken: string) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });
  return google.gmail({ version: "v1", auth: oauth2 });
}

export async function fetchRecentEmails(accessToken: string, maxResults = 20) {
  const gmail = getGmailClient(accessToken);
  const res = await gmail.users.messages.list({ userId: "me", maxResults });
  const messages = res.data.messages ?? [];
  const details = await Promise.all(
    messages.map(async (m) => {
      const msg = await gmail.users.messages.get({ userId: "me", id: m.id!, format: "full" });
      return msg.data;
    })
  );
  return details;
}

export async function sendEmail(accessToken: string, to: string, subject: string, body: string) {
  const gmail = getGmailClient(accessToken);
  const raw = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${body}`
  ).toString("base64url");
  await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
}
