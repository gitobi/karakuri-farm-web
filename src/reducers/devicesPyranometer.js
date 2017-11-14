import { List, Map, fromJS } from 'immutable';
import { DevicesPyranometer } from '../constants/devicesPyranometer';
import GtbUtils from '../js/GtbUtils'
import Logger from '../js/Logger'

const _logger = new Logger({prefix: 'devicesPyranometer'});

const initialDevicesPyranometer = Map({
  'list': List([]),
  'selectedId': '',
  'sensingRecords': List([]),
  'progress': false,
});

const devicePyranometer = (state = initialDevicesPyranometer, action) => {
  _logger.info('state :', state.toJS());
  _logger.info('action :', action);

  switch (action.type) {
    case DevicesPyranometer.LOAD_REQUEST:
      // デバイス情報の取得開始
      return state.set('progress', true);

    case DevicesPyranometer.LOAD_SUCCESS:
      // デバイス情報の取得完了
      let list = action.list.map((value) => {
          return {
            key: value["key"],
            id: value["id"],
            name: value["name"],
            active: false,
          };
        });

      return state.withMutations(map => { map
        .set('list', fromJS(list))
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
        .update('list', list => list.map(
          // 選択されたidであればtrue、それ以外はfalseに更新する
          object => object.set('active', object.get('id') === action.id))
        )
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
