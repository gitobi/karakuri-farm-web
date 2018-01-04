import {Device} from '../constants/device';
import {loadWateringInformations} from './devicesWatering';
import {loadPyranometerInformations} from './devicesPyranometer';
import GtbUtils from '../js/GtbUtils'
import Bastet from '../js/Bastet'

export function loadDevices(args = {}) {
  // TODO argsにはOrganizationIdなどを予定
  return function(dispatch) {
    dispatch({ type: Device.LOAD_REQUEST });
    let bastet = new Bastet();
    return bastet.getDevices().then(
      result => {
        dispatch({ type: Device.LOAD_SUCCESS, list: result });
      },
      error => {
        dispatch({ type: Device.LOAD_FAILURE, list: error });
      }
    );
  }
};

export function initialLoadDeviceInformations(app, typeSelected) {
  return function(dispatch) {
    let promises = [];
    Object.keys(typeSelected).forEach((key) => {
      let device = typeSelected[key];
      switch (device.device_type) {
        case 'watering':
          promises.push(dispatch(loadWateringInformations(device)));
          break;
        case 'pyranometer':
          promises.push(dispatch(loadPyranometerInformations(device)));
          break;
        default:
          console.error('error: unknown device_type', device.device_type);
          break;
      }
    });
    return Promise.all(promises).then(
      dispatch({ type: Device.APP, app: app })
      )
    ;
  }
}

export function selectApp(app) {
  // Appの切り替え
  return function(dispatch) {
    dispatch({ type: Device.APP, app: app });
  }
}

export function selectDevice(deviceId, devices) {
  return function(dispatch) {
    return new Promise(() => {
      // デバイスを選択し情報の再読込
      // TODO このハンドリングは別の場所で行うべきかもしれない
      // TODO 現状、デバイスIDが変更される度にBastetから取得することになるが、タンクすべきかもしれない
      let device = GtbUtils.find(devices, 'id', deviceId);
      dispatch({ type: Device.SELECT, id: deviceId });
      switch (device.device_type) {
        case 'watering':
          dispatch(loadWateringInformations(device));
          break;
        case 'pyranometer':
          dispatch(loadPyranometerInformations(device));
          break;
        default:
          console.error('error: unknown device_type', device.device_type);
          break;
      }
    });
  }
};
