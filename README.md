# Vendorful API Examples

This repository contains code samples for [Vendorful's API](https://api.vendorful.com) written in Javascript.
This repository requires a recent version of [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/).

To make example code easier to read, it relies on the [node-fetch](https://www.npmjs.com/package/node-fetch) package that implements the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This can be installed in the local `node_modules` directory simply by typing `yarn install` in the root directory of this repository. All example commands below also must be executed in the root directory of this repository.

## Auth

Vendorful uses a subset of the ubiquitous [OAuth2](https://oauth.net/2/) standard that most modern large public APIs use, including Google, Microsoft, Facebook, Twitter, and many more.
Vendorful support the `password` and `client_credentials` grant types.
Additionally, Vendorful allows applications to impersonate users of their own organizations by optionally passing an email address as `username` to the `client_credentials` grant type.
Tokens created this way will have the permissionns of the user and any updates done with this token will be tracked as being done as the user via the application.
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
