const app = "@KF"
const module = "DEVICE"
const prefix = `${app}/${module}/`
export const Device = {
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
}
