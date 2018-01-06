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
 * @param  {[type]} params            [description]
 * @return {[type]}                   [description]
 */
export function ApiRequest(
  dispatch,
  actionTypeRequest,
  actionTypeSuccess,
  actionTypeFailure,
  bastet,
  bastetApi,
  params
  ) {
  dispatch({ type: actionTypeRequest });
  return bastetApi.call(bastet, params.device_id || params.id, params).then(
    result => {
      dispatch({
        type: actionTypeSuccess,
        params: params,
        result: result.data.schedule,
      });
    },
    error => {
      dispatch({
        type: actionTypeFailure,
        error: error,
      });
    }
  );
}
