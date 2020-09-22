// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    // welcome
    {
      path: '/welcome',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/welcome',
          name: 'welcome',
          component: './Welcome',
        },
      ],
    }, // user
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'register',
          path: '/user/register',
          component: './user/Register',
        },
        {
          name: 'result',
          path: '/user/register/result',
          component: './user/RegisterResult',
        },
      ],
    },
    {
      path: '/admin',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/admin/login',
          component: './user/login',
        },
      ],
    }, // app
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/list',
            },
            {
              name: 'list',
              icon: 'table',
              path: '/list',
              component: '../layouts/BlankLayout',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'dataset',
                  icon: 'table',
                  path: '/list/dataset/:pid',
                  component: './TableList/DatasetList',
                },
                {
                  name: 'model',
                  icon: 'table',
                  path: '/list/model/:pid',
                  component: './TableList/ModelList',
                },
                {
                  name: 'project',
                  icon: 'table',
                  path: '/list/project',
                  component: './project/PrjList',
                },
                {
                  path: '/list',
                  redirect: '/list/project',
                },
              ],
            },
            {
              name: 'model',
              icon: 'smile',
              path: '/model',
              component: '../layouts/BlankLayout',
              hideInMenu: true,
              hideChildrenInMenu: true,
              routes: [
                {
                  name: '监控页',
                  icon: 'smile',
                  path: '/model/dashboardmonitor/:mid',
                  component: './model/DashboardMonitor',
                },
                {
                  name: '工作台',
                  icon: 'smile',
                  path: '/model/dashboardworkplace/:mid',
                  component: './model/DashboardWorkplace',
                },
              ],
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },

            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
