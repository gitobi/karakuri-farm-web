import { List, Map, fromJS } from 'immutable';
import { Machine } from '../constants/machine';
import GtbUtils from '../js/GtbUtils'

// import Logger from '../js/Logger'
// const _logger = new Logger({prefix: 'machinesWatering'});

const machineTypes = ['radiationalWatering']

const machineTypeArray = (() => {
  // {a: [], b: [], ...}
  let hash = {};
  machineTypes.forEach(v => hash[v] = []);
  return hash;
})();

const machineTypeMap = (() => {
  // {a: {}, b: {}, ...}
  let hash = {};
  machineTypes.forEach(v => hash[v] = {});
  return hash;
})();

const toTypeMachinesMap = (machines) => {
  let hash = machineTypeMap;
  for (let machine of machines) {
    hash[machine._type][machine.id] = machine;
  }
  return hash;
}

const toTypeMachines = (machines) => {
  let hash = machineTypeArray;
  for (let machine of machines) {
    hash[machine._type].push(machine);
  }
  return hash;
}

const initialMachine = Map({
  'machines': List([]),
  'machinesList': fromJS(machineTypeArray),
  'machinesMap': fromJS(machineTypeMap),
  'changed': Map({}),
  'progress': false,
});

const machine = (state = initialMachine, action) => {
  // _logger.info('state :', state.toJS());
  // _logger.info('action :', action);

  switch (action.type) {
    case Machine.LOAD_REQUEST:
      // デバイス情報の取得開始
      return state.set('progress', true);

    case Machine.LOAD_SUCCESS:
      // デバイス情報の取得完了
      let machines = action.list.map((value) => {
          let map = {
            id: value["id"],
            machine_type: value["machine_type"],
            name: value["name"],
            heartbeated_at: GtbUtils.dateString(new Date(value["heartbeated_at"])),
            inserted_at: GtbUtils.dateString(new Date(value["inserted_at"])),
            updated_at: GtbUtils.dateString(new Date(value["updated_at"])),
            '_type': value["_type"]
          };
          switch (map._type) {
            case 'radiationalWatering':
              map.watering_id = value["watering_id"];
              map.pyranometer_id = value["pyranometer_id"];
              break;
            default:
              break;
          }

          return map;
        });

      let machinesList = toTypeMachines(machines);
      let machinesMap = toTypeMachinesMap(machines);

      return state.withMutations(map => { map
        .set('machines', fromJS(machines))
        .set('machinesList', fromJS(machinesList))
        .set('machinesMap', fromJS(machinesMap))
        .set('changed', Map({}))
        .set('progress', false)
        ;
      });

    case Machine.LOAD_FAILURE:
      // デバイス情報の取得失敗
      return state.set('progress', false);

    case Machine.UPDATE:
      // スケジュールを変更
      // TODO 保存して全部再読込するのが面倒だからとりあえず全部更新する
      let updateMachine = GtbUtils.find(state.get('machines').toJS(), 'id', action.id);
      let updateMachinesIndex = GtbUtils.findIndex(state.get('machines').toJS(), 'id', action.id);
      let updateMachinesListIndex = GtbUtils.findIndex(state.getIn(['machinesList', updateMachine._type]).toJS(), 'id', action.id);

      return state.withMutations(map => { map
        .setIn(['changed', action.id, action.column], action.value)
        .setIn(['changed', action.id, '_errors', action.column], action.error)
        // TODO 保存した後に全部再読込するのが面倒だからとりあえず全部更新する
        .setIn(['machines', updateMachinesIndex, action.column], action.value)
        .setIn(['machinesList', updateMachine._type, updateMachinesListIndex, action.column], action.value)
        .setIn(['machinesMap', updateMachine._type, action.id, action.column], action.value)
        ;
      });

    case Machine.SAVE_REQUEST:
      return state.set('progress', true);

    case Machine.SAVE_SUCCESS:
      return state.set('progress', false);

    case Machine.SAVE_FAILURE:
      return state.set('progress', false);

    case Machine.PUT_REQUEST:
      return state;

    case Machine.PUT_SUCCESS:
      return state.deleteIn(['changed', action.params.id]);

    case Machine.PUT_FAILURE:
      return state;

    default:
      return state;
  }
}

export default machine;
