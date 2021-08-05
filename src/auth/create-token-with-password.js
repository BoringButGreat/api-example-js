import fetch from "node-fetch";
import readline from "readline";
import { TOKEN_ENDPOINT } from "./../api_urls.js";

/*
 * Creating a token with grant_type password is as easy as
 * POSTing JSON with username, password, and grant_type
 * to the token endpoint.
 */

async function createPasswordToken(username, password) {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "password",
      username: username,
      password: password,
    }),
  });
  return await response.json();
}

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Email Address > ", (email) => {
    rl.question("Password > ", async (password) => {
      const token = await createPasswordToken(email, password);
      console.log(JSON.stringify(token, null, 2));
      rl.close();
    });
  });
}

main();
