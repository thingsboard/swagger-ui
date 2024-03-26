import React from "react"
import { ComponentWrapFactory } from "../helpers.jsx"

export default ComponentWrapFactory(({ Ori, ...props }) => {
  const {
    schema, getComponent, errSelectors, authorized, onAuthChange, name
  } = props

  const LoginPasswordAuth = getComponent("LoginPasswordAuth")
  const type = schema.get("type")
  const scheme = (schema.get("scheme") || "")

  if(type === "http" && scheme === "loginPassword") {
    return <LoginPasswordAuth key={ name }
                              schema={ schema }
                              name={ name }
                              errSelectors={ errSelectors }
                              authorized={ authorized }
                              getComponent={ getComponent }
                              onChange={ onAuthChange }/>
  } else {
    return <Ori {...props} />
  }
})
