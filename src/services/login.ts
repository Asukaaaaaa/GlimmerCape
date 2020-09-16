import { _api_, _base_ } from '@/utils/api';
import request from '@/utils/request';
import { setStorage } from '@/utils/utils';

/* ---------------------------------- fake ---------------------------------- */
export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}
export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
/* -------------------------------------------------------------------------- */

type AccountPass = {
  account: string;
  password: string;
};
type AccountType = 'user' | 'admin';
export async function accountLogin(params: AccountPass, type: AccountType = 'user') {
  if (type === 'user')
    return request.post(_base_ + _api_.userLogin, {
      params,
    });
  else if (type === 'admin')
    return request.post(_base_ + _api_.adminLogin, {
      params,
    });
}

export async function accountLogout(params: any) {
  // // TODO do some request
  // // request('/api/login/account', { data: params });
  // ? got no api, do 'logout' in localStorage
  setStorage('uid');
  // // TODO reload
}

type AccountInfo = AccountPass & {
  // TODO
};
export async function accountRegister(params: AccountInfo) {
  return request.post(_base_ + _api_.userRegister, {
    params,
  });
}
