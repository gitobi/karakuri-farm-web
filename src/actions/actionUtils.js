export function checkValid(changed) {
  let valid = true;
  Object.keys(changed).forEach((key) => {
    let change = changed[key];
    let errors = change._errors;
    if (errors) {
      Object.keys(errors).forEach((column) => {
        let error = errors[column];
        valid &= (null === error || undefined === error);
      });
    }
  });
  return valid;
}

/**
 * Api Request Wrapper
 * @param  {[type]} dispatch          [description]
 * @param  {[type]} actionTypeRequest [description]
 * @param  {[type]} actionTypeSuccess [description]
 * @param  {[type]} actionTypeFailure [description]
 * @param  {[type]} bastet            [description]
 * @param  {[type]} bastetApi         [description]
 * @param  {[type]} apiParams         [description]
 * @param  {[type]} resourceId        [description]
 * @return {[type]}                   [description]
 */
export function ApiRequest(
  dispatch,
  actionTypeRequest,
  actionTypeSuccess,
  actionTypeFailure,
  bastet,
  bastetApi,
  apiParams,
  resourceId,
  ) {
  dispatch({ type: actionTypeRequest });
  return bastetApi.call(bastet, ...apiParams).then(
    result => {
      let res = {
        type: actionTypeSuccess,
        apiParams: apiParams,
        resourceId: resourceId,
        result: result,
      }
      dispatch(res);
      return Promise.resolve(res);
    },
    error => {
      let res = {
        type: actionTypeFailure,
        apiParams: apiParams,
        resourceId: resourceId,
        error: error,
      }
      dispatch(res);
      return Promise.reject(res);
    }
  );
}

export function addFilteredQuery(
  object,
  id,
  operator,
  value
  ) {
    if (!object.filtered) {
      object.filtered = []
    }
    object.filtered.push({
      "id": id,
      "value": {
        [operator]: value
      }
    });
    return object;
}

export function parseCognitoErrorMessage(message) {
  if (message === null) {
    message = "unknown error";
  }
  // console.log(message);
  // エラーヘッダとエラーリストに分割
  let error = parseCognitoErrorMessageElement(message);
  // console.log('header/errors:', error);

  let errorMessageObjects = [];
  if (error.detail !== null) {
    // 概要と詳細に分割
    let errorMessages = error.detail.split("; ", 10);
    errorMessageObjects = errorMessages.map(parseCognitoErrorMessageElement);
  }

  return {header: error.summary, errors: errorMessageObjects};
}

function parseCognitoErrorMessageElement(element) {
  let index = element.indexOf(":")
  if (index !== -1) {
    return {
      summary: element.substr(0, index),
      detail: element.substr(index + 2)
    }
  } else {
    return {summary: element, detail: null};
  }
}
