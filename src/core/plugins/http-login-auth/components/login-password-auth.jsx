import React from "react"
import PropTypes from "prop-types"
import { parseJwt } from "../helpers.jsx"

export default class LoginPasswordAuth extends React.Component {
  static propTypes = {
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    errSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    let { name, schema } = this.props
    let value = this.getValue()

    this.state = {
      name: name,
      schema: schema,
      value: value
    }
  }

  getValue () {
    let { name, authorized } = this.props

    return authorized && authorized.getIn([name, "value"])
  }

  onChange =(e) => {
    let { onChange } = this.props
    let { value, name } = e.target

    let newValue = Object.assign({}, this.state.value)

    if(name) {
      newValue[name] = value
    } else {
      newValue = value
    }

    this.setState({ value: newValue }, () => onChange(this.state))

  }

  render() {
    let {schema, getComponent, errSelectors, name} = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const AuthError = getComponent("authError")
    const Markdown = getComponent("Markdown", true)
    const JumpToPath = getComponent("JumpToPath", true)

    const scheme = (schema.get("scheme") || "")
    let value = this.getValue()
    let errors = errSelectors.allErrors().filter(err => err.get("authId") === name)
    if (scheme === "loginPassword") {
      let username = value ? value.get("username") : null
      let token = value ? value.get("token") : null
      let authData = token ? parseJwt(token) : null
      return <div>
        <h4>
          <code>{name || schema.get("name")}</code>&nbsp;
          (http, Username/Password)
          <JumpToPath path={["securityDefinitions", name]}/>
        </h4>
        {authData && <h4>Authorized</h4>}
        {authData && <Markdown source={ '<br>\n**Username:** ' + authData.sub + '\n<br>\n<br>\n**Authority:** ' + authData.scopes[0] + '\n<br>\n<br>' }/>}
        {!authData && <Row>
          <Markdown source={schema.get("description")}/>
        </Row>}
        {!authData && <Row>
          <label>Username:</label>
          {
            username ? <code> {username} </code>
              : <Col><Input type="text" required="required" name="username" onChange={this.onChange}
                            autoFocus/></Col>
          }
        </Row>}
        {!authData && <Row>
          <label>Password:</label>
          {
            username ? <code> ****** </code>
              : <Col><Input autoComplete="new-password"
                            name="password"
                            type="password"
                            onChange={this.onChange}/></Col>
          }
        </Row>}
        {!authData &&
          errors.valueSeq().map((error, key) => {
            return <AuthError error={error}
                              key={key}/>
          })
        }
      </div>
    }
    return <div>
      <em><b>{name}</b> HTTP authentication: unsupported scheme {`'${scheme}'`}</em>
    </div>
  }
}
