import fetch from "node-fetch";

/*
 * While a token is not expired, you may call the subject
 * endpoint to get some data about whom the token represents.
 * This will have a type of application or user, and the name,
 * id, and organization_id of the user or application.
 */

const SUBJECT_ENDPOINT = "https://api.vendorful.com/auth/v1/subject";

async function getSubject(access_token) {
  const response = await fetch(SUBJECT_ENDPOINT, {
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
    console.log("> yarn run get-token-subject <token.access_token>");
  } else {
    try {
      const info = await getSubject(process.argv[2]);
      console.log(JSON.stringify(info, null, 2));
    } catch (e) {
      console.log(e);
    }
  }
}

main();
