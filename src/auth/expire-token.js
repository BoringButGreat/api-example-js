import fetch from "node-fetch";

/*
 * Tokens can be expired early by calling DELETE on the token
 * endpoint using the authorization header like you would any
 * other authenticated call.
 */

const TOKEN_ENDPOINT = "https://api.vendorful.com/auth/v1/token";

async function expireToken(access_token) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "DELETE",
    headers: { authorization: `bearer ${access_token}` },
  });
  if (response.status > 299 || response.status < 200) {
    throw "Invalid Token";
  }
}

async function main() {
  if (!process.argv[2]) {
    console.log("Please pass an access_token.");
    console.log("> yarn run expire-token <token.access_token>");
  } else {
    try {
      await expireToken(process.argv[2]);
      console.log("Token successfully expired.");
    } catch (e) {
      console.log(e);
    }
  }
}

main();
