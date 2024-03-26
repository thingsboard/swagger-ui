import { fromJS, Map } from "immutable"
import { parseJwt } from "../helpers.jsx";

export const updateJsonSpec = (oriAction, { getConfigs, authActions }) => {
  return (payload) => {
    const configs = getConfigs()
    if (configs.persistAuthorization) {
      let jwt_token = localStorage.getItem("jwt_token")
      if (jwt_token) {
        let jwt_token_expiration = localStorage.getItem("jwt_token_expiration")
        if (jwt_token_expiration && Number(jwt_token_expiration) > (new Date().valueOf() + 2000)) {
          let authData = null;
          try {
            authData = parseJwt(jwt_token);
          } catch (e) {}
          if (authData && !authData.isPublic) {
            const username = authData.sub;
            const token = jwt_token;
            const authorizedValue = localStorage.getItem("authorized")
            let authorized = authorizedValue ? fromJS(JSON.parse(authorizedValue)) : Map()
            const specJson = fromJS(payload);
            const definitions = specJson.getIn(["components", "securitySchemes"])
            definitions.entrySeq().forEach( ([ defName, definition ]) => {
              const type = definition.get("type")
              if (type === "http") {
                const scheme = (definition.getIn(["scheme"]) || "")
                if (scheme === "loginPassword") {
                  const existing = authorized.getIn([defName])
                  if (!existing) {
                    const bearerFormat = definition.getIn(["bearerFormat"]);
                    const bearerFormatVals = bearerFormat.split('|');
                    const authHeader = bearerFormatVals[1];
                    const name = defName;
                    authActions.authorizeHttpJwtToken({
                      name,
                      authHeader,
                      username,
                      token
                    });
                  }
                }
              }
            });
          }
        }
      }
    }
    return oriAction(payload)
  }
}
