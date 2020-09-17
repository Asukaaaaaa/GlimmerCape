import { _api_, _base_ } from '@/utils/api';
import request from '@/utils/request';
import { merge } from 'lodash';

type PageConfig = {
  page_num?: number;
  page_size?: number;
};
export async function queryList(params: { user_id?: number } & PageConfig) {
  return request.post(_base_ + _api_.getProjectList, {
    params: merge({ page_size: 20 }, params),
  });
}
