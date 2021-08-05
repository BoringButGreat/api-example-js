import fetch from "node-fetch";
import { readFile } from "fs/promises";
import { TOKEN_ENDPOINT, INTAKE_FORMS_API } from "./../api_urls.js";

// Gets the token by posting secrets.json to the token endpoint.
// See secrets-sample.json for an example.
async function getToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "post",
    body: await readFile("secrets.json"),
    headers: { "content-type": "application/json" },
  });
  return await response.json();
}

async function getIntakeForm({ access_token }, organizationId, formId) {
  const url = `${INTAKE_FORMS_API}/${organizationId}/intake-forms/${formId}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      authorization: `bearer ${access_token}`,
      "content-type": "application/json",
    },
  });

  return await response.json();
}

async function main() {
  const token = await getToken();
  const organizationId = process.argv[2];
  const formId = process.argv[3];
  if (!formId || !organizationId) {
    console.log("Please pass organizationId and formId.");
    console.log("> yarn run get-intake-form <organizationId> <formId>");
  } else {
    try {
      const result = await getIntakeForm(token, organizationId, formId);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
}

main();
