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
  response_fields
) {
  const url = `${INTAKE_FORMS_API}/${organizationId}/intake-forms/${formId}`;
  const response = await fetch(url, {
    method: "post",
    body: JSON.stringify({ response_fields }),
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
const FIELD_ID_1 = "035cfe94-5a72-45fb-8714-4d87efcd4d19";
const FIELD_ID_2 = "343upods-5336-4563-sbyy-4664df6724df";

async function main() {
  const token = await getToken();
  const organizationId = process.argv[2];
  const formId = process.argv[3];
  if (!formId || !organizationId) {
    console.log("Please pass organizationId and formId.");
    console.log("> yarn run get-intake-form <organizationId> <formId>");
  } else {
    try {
      const responseFields = {
        fields: [
          {
            id: FIELD_ID_1,
            value: "value",
          },
          {
            id: FIELD_ID_2,
            value: ["value_1", "value_2"],
          },
        ],
      };
      const result = await createIntakeFormResponse(
        token,
        organizationId,
        formId,
        responseFields
      );
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
}

main();
