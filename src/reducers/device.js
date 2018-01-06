import { List, Map, fromJS } from 'immutable';
import { Device } from '../constants/device';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'devicesWatering'});

const deviceTypes = ['watering', 'pyranometer']

const deviceTypeArray = (() => {
  // {a: [], b: [], ...}
  let hash = {};
  deviceTypes.forEach(v => hash[v] = []);
  return hash;
})();

const deviceTypeMap = (() => {
  // {a: {}, b: {}, ...}
  let hash = {};
  deviceTypes.forEach(v => hash[v] = {});
  return hash;
})();

const toTypeDevicesMap = (devices) => {
  let hash = deviceTypeMap;
  for (let device of devices) {
    hash[device.device_type][device.id] = device;
  }
  return hash;
}

const toTypeDevices = (devices) => {
  let hash = deviceTypeArray;
  for (let device of devices) {
    hash[device.device_type].push(device);
  }
  return hash;
}

const machineTypes = ['radiational_watering'];

const initialDevice = Map({
  'devices': List([]),
  'devicesList': fromJS(deviceTypeArray),
  'devicesMap': fromJS(deviceTypeMap),
  'changed': Map({}),
  'progress': false,
});

const device = (state = initialDevice, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case Device.LOAD_REQUEST:
      // デバイス情報の取得開始
      return state.set('progress', true);

    case Device.LOAD_SUCCESS:
      // デバイス情報の取得完了
      let devices = action.list.map((value) => {
          let map = {
            id: value["id"],
            device_type: value["device_type"],
            name: value["name"],
            software_version: value["software_version"],
            model_number: value["model_number"],
            heartbeated_at: GtbUtils.dateString(new Date(value["heartbeated_at"])),
            inserted_at: GtbUtils.dateString(new Date(value["inserted_at"])),
            updated_at: GtbUtils.dateString(new Date(value["updated_at"])),
          };
          if ('order_amount' in value) {
            map.order_amount = value["order_amount"]
          }
          return map;
        });

      let devicesList = toTypeDevices(devices);
      let devicesMap = toTypeDevicesMap(devices);

      return state.withMutations(map => { map
        .set('devices', fromJS(devices))
        .set('devicesList', fromJS(devicesList))
        .set('devicesMap', fromJS(devicesMap))
        .set('changed', Map({}))
        .set('progress', false)
        ;
      });

    case Device.LOAD_FAILURE:
      // デバイス情報の取得失敗
      return state.set('progress', false);

    case Device.UPDATE:
      // スケジュールを変更
      // TODO 保存して全部再読込するのが面倒だからとりあえず全部更新する
      let updateDevice = GtbUtils.find(state.get('devices').toJS(), 'id', action.id);
      let updateDevicesIndex = GtbUtils.findIndex(state.get('devices').toJS(), 'id', action.id);
      let updateDevicesListIndex = GtbUtils.findIndex(state.getIn(['devicesList', updateDevice.device_type]).toJS(), 'id', action.id);

      return state.withMutations(map => { map
        .setIn(['changed', action.id, action.column], action.value)
        .setIn(['changed', action.id, '_errors', action.column], action.error)
        // TODO 保存した後に全部再読込するのが面倒だからとりあえず全部更新する
        .setIn(['devices', updateDevicesIndex, action.column], action.value)
        .setIn(['devicesList', updateDevice.device_type, updateDevicesListIndex, action.column], action.value)
        .setIn(['devicesMap', updateDevice.device_type, action.id, action.column], action.value)
        ;
      });

    case Device.SAVE_REQUEST:
      return state.set('progress', true);

    case Device.SAVE_SUCCESS:
      return state.set('progress', false);

    case Device.SAVE_FAILURE:
      return state.set('progress', false);

    case Device.PUT_REQUEST:
      return state;

    case Device.PUT_SUCCESS:
      return state.deleteIn(['changed', action.params.id]);

    case Device.PUT_FAILURE:
      return state;

    default:
      return state;
  }
}

export default device;
