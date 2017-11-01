import { combineReducers } from 'redux';
import me from './me'
import deviceWatering from './deviceWatering'

const karakuriFarmApp = combineReducers({
  me,
  deviceWatering,
});

export default karakuriFarmApp;
