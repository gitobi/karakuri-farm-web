import { combineReducers } from 'redux';
import me from './me'
import devicesWatering from './devicesWatering'

const karakuriFarmApp = combineReducers({
  me,
  devicesWatering,
});

export default karakuriFarmApp;
