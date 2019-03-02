import persistState from 'redux-localstorage';
import { fromJS } from 'immutable';

const persistSlicer = (paths) => {
  return (state) => {
    // console.log("slicer :", paths, state);
    return {
      device: state.device,
      machine: state.machine,
    }
  }
}

const persistDeserialize = (string) => {
  // console.log("persistDeserialize :", string);
  let obj = JSON.parse(string)
  // console.log("persistDeserialize :", obj);
  let immutableMap = fromJS(obj);
  // console.log("persistDeserialize :", immutableMap);

  const deserializedObj = {
    device: immutableMap.get('device'),
    machine: immutableMap.get('machine'),
  }

  return deserializedObj;
}

const persistMerge = (initialState, persistedState) => {
  // console.log("persistMerge :", initialState, persistedState);
  return persistedState;
}

const persistConfig = {
  key: "karakuri-farm-localStorage",
  slicer: persistSlicer,
  deserialize: persistDeserialize,
  merge: persistMerge
}

export const persistStateLocalStorage = () => {
  return persistState("", persistConfig)
}
