const app = "@KF"
const module = "DEVICES_WATERING"
const prefix = `${app}/${module}/`
export const DevicesWatering = {
  LOAD_SCHEDULES_REQUEST: prefix + 'LOAD_SCHEDULES_REQUEST',
  LOAD_SCHEDULES_SUCCESS: prefix + 'LOAD_SCHEDULES_SUCCESS',
  LOAD_SCHEDULES_FAILURE: prefix + 'LOAD_SCHEDULES_FAILURE',
  SAVE_SCHEDULES_REQUEST: prefix + 'SAVE_SCHEDULES_REQUEST',
  SAVE_SCHEDULES_SUCCESS: prefix + 'SAVE_SCHEDULES_SUCCESS',
  SAVE_SCHEDULES_FAILURE: prefix + 'SAVE_SCHEDULES_FAILURE',
  POST_SCHEDULES_REQUEST: prefix + 'POST_SCHEDULES_REQUEST',
  POST_SCHEDULES_SUCCESS: prefix + 'POST_SCHEDULES_SUCCESS',
  POST_SCHEDULES_FAILURE: prefix + 'POST_SCHEDULES_FAILURE',
  PUT_SCHEDULES_REQUEST: prefix + 'PUT_SCHEDULES_REQUEST',
  PUT_SCHEDULES_SUCCESS: prefix + 'PUT_SCHEDULES_SUCCESS',
  PUT_SCHEDULES_FAILURE: prefix + 'PUT_SCHEDULES_FAILURE',
  DELETE_SCHEDULES_REQUEST: prefix + 'DELETE_SCHEDULES_REQUEST',
  DELETE_SCHEDULES_SUCCESS: prefix + 'DELETE_SCHEDULES_SUCCESS',
  DELETE_SCHEDULES_FAILURE: prefix + 'DELETE_SCHEDULES_FAILURE',
  ADD_SCHEDULE: prefix + 'ADD_SCHEDULE',
  REMOVE_SCHEDULE: prefix + 'REMOVE_SCHEDULE',
  UPDATE_SCHEDULE: prefix + 'UPDATE_SCHEDULE',
  LOAD_OPERATIONAL_RECORDS_REQUEST: prefix + 'LOAD_OPERATIONAL_RECORDS_REQUEST',
  LOAD_OPERATIONAL_RECORDS_SUCCESS: prefix + 'LOAD_OPERATIONAL_RECORDS_SUCCESS',
  LOAD_OPERATIONAL_RECORDS_FAILURE: prefix + 'LOAD_OPERATIONAL_RECORDS_FAILURE',
}
