const app = "@KF"
const module = "DEVICES_PYRANOMETER"
const prefix = `${app}/${module}/`
export const DevicesPyranometer = {
  LOAD_SENSING_RECORDS_REQUEST: prefix + 'LOAD_SENSING_RECORDS_REQUEST',
  LOAD_SENSING_RECORDS_SUCCESS: prefix + 'LOAD_SENSING_RECORDS_SUCCESS',
  LOAD_SENSING_RECORDS_FAILURE: prefix + 'LOAD_SENSING_RECORDS_FAILURE',
}
