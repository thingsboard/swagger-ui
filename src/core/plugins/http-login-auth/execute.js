import _objectSpread from "@babel/runtime-corejs3/helpers/objectSpread2";
import _objectWithoutProperties from "@babel/runtime-corejs3/helpers/objectWithoutProperties";
import stockHttp from "swagger-client/es/http";
import { idFromPathMethodLegacy, getOperationRaw } from "swagger-client/es/helpers";
import isPlainObject from 'lodash/isPlainObject';
import get from "lodash/get";

var _excluded = ["http", "fetch", "spec", "operationId", "pathName", "method", "parameters", "securities"];

export default function execute(_ref, fn) {
  var userHttp = _ref.http,
    fetch = _ref.fetch,
    spec = _ref.spec,
    operationId = _ref.operationId,
    pathName = _ref.pathName,
    method = _ref.method,
    parameters = _ref.parameters,
    securities = _ref.securities,
    extras = _objectWithoutProperties(_ref, _excluded);

  var http = userHttp || fetch || stockHttp;

  if (pathName && method && !operationId) {
    operationId = idFromPathMethodLegacy(pathName, method);
  }

  var request = fn.buildRequest(_objectSpread({
    spec: spec,
    operationId: operationId,
    parameters: parameters,
    securities: securities,
    http: http
  }, extras));

  if (operationId) {
    var operationRaw = getOperationRaw(spec, operationId);
    const { operation = {} } = operationRaw;
    request = applySecurities({
      request,
      securities,
      operation,
      spec
    });
  }

  if (request.body && (isPlainObject(request.body) || Array.isArray(request.body))) {
    request.body = JSON.stringify(request.body);
  }
  if (request.url) {
    request.url = request.url.replace(/{\?.*%7D=&/, '?');
    request.url = request.url.replace(/{\?.*%7D=/, '');
  }
  return http(request);
}

function applySecurities({request,
                           securities = {},
                           operation = {},
                           spec}) {
  const result = _objectSpread({}, request);
  const { authorized = {} } = securities;
  const security = operation.security || spec.security || [];
  const isAuthorized = authorized && !!Object.keys(authorized).length;
  var securityDef = get(spec, ['components', 'securitySchemes']) || {};
  result.headers = result.headers || {};
  result.query = result.query || {};
  if (!Object.keys(securities).length || !isAuthorized || !security || Array.isArray(operation.security) && !operation.security.length) {
    return request;
  }
  security.forEach(function (securityObj) {
    Object.keys(securityObj).forEach(function (key) {
      var auth = authorized[key];
      var schema = securityDef[key];
      if (!auth) {
        return;
      }
      var value = auth.value || auth;
      var type = schema.type;
      if (auth) {
        if (type === 'http') {
          if (schema.scheme === 'loginPassword') {
            var authHeader = value.authHeader || 'Authorization';
            var token = value.token || '';
            result.headers[authHeader] = "Bearer ".concat(token);
          }
        }
      }
    });
  });
  return result;
}
