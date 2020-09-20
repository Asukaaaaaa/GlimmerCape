export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
}

export type DatasetListItem = {
  datasetId: number;
  datasetName: string;
  datasetNum: number;
  datasetUrl: string;
  nwbUrl: string;
  periodNum: number;
  projectId: number;
  stopwordFlag: number;
};
export type ModelListItem = {
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

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
