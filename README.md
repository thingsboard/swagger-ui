# Swagger UI

Swagger UI renders interactive API documentation from an OpenAPI specification. This repository is a fork of [swagger-api/swagger-ui](https://github.com/swagger-api/swagger-ui) used by the ThingsBoard platform.

Packaged into the `springdoc-swagger-ui` webjar of the [ThingsBoard fork of springdoc-openapi](https://github.com/thingsboard/springdoc-openapi), which downloads the GitHub archive of a `TB`-suffixed tag of this repository.

## Differences from upstream

The fork differs from the upstream 5.21.0 release as follows:

- A new ThingsBoard-authored `HttpLoginAuth` plugin (`src/core/plugins/http-login-auth/`) adds a username and password login authorization scheme that obtains a JWT token and applies it to requests. It is registered in `src/core/index.js` and enabled in `dist/swagger-initializer.js`.
- `src/core/components/responses.jsx`, `src/core/components/live-response.jsx` and `src/style/_layout.scss` rework how the live response to a "Try it out" request is presented.
- `package.json` and `package-lock.json` set the version to the fork's `TB`-suffixed form.
- The `dist` bundles are rebuilt from this fork's sources.
- `dist/swagger-ui-bundle.js.map`, `dist/swagger-ui-es-bundle.js.map` and `dist/swagger-ui-standalone-preset.js.map` are deleted. The build does not generate source maps for these three bundles, and no bundle references them.

## Licensing

Swagger UI is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

The attribution notices of the original work are preserved in the [NOTICE](NOTICE) file.
