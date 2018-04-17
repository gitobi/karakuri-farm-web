import { combineReducers } from 'redux';
import me from './me'
import device from './device'
import devicesWatering from './devicesWatering'
import devicesPyranometer from './devicesPyranometer'
import devicesSystemLog from './devicesSystemLog'
import machine from './machine'
import machinesRadiationalWatering from './machinesRadiationalWatering'
import account from './account'
import suzu from './suzu'

const karakuriFarmApp = combineReducers({
  me,
  device,
  devicesWatering,
  devicesPyranometer,
  devicesSystemLog,
  machine,
  machinesRadiationalWatering,
  account,
  suzu,
});

export default karakuriFarmApp;
