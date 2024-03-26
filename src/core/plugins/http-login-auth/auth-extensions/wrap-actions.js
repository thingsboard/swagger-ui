import { fromJS } from "immutable"

export const authorizeWithPersistOption = (oriAction, { authActions }) => {
  return (payload) => {
    let securities = fromJS(payload)
    let name = null;
    let schema = null;
    let value = null;
    securities.entrySeq().forEach( ([ key, security ]) => {
      let type = security.getIn(["schema", "type"])
      if ( type === "http" ) {
        let scheme = security.getIn(["schema", "scheme"])
        if (scheme === "loginPassword") {
          name = key;
          schema = security.getIn(["schema"]);
          value = security.getIn(["value"]);
        }
      }
    })
    if (schema !== null && value !== null) {
      let bearerFormat = schema.getIn(["bearerFormat"]);
      let bearerFormatVals = bearerFormat.split('|');
      let loginEndpoint = bearerFormatVals[0];
      let authHeader = bearerFormatVals[1];
      let username = value.getIn(["username"]);
      let password = value.getIn(["password"]);
      return authActions.authorizeHttpLoginPassword({
        name,
        loginEndpoint,
        authHeader,
        username,
        password
      });
    } else {
      return oriAction(payload)
    }
  }
}
