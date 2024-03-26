export const AUTHORIZE_HTTP_JWT_TOKEN = "authorize_http_jwt_token"

export const authorizeHttpJwtToken = (payload) => {
  return {
    type: AUTHORIZE_HTTP_JWT_TOKEN,
    payload: payload
  }
}

export const authorizeHttpJwtTokenWithPersistOption = (payload) => ( { authActions } ) => {
  authActions.authorizeHttpJwtToken(payload)
  authActions.persistAuthorizationIfNeeded()
}

export const authorizeHttpLoginPassword = ( auth ) => ( { fn, getConfigs, authActions, errActions } ) => {
  let { name, loginEndpoint, username, password, authHeader } = auth;
  errActions.clear({
    authId: name,
    source: "auth"
  });
  let body = {
    username,
    password
  }
  fn.fetch({
    url: loginEndpoint,
    method: "post",
    headers: { "Accept": "application/json", "Content-Type": "application/json"},
    body: JSON.stringify(body),
    requestInterceptor: getConfigs().requestInterceptor,
    responseInterceptor: getConfigs().responseInterceptor
  })
  .then(function (response) {
    if ( !response.ok ) {
      errActions.newAuthErr( {
        authId: name,
        level: "error",
        source: "auth",
        message: response.statusText
      } )
      return
    }
    let loginResponse = JSON.parse(response.data);
    let token = loginResponse.token;
    authActions.authorizeHttpJwtTokenWithPersistOption({
      name,
      authHeader,
      username,
      token
    });
  })
  .catch(e => {
    let err = new Error(e)
    let message = err.message
    if (e.response && e.response.data) {
      const errData = e.response.data
      try {
        const jsonResponse = typeof errData === "string" ? JSON.parse(errData) : errData
        if (jsonResponse.error)
          message += `, error: ${jsonResponse.error}`
        if (jsonResponse.error_description)
          message += `, description: ${jsonResponse.error_description}`
        if (jsonResponse.message)
          message += `, error: ${jsonResponse.message}`
      } catch (jsonError) {
        // Ignore
      }
    }
    errActions.newAuthErr( {
      authId: name,
      level: "error",
      source: "auth",
      message: message
    } )
  })
}
