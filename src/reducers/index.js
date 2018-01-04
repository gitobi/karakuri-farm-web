import { combineReducers } from 'redux';
import me from './me'
import device from './device'
import devicesWatering from './devicesWatering'
import devicesPyranometer from './devicesPyranometer'
import devicesSystemLog from './devicesSystemLog'

const karakuriFarmApp = combineReducers({
  me,
  device,
  devicesWatering,
  devicesPyranometer,
  devicesSystemLog,
});

export default karakuriFarmApp;
