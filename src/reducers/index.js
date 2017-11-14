import { combineReducers } from 'redux';
import me from './me'
import devicesWatering from './devicesWatering'
import devicesPyranometer from './devicesPyranometer'

const karakuriFarmApp = combineReducers({
  me,
  devicesWatering,
  devicesPyranometer,
});

export default karakuriFarmApp;
