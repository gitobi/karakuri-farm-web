const app = "@KF"
const module = "DEVICE"
const prefix = `${app}/${module}/`
export const Device = {
  LOAD_REQUEST: prefix + 'LOAD_REQUEST',
  LOAD_SUCCESS: prefix + 'LOAD_SUCCESS',
  LOAD_FAILURE: prefix + 'LOAD_FAILURE',
  APP: prefix + 'APP',
  SELECT: prefix + 'SELECT',
  UPDATE: prefix + 'UPDATE',
}
