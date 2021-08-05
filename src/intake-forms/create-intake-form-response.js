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

// Example of fields from /GET response with "value" added
// Please see and run get-intake-forms.js to retrieve these field ids
// from the http response's body.
const fields = [
  {
    body: null,
    id: "874d5c18-c806-4688-babc-28b50b457bda",
    multi: null,
    name: "Short Text Test",
    options: [],
    required: false,
    type: "string",
    value: "test",
  },
  {
    body: null,
    id: "649e1fc1-1950-415d-b97e-a89f3e865969",
    multi: null,
    name: "Expanded Text Test",
    options: [],
    required: false,
    type: "textarea",
    value: "test",
  },
  {
    body: null,
    id: "d5d79f93-9c6f-4960-b5d0-e9bc5fa6a176",
    multi: null,
    name: "Checkbox UI Test",
    options: [],
    required: false,
    type: "checkbox",
    value: true,
  },
  {
    body: null,
    id: "d72fb676-6488-4404-9d89-1cd863031ec5",
    multi: null,
    name: "Single Select Test: Sandwich Choice",
    options: ["Ham", "Roast Beef", "Pimento Cheese"],
    required: false,
    type: "select",
    value: "Roast Beef",
  },
  {
    body: null,
    id: "7d0a3375-3642-44be-9b9b-a9f6b6da26b3",
    multi: true,
    name: "Multi-Select Test: Cookie Options",
    options: ["Snickerdoodle", "Chocolate Chip", "Peanut Butter"],
    required: false,
    type: "select",
    value: ["Snickerdoodle", "Chocolate Chip"],
  },
  {
    body: null,
    id: "4b7ebdff-afb3-484a-96e7-c7adb5ddab8a",
    multi: null,
    name: "Number Test",
    options: [],
    required: false,
    type: "number",
    value: 5,
  },
  {
    body: null,
    id: "7b9be557-5299-447c-8b5f-07214c3ea183",
    multi: null,
    name: "Range Test",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    required: false,
    type: "range",
    value: "4",
  },
  {
    body: null,
    id: "f8b048f2-ab5d-4391-84b5-2c7b0a077552",
    multi: null,
    name: "Date Time Test",
    options: [],
    required: false,
    type: "datetime",
    value: new Date(),
  },
];

async function main() {
  const token = await getToken();
  const organizationId = process.argv[2];
  const formId = process.argv[3];
  if (!formId || !organizationId) {
    console.log("Please pass organizationId and formId.");
    console.log("> yarn run get-intake-form <organizationId> <formId>");
  } else {
    try {
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
