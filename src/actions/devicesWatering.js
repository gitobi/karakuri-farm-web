import {DevicesWatering} from '../constants/devicesWatering';

export function loadDevicesWaterings() {
  return { type: DevicesWatering.LOAD };
};

export function selectDevicesWatering(id) {
  return {
    type: DevicesWatering.SELECT,
    id: id
  };
};

export function loadDevicesWateringSchedules() {
  return { type: DevicesWatering.LOAD_SCHEDULES };
};

export function saveDevicesWateringSchedules() {
  return { type: DevicesWatering.SAVE_SCHEDULES };
};

export function addDevicesWateringSchedule() {
  return { type: DevicesWatering.ADD_SCHEDULE };
};

export function removeDevicesWateringSchedule(id) {
  return {
    type: DevicesWatering.REMOVE_SCHEDULE,
    id: id,
  };
};

export function updateDevicesWateringSchedule(id, column, value) {
  return {
    type: DevicesWatering.UPDATE_SCHEDULE,
    id: id,
    column: column,
    value: value,
  };
};

