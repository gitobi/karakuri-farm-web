import { List, Map, fromJS } from 'immutable';
import { DevicesPyranometer } from '../constants/devicesPyranometer';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'devicesPyranometer'});

const initialDevicesPyranometer = Map({
  'workingDays': List([]),
  'sensingRecords': List([]),
  'stats': List([]),
  'statsMap': Map({}),
  'progress': false,
});

const devicePyranometer = (state = initialDevicesPyranometer, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case DevicesPyranometer.LOAD_WORKING_DAYS_REQUEST:
      return state.set('progress', true);

    case DevicesPyranometer.LOAD_WORKING_DAYS_SUCCESS:
      let workingDays = action.data.map((value) => {
        let workingDay = GtbUtils.ymdString(new Date(value["sensed_at"]));
        return workingDay;
      });
      return state.withMutations(map => { map
        .set('workingDays', fromJS(workingDays))
        .set('progress', false)
        ;
      });

    case DevicesPyranometer.LOAD_WORKING_DAYS_FAILURE:
      return state.set('progress', false);

    case DevicesPyranometer.LOAD_SENSING_RECORDS_REQUEST:
      // 実績の取得開始
      return state.set('progress', true);

    case DevicesPyranometer.LOAD_SENSING_RECORDS_SUCCESS:
      // 実績の取得完了
      let sensingRecords = action.sensingRecords.map((value) => {
          let sensed_at = GtbUtils.dateString(new Date(value["sensed_at"]));
          let _plotX = GtbUtils.hhmmString(new Date(value["sensed_at"]));;
          return {
            id: value["id"],
            sensed_at: sensed_at,
            measurement: value["measurement"] * 1,
            samplings_count: value["samplings_count"] * 1,
            _plotX: _plotX,
          };
        }).sort((a, b) => {
          if( a.sensed_at < b.sensed_at ) return -1;
          if( a.sensed_at > b.sensed_at ) return 1;
          return 0;
        });

      // let sensingRecordsParDay = {};
      // sensingRecords.forEach((value) => {
      //   let date = value.sensed_at.substr(0, 10);
      //   let time = value.sensed_at.substr(11, 8);
      //   if (!sensingRecordsParDay[date]) {
      //     sensingRecordsParDay[date] = [];
      //   }
      //   value.sensed_at_date = date;
      //   value.sensed_at_time = time;

      //   sensingRecordsParDay[date].push(value);
      // });



      return state.withMutations(map => { map
        .set('sensingRecords', fromJS(sensingRecords))
        // .set('sensingRecordsParDay', fromJS(sensingRecordsParDay))
        .set('progress', false)
        ;
      });

    case DevicesPyranometer.LOAD_SENSING_RECORDS_FAILURE:
      // 実績の取得失敗
      return state.set('progress', false);

    case DevicesPyranometer.LOAD_STATS_REQUEST:
      return state.set('progress', true);

    case DevicesPyranometer.LOAD_STATS_SUCCESS:
      let superiorUnitLength = 0;
      let subordinateUnitStart = 0;
      let subordinateUnitLength = 0;
      switch (action.unit) {
        case "minute":
          superiorUnitLength = 10;
          subordinateUnitStart = 11;
          subordinateUnitLength = 2;
          break;
        case "hour":
          superiorUnitLength = 10;
          subordinateUnitStart = 11;
          subordinateUnitLength = 2;
          break;
        case "day":
          superiorUnitLength = 7;
          subordinateUnitStart = 8;
          subordinateUnitLength = 2;
          break;
        case "month":
          superiorUnitLength = 4;
          subordinateUnitStart = 5;
          subordinateUnitLength = 2;
          break;
        default :
          superiorUnitLength = 7;
          subordinateUnitStart = 8;
          subordinateUnitLength = 2;
          break;
      }
      let stats = action.stats.map((value) => {
          let sensed_at = value["sensed_at"];
          // let sensed_at = GtbUtils.dateString(new Date(value["sensed_at"]));
          let _mapKey = sensed_at.substr(0, superiorUnitLength);
          let _plotX = sensed_at.substr(subordinateUnitStart, subordinateUnitLength);

          return {
            counts: value["counts"] * 1,
            sensed_at: sensed_at,
            measurement: value["measurement"] * 1,
            samplings_count: value["samplings_count"] * 1,
            _mapKey: _mapKey,
            _plotX: _plotX,
          };
        // }).sort((a, b) => {
        //   if( a.sensed_at < b.sensed_at ) return -1;
        //   if( a.sensed_at > b.sensed_at ) return 1;
        //   return 0;
        });

      let statsMap = {};
      stats.forEach((value) => {
        if (!statsMap[value._mapKey]) {
          statsMap[value._mapKey] = [];
        }
        statsMap[value._mapKey].push(value);
      });

      return state.withMutations(map => { map
        .set('stats', fromJS(stats))
        .set('statsMap', fromJS(statsMap))
        .set('progress', false)
        ;
      });

    case DevicesPyranometer.LOAD_STATS_FAILURE:
      // 実績の取得失敗
      return state.set('progress', false);

    default:
      return state;
  }
}

export default devicePyranometer;
