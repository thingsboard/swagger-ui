import React from "react"

export const isOAS3 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")
  if(typeof oasVersion !== "string") {
    return false
  }
  return oasVersion.startsWith("3.") && oasVersion.length > 4
}

export const ComponentWrapFactory = (Component) => {
  return (Ori, system) => (props) => {
    if(system && system.specSelectors && system.specSelectors.specJson) {
      const spec = system.specSelectors.specJson()
      return <Component {...props} {...system} Ori={Ori}></Component>
    } else {
      console.warn("ComponentWrapFactory wrapper: couldn't get spec")
      return null
    }
  }
}

export const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
