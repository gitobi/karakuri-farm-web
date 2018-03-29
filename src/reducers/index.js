import { combineReducers } from 'redux';
import me from './me'
import device from './device'
import devicesWatering from './devicesWatering'
import devicesPyranometer from './devicesPyranometer'
import devicesSystemLog from './devicesSystemLog'
import machine from './machine'
import machinesRadiationalWatering from './machinesRadiationalWatering'
import account from './account'

const karakuriFarmApp = combineReducers({
  me,
  device,
  devicesWatering,
  devicesPyranometer,
  devicesSystemLog,
  machine,
  machinesRadiationalWatering,
  account,
});

export default karakuriFarmApp;
