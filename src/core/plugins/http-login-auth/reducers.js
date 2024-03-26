import { Map } from "immutable"

import { AUTHORIZE_HTTP_JWT_TOKEN } from "./actions";

export default {
  [AUTHORIZE_HTTP_JWT_TOKEN]: (state, { payload } ) => {

    let { name, username, authHeader, token } = payload;
    let map = state.get("authorized") || Map()
    let value = Map()
    value = value.set("username", username);
    value = value.set("authHeader", authHeader);
    value = value.set("token", token);
    map = map.setIn([name, "value"], value);
    return state.set( "authorized", map )
  }
}
