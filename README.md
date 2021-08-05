# Vendorful API Examples

This repository contains code samples for [Vendorful's API](https://api.vendorful.com) written in Javascript.
This repository requires a recent version of [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/).

To make example code easier to read, it relies on the [node-fetch](https://www.npmjs.com/package/node-fetch) package that implements the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This can be installed in the local `node_modules` directory simply by typing `yarn install` in the root directory of this repository. All example commands below also must be executed in the root directory of this repository.

## Auth

Vendorful uses a subset of the ubiquitous [OAuth2](https://oauth.net/2/) standard that most modern large public APIs use, including Google, Microsoft, Facebook, Twitter, and many more.
Vendorful supports the `password` and `client_credentials` grant types.
Additionally, Vendorful allows applications to impersonate users of their own organizations by optionally passing an email address as `username` to the `client_credentials` grant type.
Tokens created this way will have the permissions of the user and any updates done with this token will be tracked as being done as the user via the application.
Client credentials are created upon request to Vendorful Support.

### Create token with password [source](./src/auth/create-token-with-password.js)

See it in action: `yarn run create-token-with-password` and follow the prompts.
This command will prompt you for valid email address and password credentials for a Vendorful user and print the JSON response from the server to the console.

### Create token with client credentials [source](./src/auth/create-token-with-client-credentials.js)

See it in action: `yarn run create-token-with-client-credentials <client_id> <client_secret> <optional_user_email>`.
This command will call the Vendorful Auth API's token endpoint with `grant_type=client_credentials` to generate a token for the application (or optionally a user in the same organization as the application).

### Get Token Info [source](./src/auth/get-token-info.js)

See it in action: `yarn run get-token-info <access_token>`.
You can find `access_token` in the token created with any of the create token commands above. This is mostly useful for checking the remaining time for which the token will be valid.

### Get Subject Info [source](./src/auth/get-token-subject.js)

See it in action: `yarn run get-token-subject <access_token>`.
You can find `access_token` in the token created with any of the create token commands above. This will return for whom the token was created. This could be either an application or user, but will contain the `id`, `name`, and `organization_id` of the subject.

### Expire Token [source](./src/auth/expire-token.js)

See it in action: `yarn run expire-token <access_token>`.
You can find `access_token` in the token created with any of the create token commands above. You generally do not need to call this endpoint, as tokens will naturally expire every few hours, but if for some reason, you wish to expire the token early, you can call this endpoint.

## Vendors

### Syncing Vendors [source](./src/vendors/sync.js)

See it in action: `yarn run sync-vendors`.

This command assumes you have a `secrets.json` file with appropriate credentials. See [secrets-sample.json](./secrets-sample.json) for the format.

This will start with the oldest legal entity and fetch up to 10 at a time writing the JSON for each entity into a file in the vendors directory. It also maintains state in a json file so that it only fetches updates upon subsequent executions. The method for doing this is documented in the [source file](./src/vendors/sync.js).

### Updating attributes [source](./src/vendors/set-attribute-value.js)

See it in action: `yarn run set-attribute-value <organization_id> <entity_id> <attribute_id> <value>`.

This command assumes you have a `secrets.json` file with appropriate credentials. See [secrets-sample.json](./secrets-sample.json) for the format.

Custom attribute values are recorded at the legal entity level.
Audit history will track the token used to make the change, and will display in the Vendorful application as having been made by the user and/or application associated with the token.

- `organization_id` vendorful id of your organization
- `entity_id` the vendorful id of the legal entity you wish to update
- `attribute_id` the vendorful id of the attribute you wish to update
- `value` the new value

## Intake forms

### /GET

See it in action: `yarn run get-intake-form organization_id form_id`

This command assumes you have a `secrets.json` file with appropriate credentials. See [secrets-sample.json](./secrets-sample.json) for the format.

The `organization_id` is the ID of the organization that created the intake form.
The `form_id` is the ID of the intake form.

The response returned can be populated with values and used for the /POST with no additional changes required.

### /POST

See it in action: `yarn run create-intake-form-response organization_id form_id`

yarn run create-intake-form-response 96e1349e-3817-41b5-9762-324e2a9f19af 52270eb5-772e-4866-8f34-26b3eeda8dbc

This command assumes you have a `secrets.json` file with appropriate credentials. See [secrets-sample.json](./secrets-sample.json) for the format.

The `organization_id` is the ID of the organization that created the intake form.
The `form_id` is the ID of the intake form.

The field values can be hardcoded in `/src/intake-forms/create-intake-forms`. See that file for an example.
