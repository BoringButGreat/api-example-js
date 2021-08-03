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

async function createIntakeFormResponse(
  { access_token },
  organizationId,
  formId,
  fields
) {
  const url = `${INTAKE_FORMS_API}/${organizationId}/intake-forms/${formId}`;
  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({ fields }),
    headers: {
      authorization: `bearer ${access_token}`,
      "content-type": "application/json",
    },
  });

  return await response.json();
}

// Id(s) of the field(s) to respond to the intake form with.
// Please see and run get-intake-forms.js to retrieve these field ids
// from the http response's body.
const FIELD_ID_1 = "a79a3e19-4a3f-4cff-8ec8-bd2602b93841";
const FIELD_ID_2 = "9b985c51-7f57-438a-971a-85d92a1f5d21";

async function main() {
  const token = await getToken();
  const organizationId = process.argv[2];
  const formId = process.argv[3];
  if (!formId || !organizationId) {
    console.log("Please pass organizationId and formId.");
    console.log("> yarn run get-intake-form <organizationId> <formId>");
  } else {
    try {
      const fields = [
        {
          id: FIELD_ID_1,
          value: "my answer",
        },
        {
          id: FIELD_ID_2,
          value: [0, 1],
        },
      ];

      const result = await createIntakeFormResponse(
        token,
        organizationId,
        formId,
        fields
      );
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
}

main();
