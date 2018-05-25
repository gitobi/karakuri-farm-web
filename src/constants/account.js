const app = "@KF"
const module = "ACCOUNT"
const prefix = `${app}/${module}/`
export const Account = {
  LOAD_REQUEST: prefix + 'LOAD_REQUEST',
  LOAD_SUCCESS: prefix + 'LOAD_SUCCESS',
  LOAD_FAILURE: prefix + 'LOAD_FAILURE',
  UPDATE: prefix + 'UPDATE',
  SAVE_REQUEST: prefix + 'SAVE_REQUEST',
  SAVE_SUCCESS: prefix + 'SAVE_SUCCESS',
  SAVE_FAILURE: prefix + 'SAVE_FAILURE',
  PUT_REQUEST: prefix + 'PUT_REQUEST',
  PUT_SUCCESS: prefix + 'PUT_SUCCESS',
  PUT_FAILURE: prefix + 'PUT_FAILURE',
  POST_REQUEST: prefix + 'POST_REQUEST',
  POST_SUCCESS: prefix + 'POST_SUCCESS',
  POST_FAILURE: prefix + 'POST_FAILURE',
  JOIN_REQUEST: prefix + 'JOIN_REQUEST',
  JOIN_SUCCESS: prefix + 'JOIN_SUCCESS',
  JOIN_FAILURE: prefix + 'JOIN_FAILURE',
}
