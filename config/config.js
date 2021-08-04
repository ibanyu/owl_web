// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV, NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 208,
    ...defaultSettings,
    rightRender: false,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  base: '/ui/',
  publicPath: isDev ? undefined : '/ui/',
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,

          name: 'login',
          component: './User/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/cluster',
      name: '集群列表',
      access: 'admin',
      icon: 'table',
      component: './cluster',
    },
    {
      path: '/task/add',
      name: '上线配置',
      icon: 'rise',
      component: './TaskAdd',
    },
    {
      path: '/task/review',
      name: '任务审核',
      icon: 'diff',
      component: './TaskReview/list',
    },
    {
      path: '/task/list',
      name: '执行列表',
      icon: 'bars',
      component: './TaskExec/list',
    },
    {
      name: '执行页',
      path: '/task/detail/:id',
      component: './TaskExec/detail',
      hideInMenu: true,
    },
    {
      name: '检测结果页',
      path: '/task/review/detail/:id',
      component: './TaskReview/detail',
      hideInMenu: true,
    },
    {
      path: '/task/history',
      name: '任务历史',
      icon: 'menu',
      component: './TaskHistory',
    },
    {
      path: '/rules/list',
      name: '规则列表',
      icon: 'fontSize',
      component: './rules/list',
    },
    {
      name: 'exception',
      icon: 'warning',
      path: '/exception',
      hideInMenu: true,
      routes: [
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      path: '/authority',
      name: '权限管理',
      access: 'admin',
      icon: 'user',
      component: './authority',
    },
    {
      path: '/',
      redirect: '/cluster',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     // 或者使用在线的版本
  //     // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
  //     schemaPath: join(__dirname, 'oneapi.json'),
  //     mock: false,
  //   },
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
  //     projectName: 'swagger',
  //   },
  // ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
