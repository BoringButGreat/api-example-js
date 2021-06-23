import fetch from "node-fetch";
import querystring from "querystring";
import { readFile, writeFile } from "fs/promises";

// Configuration would generally be stored in ENV or config files, but
// is inlined here for clarity.

// Update with target environment and api version
const TOKEN_ENDPOINT = "https://api.vendorful.com/auth/v1/token";
const VENDORS_API = "https://api.vendorful.com/vendors/v1";

// Update with your organization's Vendorful ID
const ORGANIZATION_ID = "acf6ce31-5abb-490e-b76f-15f299ca2853";

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

// Pass in token and updated_since to get the next batch of entities to process
async function getEntities({ access_token }, updated_since) {
  // Sorting by updated_at so we process entities in the order in which they were updated.
  const params = { sort: "updated_at" };

  // Only pass updated_since if we have one.
  // First request will not pass this field, thus ensuring we start at the oldest entity.
  if (updated_since) params.updated_since = updated_since;

  // Build url with query params
  const url = `${VENDORS_API}/${ORGANIZATION_ID}/legal-entities?${querystring.encode(params)}`;

  // Pass the access_token from the token in the authorization header
  const response = await fetch(url, {
    method: "get",
    headers: { authorization: `bearer ${access_token}` },
  });

  // Await the json response data, then return it
  return await response.json();
}

async function getState() {
  // Try to read sync state from state.json
  try {
    return JSON.parse(await readFile("vendors/state.json"));
  } catch (_e) {
    // Default state is to have updated_since as null
    // This will trigger the sync to start from the beginning if state is missing.
    return { updated_since: null };
  }
}

function setState(state) {
  // Persist state across sync jobs
  return writeFile("vendors/state.json", JSON.stringify(state));
}

// Sync a batch of updated entities
async function sync(token, state) {
  // First get a batch of entities updated since last seen entity
  const entities = await getEntities(token, state.updated_since);

  // Only continue if there were some updates to process
  if (entities.length === 0) {
    console.log("No outstanding updates.");
    return;
  }

  // Loop through the entities, processing them as you see fit
  for (let entity of entities) {
    // Log some progress to the console
    console.log(`${entity.id}: ${entity.name}`);

    // In our case, we are just writing the json to a file in the vendors dir
    await writeFile(`vendors/${entity.id}.json`, JSON.stringify(entity));

    // When you process an entity, since they are ordered by updated_at,
    // you should update the state.json so that the entity is not processed again.
    state.updated_since = entity.updated_at;
    setState(state);
  }

  // Since some entities were processed, we execute sync again immediately
  // in case there was more than one batch of updates to process
  sync(token, state);
}

async function main() {
  // Load initial state
  const state = await getState();

  // Fetch token for this execution
  const token = await getToken();

  // Sync all outstanding entities
  sync(token, state);
}

main();
