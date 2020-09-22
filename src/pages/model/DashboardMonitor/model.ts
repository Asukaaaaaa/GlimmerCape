import { Effect, Reducer } from 'umi';

import { RadarDataType, TagType } from './data.d';
import { queryTags, queryRadarData } from './service';

export interface StateType {
  tags: TagType[];

  radarData: RadarDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchTags: Effect;
    fetchRadarData: Effect;
  };
  reducers: {
    update: Reducer<StateType>;

    saveTags: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'modelAndDashboardMonitor',

  state: {
    tags: [],

    radarData: [],
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(queryTags);
      yield put({
        type: 'saveTags',
        payload: response.list,
      });
    },
    *fetchRadarData(_, { call, put }) {
      const response = yield call(queryRadarData);
      yield put({
        type: 'update',
        payload: {
          radarData: response.data,
        },
      });
    },
  },

  reducers: {
    update(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
  },
};

export default Model;
