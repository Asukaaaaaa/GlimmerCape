import request from '@/utils/request';
import { _api_, _base_ } from '@/utils/api';
import { merge } from 'lodash';

type PageConfig = {
  project_id?: string;
  page_num?: string;
  page_size?: string;
};
export async function queryDatesetList(params: PageConfig) {
  return request.post(_base_ + _api_.getDatasetList, {
    params: merge({ page_size: '20' }, params),
  });
}
export async function queryModelList(params: PageConfig) {
  return request.post(_base_ + _api_.getModelList, {
    params: merge({ page_size: '20' }, params),
  });
}
