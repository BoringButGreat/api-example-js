import fetch from "node-fetch";

/*
 * Creating a token with grant_type client_credentials can be
 * done by POSTing JSON with client_id, client_secret, and grant_type
 * of client_credentials to the token endpoint.
 *
 * Optionally, you can pass the email address of a user of your
 * organization, and the token will be created with the subject of
 * the token being that user. Permissions of the user will be applied
 * to all API calls, and any audit trails will reference the user
 * as well as the application.
 *
 * You can get client credentials created for your organization by
 * contacting vendorful support.
 */

const TOKEN_ENDPOINT = "https://api.vendorful.com/auth/v1/token";

async function createToken(id, secret, username) {
  const params = {
    grant_type: "client_credentials",
    client_id: id,
    client_secret: secret,
  };
  if (username) params.username = username;
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(params),
  });
  return await response.json();
}

async function main() {
  const id = process.argv[2];
  const secret = process.argv[3];
  const email = process.argv[4];
  if (!secret) {
    console.log("Please pass client_id and client_secret.");
    console.log("> yarn run create-token-with-client-credentials <client_id> <client_secret> <optional_user_email>");
  } else {
    try {
      const token = await createToken(id, secret, email);
      console.log(JSON.stringify(token, null, 2));
    } catch (e) {
      console.log(e);
    }
  }
}

main();
