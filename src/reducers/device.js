import { List, Map, fromJS } from 'immutable';
import { Device } from '../constants/device';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'devicesWatering'});

const initialDevice = Map({
  'names': List([]),
  'devices': List([]),
  'selectedApp': '',
  'selectedDeviceId': '',
  'selectedDevice': Map({}),

  'typeNames': fromJS({watering: [], pyranometer: [],}),
  'typeDevices': fromJS({watering: [], pyranometer: [],}),
  'typeSelectedDeviceId': fromJS({watering: '', pyranometer: '',}),
  'typeSelectedDevice': fromJS({watering: {}, pyranometer: {},}),

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

      let typeDevices = toTypeDevices(devices);

      let names = toNames(devices);
      let typeNames = toTypeNames(devices);

      // それぞれの先頭要素を選択状態にする
      let selectedDeviceId = selectFirst(names);
      let typeSelectedDeviceId = selectsFirst(typeNames);

      let selectedDevice = get(selectedDeviceId, devices);
      let typeSelectedDevice = gets(typeSelectedDeviceId, devices);

      return state.withMutations(map => { map
        .set('names', fromJS(names))
        .set('devices', fromJS(devices))
        .set('selectedDeviceId', selectedDeviceId)
        .set('selectedDevice', fromJS(selectedDevice))
        .set('typeNames', fromJS({watering: [], pyranometer: [],}).mergeDeep(fromJS(typeNames)))
        .set('typeDevices', fromJS({watering: [], pyranometer: [],}).mergeDeep(fromJS(typeDevices)))
        .set('typeSelectedDeviceId', fromJS({watering: '', pyranometer: '',}).mergeDeep(fromJS(typeSelectedDeviceId)))
        .set('typeSelectedDevice', fromJS({watering: {}, pyranometer: {},}).mergeDeep(fromJS(typeSelectedDevice)))
        .set('progress', false)
        ;
      });

    case Device.LOAD_FAILURE:
      // デバイス情報の取得失敗
      return state.set('progress', false);

    case Device.APP:
      // APPの選択
      // TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも
      return state.withMutations(map => { map
        .set('selectedApp', action.app)
        .set('selectedDeviceId', state.getIn(['typeSelectedDeviceId', action.app]))
        .set('selectedDevice', state.getIn(['typeSelectedDevice', action.app]))
      });

    case Device.SELECT:
      // デバイスの選択

      // 指定された要素を選択状態にする
      // TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも

      let device = GtbUtils.find(state.get('devices').toJS(), 'id', action.id);
      return state.withMutations(map => { map
        .set('selectedDeviceId', action.id)
        .set('selectedDevice', fromJS(device))
        .setIn(['typeSelectedDeviceId', device.device_type], action.id)
        .setIn(['typeSelectedDevice', device.device_type], fromJS(device))
        .update('names', list => list.map(
            // 選択されたidであればtrue、それ以外はfalseに更新する
            object => object.set('active', object.get('id') === action.id)
          )
        )
        .updateIn(['typeNames', device.device_type], list => list.map(
            // 選択されたidであればtrue、それ以外はfalseに更新する
            object => object.set('active', object.get('id') === action.id)
          )
        )
      });

    case Device.UPDATE:
      // スケジュールを変更
      var updateIndex = GtbUtils.findIndex(state.get('devices').toJS(), 'id', action.id);

      // 変更点のみ保持するタイプ
      return state.withMutations(map => { map
        .setIn(['selectedDevice', action.column], action.value)
        .setIn(['selectedDevice', '_errors', action.column], action.error)
        .setIn(['devices', updateIndex, action.column], action.value)
        ;
      });

    default:
      return state;
  }
}

const toTypeDevices = (devices) => {
  let hash = {}
  for (let device of devices) {
    if (!(device.device_type in hash)) {
      hash[device.device_type] = [];
    }
    hash[device.device_type].push(device);
  }
  return hash;
}

const toName = (device) => {
  return {
    key: device["id"],
    id: device["id"],
    name: device["name"],
    active: false,
  };
}

const toNames = (devices) => {
  return devices.map((device) => {
    return toName(device);
  });
}

const toTypeNames = (devices) => {
  let hash = {}
  for (let device of devices) {
    if (!(device.device_type in hash)) {
      hash[device.device_type] = [];
    }
    hash[device.device_type].push(toName(device));
  }
  return hash;
}

const selectsFirst = (typeNames) => {
  let hash = {};
  Object.keys(typeNames).forEach((key) => {
    hash[key] = selectFirst(typeNames[key]);
  });
  return hash;
}

const selectFirst = (names) => {
  if (1 <= names.length) {
    let id = names[0].id;
    select(id, names);
    return id;
  } else {
    return '';
  }
}

const select = (id, names) => {
  for(let name of names) {
    name.active = name.id === id;
  }
}

const get = (id, devices) => {
  return GtbUtils.find(devices, 'id', id);
}

const gets = (typeSelectedDeviceId, names) => {
  let hash = {};
  Object.keys(typeSelectedDeviceId).forEach((key) => {
    let id = typeSelectedDeviceId[key];
    hash[key] = get(id, names);
  });
  return hash;
}

export default device;
