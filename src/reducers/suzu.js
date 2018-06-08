import { Map, fromJS } from 'immutable';
import { Suzu } from '../constants/suzu';
import GtbUtils from '../js/GtbUtils'
// import Logger from '../js/Logger'

// const _logger = new Logger({prefix: 'suzu'});

const initialSuzu = Map({
  'deviceMonitor': Map({}),
  'progress': false,
});

const suzu = (state = initialSuzu, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case Suzu.LOAD_REQUEST:
      return state.set('progress', true);

    case Suzu.LOAD_SUCCESS:
      let deviceMonitors = action.list.map((value) => {
          return {
            id: value["id"],
            inserted_at: GtbUtils.dateString(new Date(value["inserted_at"])),
            updated_at: GtbUtils.dateString(new Date(value["updated_at"])),
            enable: value["enable"],
            monitoring_range: value["monitoring_range"],
            last_result: value["last_result"],
          };
        });
      let deviceMonitor = deviceMonitors[0] ? deviceMonitors[0] : {};

      return state.withMutations(map => { map
        .set('deviceMonitor', fromJS(deviceMonitor))
        .set('progress', false)
        ;
      });

    case Suzu.LOAD_FAILURE:
      return state.set('progress', false);

    default:
      return state;
  }
}

export default suzu;
