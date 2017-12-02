import { combineReducers } from 'redux';
import me from './me'
import devicesWatering from './devicesWatering'
import devicesPyranometer from './devicesPyranometer'
import devicesSystemLog from './devicesSystemLog'

const karakuriFarmApp = combineReducers({
  me,
  devicesWatering,
  devicesPyranometer,
  devicesSystemLog,
});

export default karakuriFarmApp;
