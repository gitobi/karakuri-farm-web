import { combineReducers } from 'redux';
import me from './me'
import deviceWaterings from './deviceWaterings'

const karakuriFarmApp = combineReducers({
  me, deviceWaterings,
});

export default karakuriFarmApp;
