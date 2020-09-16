import { _api_, _base_ } from '@/utils/api';
import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function queryUser(uid: string): Promise<any> {
  return request.post(_base_ + _api_.getUserInfo, {
    params: {
      user_id: uid,
    },
  });
}
