import { _base_, _api_ } from '@/utils/api';
import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

export async function downloadDataset(params: { dataset_id: string }) {
  return request.post(_base_ + _api_.downloadDataset, { params });
}
export async function deleteDataset(params: { dataset_id: string }) {
  return request.post(_base_ + _api_.deleteDataset, { params });
}

export async function deleteModel(params: { model_id: string }) {
  return request.post(_base_ + _api_.deleteModel, { params });
}
