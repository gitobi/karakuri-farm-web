import { List, Map, fromJS } from 'immutable';
import { DevicesPyranometer } from '../constants/devicesPyranometer';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'devicesPyranometer'});

const initialDevicesPyranometer = Map({
  'names': List([]),
  'devices': List([]),
  'selectedId': '',
  'selected': Map({}),
  'sensingRecords': List([]),
  'progress': false,
});

const devicePyranometer = (state = initialDevicesPyranometer, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case DevicesPyranometer.LOAD_REQUEST:
      // デバイス情報の取得開始
      return state.set('progress', true);

    case DevicesPyranometer.LOAD_SUCCESS:
      // デバイス情報の取得完了
      let names = action.list.map((value) => {
          return {
            key: value["id"],
            id: value["id"],
            name: value["name"],
            active: false,
          };
        });

      let devices = action.list.map((value) => {
          return {
            id: value["id"],
            device_type: value["device_type"],
            name: value["name"],
            software_version: value["software_version"],
            model_number: value["model_number"],
            heartbeated_at: GtbUtils.dateString(new Date(value["heartbeated_at"])),
            inserted_at: GtbUtils.dateString(new Date(value["inserted_at"])),
            updated_at: GtbUtils.dateString(new Date(value["updated_at"])),
          };
        });

      return state.withMutations(map => { map
        .set('names', fromJS(names))
        .set('devices', fromJS(devices))
        .set('selectedId', '')
        .set('selected', Map({}))
        .set('progress', false)
        ;
      });

    case DevicesPyranometer.LOAD_FAILURE:
      // デバイス情報の取得失敗
      return state.set('progress', false);

    case DevicesPyranometer.SELECT:
      // デバイスの選択

      // 指定された要素を選択状態にする
      // TODO viewのために仕方なく必要な処理であるため、ここでやるべきではないかも

      return state.withMutations(map => { map
        .set('selectedId', action.id)
        .update('names', list => list.map(
            // 選択されたidであればtrue、それ以外はfalseに更新する
            object => object.set('active', object.get('id') === action.id)
          )
        )
        .set('selected', map.get('devices').find(object => object.get('id') === action.id))
      });

    case DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST:
      // 実績の取得開始
      return state.set('progress', true);

    case DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS:
      // 実績の取得完了
      let sensingRecords = action.sensingRecords.map((value) => {
          return {
            id: value["id"],
            sensed_at: GtbUtils.dateString(new Date(value["sensed_at"])),
            measurement: value["measurement"],
            samplings: value["samplings"],
          };
        });

      return state.withMutations(map => { map
        .set('sensingRecords', fromJS(sensingRecords))
        .set('progress', false)
        ;
      });

    case DevicesPyranometer.LOAD_SENSING_RECORDS_FAILURE:
      // 実績の取得失敗
      return state.set('progress', false);

    default:
      return state;
  }
}

export default devicePyranometer;
