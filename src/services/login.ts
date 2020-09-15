import request from '@/utils/request';

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

export async function accountLogin(params: any) {
  // TODO do some request
  // request('/api/login/account', { data: params });
  
}

export async function accountLogout(params: any) {
  // TODO do some request
  // request('/api/login/account', { data: params });

}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
