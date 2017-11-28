import { combineReducers } from 'redux';
import me from './me'
import devicesWatering from './devicesWatering'
import devicesPyranometer from './devicesPyranometer'
import devicesAlert from './devicesAlert'

const karakuriFarmApp = combineReducers({
  me,
  devicesWatering,
  devicesPyranometer,
  devicesAlert,
});

export default karakuriFarmApp;
