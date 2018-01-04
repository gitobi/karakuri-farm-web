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
        dispatch({ type: Device.LOAD_FAILURE, list: error })
      }
    );
  }
};

export function selectApp(app) {
  // Appの切り替え
  return function(dispatch) {
    dispatch({ type: Device.APP, app: app });
  }
}

export function selectDevice(deviceId, devices, lastDeviceId) {
  let device = GtbUtils.find(devices, 'id', deviceId);
  // console.log('select: device', device);
  if (deviceId === lastDeviceId) {
    return function(dispatch) {
      dispatch({ type: Device.SELECT, id: deviceId, device: device, lastId: lastDeviceId });
    }

  } else {
    // デバイスIDが変更された場合は再読込も行う
    // TODO このハンドリングは別の場所で行うべきかもしれない
    // TODO 現状、デバイスIDが変更される度にBastetから取得することになるが、タンクすべきかもしれない
    return function(dispatch) {
      dispatch({ type: Device.SELECT, id: deviceId, device: device, lastId: lastDeviceId });
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
    }
  }
};
