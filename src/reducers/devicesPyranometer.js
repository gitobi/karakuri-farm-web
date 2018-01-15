import { List, Map, fromJS } from 'immutable';
import { DevicesPyranometer } from '../constants/devicesPyranometer';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'devicesPyranometer'});

const initialDevicesPyranometer = Map({
  'sensingRecords': List([]),
  'progress': false,
});

const devicePyranometer = (state = initialDevicesPyranometer, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST:
      // 実績の取得開始
      return state.set('progress', true);

    case DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS:
      // 実績の取得完了
      let sensingRecords = action.sensingRecords.map((value) => {
          return {
            id: value["id"],
            sensed_at: GtbUtils.dateString(new Date(value["sensed_at"])),
            measurement: value["measurement"] * 1,
            samplings_count: value["samplings_count"] * 1,
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
