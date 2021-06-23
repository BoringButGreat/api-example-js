import fetch from "node-fetch";

/*
 * While a token is not expired, you may call the token info
 * endpoint to get some data about the token, such as it's ID
 * as well as an updated expiration estimate.
 */

const TOKENINFO_ENDPOINT = "https://api.vendorful.com/auth/v1/tokeninfo";

async function getTokenInfo(access_token) {
  const response = await fetch(TOKENINFO_ENDPOINT, {
    method: "GET",
    headers: { authorization: `bearer ${access_token}` },
  });
  if (response.status > 299 || response.status < 200) {
    throw "Invalid Token";
  }
  return await response.json();
}

async function main() {
  if (!process.argv[2]) {
    console.log("Please pass an access_token.");
    console.log("> yarn run get-token-info <token.access_token>");
  } else {
    try {
      const info = await getTokenInfo(process.argv[2]);
      console.log(JSON.stringify(info, null, 2));
    } catch (e) {
      console.log(e);
    }
  }
}

main();
