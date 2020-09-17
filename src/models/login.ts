import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { accountLogout, accountLogin } from '@/services/login';
import { setAuthority } from '@/utils/Authorized';
import { getPageQuery, setStorage } from '@/utils/utils';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
    autoAuth: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload: { type, auth, ...pass } }, { call, put }) {
      const res = yield call(accountLogin, pass, auth);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: res?.data ? 'ok' : 'error',
          type,
          currentAuthority: auth,
        },
      });

      if (res?.data) {
        // Login successfully
        setStorage('uid', res.data);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    *logout({ payload }, { call, put }) {
      yield call(accountLogout, payload);
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },

    *autoAuth({ payload }, { call, put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: payload,
        },
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
