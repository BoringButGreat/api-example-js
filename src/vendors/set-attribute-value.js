import fetch from "node-fetch";
import { readFile } from "fs/promises";

/*
 * Attributes can be updated by doing a PUT request to the legal-entities
 * attribute endpoint. All custom attributes are associated to a legal entity.
 * The value should be passed in the body as JSON.
 * Audit history will record the token that was used to make the change, and will
 * display in the Vendorful app as having been done by the user and/or application
 * that is represented by the token.
 */

const TOKEN_ENDPOINT = "https://api.vendorful.com/auth/v1/token";
const VENDORS_API = "https://api.vendorful.com/vendors/v1";

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

async function setAttributeValue({ access_token }, organization_id, entity_id, attribute_id, value) {
  const url = `${VENDORS_API}/${organization_id}/legal-entities/${entity_id}/attributes/${attribute_id}`;
  const response = await fetch(url, {
    method: "put",
    body: JSON.stringify({ value: value }),
    headers: { authorization: `bearer ${access_token}`, "content-type": "application/json" },
  });
  return await response.json();
}

async function main() {
  const token = await getToken();
  const organization_id = process.argv[2];
  const entity_id = process.argv[3];
  const attribute_id = process.argv[4];
  const value = process.argv[5];
  if (!value) {
    console.log("Please pass organization_id, entity_id, attribute_id, and value.");
    console.log("> yarn run set-attribute-value <organization_id> <entity_id> <attribute_id> <value>");
  } else {
    try {
      const result = await setAttributeValue(token, organization_id, entity_id, attribute_id, value);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(e);
    }
  }
}

main();
