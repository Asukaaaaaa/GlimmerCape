import { Effect, Reducer } from 'umi';

import { queryDatesetList, queryModelList } from './service';

export type DatasetItem = {
  datasetId: number;
  datasetName: string;
  datasetNum: number;
  datasetUrl: string;
  nwbUrl: string;
  periodNum: number;
  projectId: number;
  stopwordFlag: number;
};
export type ModelItem = {
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
  datasetPage: number;
  datasetViewLoading?: boolean;
  datasetView?: DatasetItem[];
  datasetList?: DatasetItem[];

  modelPage: number;
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
    clear: Effect;
  };
  reducers: {
    update: Reducer<StateType>;
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
    *fetchDataset({ payload }, { call, put, select }) {
      put({
        type: 'update',
        payload: { datasetViewLoading: true },
      });
      const { datasetPage, datasetList } = yield select(
        ({ projectDetail }: { projectDetail: StateType }) => projectDetail,
      );
      const response = yield call(queryDatesetList, { project_id: payload, page_num: datasetPage });
      if (response?.data) {
        const { list, pageNumber, pageSize, totalPage, totalRow } = response.data;
        const start = (pageNumber - 1) * pageSize;
        for (let i = start, j = 0; i < start + list.length; i++, j++) datasetList[i] = list[j];
        yield put({
          type: 'update',
          payload: {
            datasetView: datasetList, // TODO
            datasetViewLoading: false,
            datasetList: datasetList,
          },
        });
      }
    },
    *fetchModel({ payload }, { call, put, select }) {
      put({
        type: 'update',
        payload: { modelViewLoading: true },
      });
      const { modelPage, modelList } = yield select(
        ({ projectDetail }: { projectDetail: StateType }) => projectDetail,
      );
      const response = yield call(queryModelList, { project_id: payload, page_num: modelPage });
      if (response?.data) {
        const { list, pageNumber, pageSize, totalPage, totalRow } = response.data;
        const start = (pageNumber - 1) * pageSize;
        for (let i = start, j = 0; i < start + list.length; i++, j++) modelList[i] = list[j];
        yield put({
          type: 'update',
          payload: {
            modelView: modelList, // TODO
            modelViewLoading: false,
            modelList: modelList,
          },
        });
      }
    },
    *paginate({ payload: { type, pagination } }, { call, put, select }) {
      // TODO
    },
    filter() {},
    sort() {},
    *clear({ payload }, { call, put, select }) {
      yield put({
        type: 'update',
        payload: {
          datasetPage: 1,
          datasetViewLoading: false,
          datasetView: [],
          datasetList: [],

          modelPage: 1,
          modelViewLoading: false,
          modelView: [],
          modelList: [],
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
  },
};

export default Model;
