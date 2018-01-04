import { List, Map, fromJS } from 'immutable';
import { Device } from '../constants/device';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'devicesWatering'});

const initialDevice = Map({
  'names': List([]),
  'devices': List([]),
  'selectedId': '',
  'selected': Map({}),

  'typeNames': fromJS({watering: [], pyranometer: [],}),
  'typeDevices': fromJS({watering: [], pyranometer: [],}),
  'typeSelectedId': fromJS({watering: '', pyranometer: '',}),
  'typeSelected': fromJS({watering: {}, pyranometer: {},}),

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
      let selectedId = selectFirst(names);
      let typeSelectedId = selectsFirst(typeNames);

      let selected = get(selectedId, devices);
      let typeSelected = gets(typeSelectedId, devices);

      return state.withMutations(map => { map
        .set('names', fromJS(names))
        .set('devices', fromJS(devices))
        .set('selectedId', selectedId)
        .set('selected', fromJS(selected))
        .set('typeNames', fromJS({watering: [], pyranometer: [],}).mergeDeep(fromJS(typeNames)))
        .set('typeDevices', fromJS({watering: [], pyranometer: [],}).mergeDeep(fromJS(typeDevices)))
        .set('typeSelectedId', fromJS({watering: '', pyranometer: '',}).mergeDeep(fromJS(typeSelectedId)))
        .set('typeSelected', fromJS({watering: {}, pyranometer: {},}).mergeDeep(fromJS(typeSelected)))
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
        .set('selectedId', state.getIn(['typeSelectedId', action.app]))
        .set('selected', state.getIn(['typeSelected', action.app]))
      });

    case Device.SELECT:
      // デバイスの選択

      // 指定された要素を選択状態にする
      // TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも

      return state.withMutations(map => { map
        .set('selectedId', action.id)
        .set('selected', fromJS(action.device))
        .setIn(['typeSelectedId', action.device.device_type], action.id)
        .setIn(['typeSelected', action.device.device_type], action.device)
        .update('names', list => list.map(
            // 選択されたidであればtrue、それ以外はfalseに更新する
            object => object.set('active', object.get('id') === action.id)
          )
        )
        .updateIn(['typeNames', action.device.device_type], list => list.map(
            // 選択されたidであればtrue、それ以外はfalseに更新する
            object => object.set('active', object.get('id') === action.id)
          )
        )
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

const gets = (typeSelectedId, names) => {
  let hash = {};
  Object.keys(typeSelectedId).forEach((key) => {
    let id = typeSelectedId[key];
    hash[key] = get(id, names);
  });
  return hash;
}

export default device;
