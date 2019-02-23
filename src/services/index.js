import {urlEncode} from 'utils/url';
import {history} from 'root';
import {USER_STATUS_NO_LOGIN, API_STATUS_KEY} from 'contants';

const _ = require ('underscore');

const xhr = ({url, body = null, method = 'get'}) => {
  function transformError (response) {
    let message = '系统异常，请联系管理员';
    if (!_.isEmpty (response.data)) {
      if (_.isObject (response.data)) {
        message = _.values (response.data)[0];
      } else if (_.isString (response.data)) {
        message = response.data;
      }
    }
    return message;
  }

  function parseRequest (response) {
    response.transformError = ''; //
    if (response.code == 0 || (response.code >= 200 && response.code < 300)) {
      return response;
    } else if (response.code == 404) {
      // 这里抛出错误方便服务器端也能处理
      throw response;
    } else if (response.code == 500) {
      throw response;
    } else {
      response.transformError = transformError (response);
    }
  }

  function checkStatus (response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error (response.statusText);
      error.response = response;
      throw error;
    }
  }

  function parseJSON (response) {
    return response.json ();
  }

  /**
   * handle no login case.
   * pop up login dialog when any interface return no login status
   * except url with 'state' param, it's three part login process
   * @param {*} response
   */
  function handleNoLogin (response) {
    // judge app is logining status just now
    if (response[API_STATUS_KEY] === USER_STATUS_NO_LOGIN) {
      root.store.dispatch ({type: 'user/setUser', payload: {}});
      localStorage.removeItem ('user');
      history.replace ('/user/login');
    }
    return response;
  }

  function log (response) {
    return response;
  }

  let param = {
    method: method,
    headers: {'Content-Type': 'application/json', Accept: '*/*'},
  };

  if (body) {
    method === ('post' || 'POST' || 'put' || 'PUT')
      ? (param.body = JSON.stringify (body))
      : (url = `${url}?${urlEncode (body)}`);
  }

  param.credentials = 'include';
  return fetch (url, param)
    .then (checkStatus)
    .then (parseJSON)
    .then (parseRequest)
    .then (handleNoLogin)
    .then (log)
    .catch (response => {
      if (response.code === 404) {
        history.push ('/404');
      } else if (response.code === 500) {
        history.push ('/500');
      }
      throw response;
    });
};

export default xhr;
