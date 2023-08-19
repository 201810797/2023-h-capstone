import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/IndexLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/signup/',
    component: () => import('layouts/SignUp.vue'),
    children: [
      {
        path: 'normal',
        component: () => import('pages/signup/NormalSignUp.vue'),
      }
    ],
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },
  {
    path: '/info',
    component: () => import('layouts/InfopageLayout.vue'),
    children: [
      { path: 'my', component: () => import('pages/info/MyInfoPage.vue') },
      {
        path: 'friend',
        component: () => import('pages/info/FriendInfoPage.vue'),
      },
      {
        path: 'setting',
        component: () => import('pages/info/InfoSettingPage.vue'),
      },
      {
        path: 'favorite',
        component: () => import('pages/info/MyFavorite.vue'),
      },
      { path: 'theme', component: () => import('pages/info/MyTheme.vue') },
      {
        path: 'mymap',
        component: () => import('pages/info/MyMap.vue'),
      },
    ],
  },
  {
    path: '/article',
    component: () => import('layouts/ArticleLayout.vue'),
    children: [
      {
        path: 'theme',
        component: () => import('pages/article/ThemesPage.vue'),
      },
      { path: 'write', component: () => import('pages/article/WritePage.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
