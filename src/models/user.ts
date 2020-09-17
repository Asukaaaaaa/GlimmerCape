import { Effect, Reducer } from 'umi';

import { queryUser } from '@/services/user';
import { getStorage, originFilePathParser } from '@/utils/utils';
import { merge } from 'lodash';
import { getAuthority } from '@/utils/Authorized';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  userid?: string;
  // account: string
  // password: string
  phone?: string;
  // photo: string
  // userId: string
  createTime?: string;
  // isAdmin?: boolean;

  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const uid = getStorage('uid'),
        auth = getAuthority()[0];
      if (uid) {
        const response = yield call(queryUser, uid);
        yield [
          put({
            type: 'saveCurrentUser',
            payload: response.data,
          }),
          put({
            type: 'login/autoAuth',
            payload: auth,
          }),
        ];
      } else console.warn('No uid. Not Signed!');
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const { payload } = action;
      return {
        ...state,
        currentUser: merge(
          state?.currentUser,
          payload
            ? {
                avatar: payload.photo ? originFilePathParser(payload.photo) : '', // TODO default img src
                name: payload.account,
                userid: payload.userId,
                phone: payload.phone,
                createTime: payload.createTime,
              }
            : {},
        ),
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
