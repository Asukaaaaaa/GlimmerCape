import { merge } from 'lodash';
import { Effect, Reducer } from 'umi';

import { queryDatesetList, queryModelList } from './service';

type DatasetItem = {
  datasetId: number;
  datasetName: string;
  datasetNum: number;
  datasetUrl: string;
  nwbUrl: string;
  periodNum: number;
  projectId: number;
  stopwordFlag: number;
};
type ModelItem = {
  communityNum: number;
  createTime: number;
  datasetId: number;
  detectorFlag: number;
  layoutFlag: number;
  modelId: number;
  modelName: string;
  modelStatus: number;
  modifyTime: number;
  projectId: number;
  showFlag: number;
  similarityFlag: number;
  similarityThreshold: number;
  sortFlag: number;
};

export interface StateType {
  datasetPage?: number;
  datasetViewLoading?: boolean;
  datasetView?: DatasetItem[];
  datasetList?: DatasetItem[];

  modelPage?: number;
  modelViewLoading?: boolean;
  modelView?: ModelItem[];
  modelList?: ModelItem[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchDataset: Effect;
    fetchModel: Effect;
    paginate: Effect;
    filter: Effect;
    sort: Effect;
  };
  reducers: {
    updateDatasetList: Reducer<StateType>;

    updateModelList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'projectDetail',

  state: {
    datasetPage: 1,
    datasetViewLoading: false,
    datasetView: [],
    datasetList: [],

    modelPage: 1,
    modelViewLoading: false,
    modelView: [],
    modelList: [],
  },

  effects: {
    *fetchDataset({ payload }, { call, put }) {
      const response = yield call(queryDatesetList, payload);
      if (response?.data) {
        const { list, pageNumber, pageSize, totalPage, totalRow } = response.data;
        const start = (pageNumber - 1) * pageSize;
        const listCopy = new Array<DatasetItem>(totalRow);
        for (let i = start, j = 0; i < start + list.length; i++, j++) listCopy[i] = list[j];
        yield put({
          type: 'updateDatasetList',
          payload: listCopy,
        });
      }
    },
    *fetchModel({ payload }, { call, put }) {
      const response = yield call(queryModelList, payload);
      if (response?.data) {
        const { list, pageNumber, pageSize, totalPage, totalRow } = response.data;
        const start = (pageNumber - 1) * pageSize;
        const listCopy = new Array<ModelItem>(totalRow);
        for (let i = start, j = 0; i < start + list.length; i++, j++) listCopy[i] = list[j];
        yield put({
          type: 'updateModelList',
          payload: listCopy,
        });
      }
    },
    paginate({ payload: { type, pagination } }, { call, put, select }) {},
    filter() {},
    sort() {},
  },

  reducers: {
    updateDatasetList(state, action) {
      const list = merge(state?.datasetList, action.payload);
      return {
        ...state,
        datasetView: list, // TODO view redo for new list
        datasetList: list,
      };
    },
    updateModelList(state, action) {
      const list = merge(state?.modelList, action.payload);
      return {
        ...state,
        modelView: list, // TODO view redo for new list
        modelList: list,
      };
    },
  },
};

export default Model;
