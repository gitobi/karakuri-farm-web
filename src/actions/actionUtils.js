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
