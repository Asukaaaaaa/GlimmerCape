import request from '@/utils/request';
import { _api_, _base_ } from '@/utils/api';

type PageConfig = {
  project_id?: string;
  page_num?: string;
  page_size?: string;
};
export async function getDatesetList(params: PageConfig = { page_size: '20' }) {
  return request.post(_base_ + _api_.getDatasetList, { params });
}
export async function getModelList(params: PageConfig = { page_size: '20' }) {
  return request.post(_base_ + _api_.getModelList, { params });
}
