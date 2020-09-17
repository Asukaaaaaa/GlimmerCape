import { Effect, Reducer } from 'umi';

import { CardListItemDataType } from './data.d';
import { queryList } from './service';

export interface StateType {
  list: CardListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'projectAnd',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'queryList',
        payload: response?.data
          ? response.data
          : {
              list: [],
            },
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload.list,
      };
    },
  },
};

export default Model;
