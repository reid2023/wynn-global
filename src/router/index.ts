import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/Home.vue'),
    meta: {
      title: 'home',
    },
  },
  // {
  //   path: '/discount',
  //   name: 'Discount',
  //   component: () => import('../views/discount/Discount.vue'),
  //   meta: {
  //     title: 'discount',
  //   },
  // },
  // {
  //   path: '/service',
  //   name: 'Service',
  //   component: () => import('../views/service/Service.vue'),
  //   meta: {
  //     title: 'service',
  //   },
  // },
  // {
  //   path: '/support',
  //   name: 'Support',
  //   component: () => import('../views/support/Support.vue'),
  //   meta: {
  //     title: 'support',
  //   },
  // },
  // {
  //   path: '/mine',
  //   name: 'Mine',
  //   component: () => import('../views/mine/Mine.vue'),
  //   meta: {
  //     title: 'mine',
  //   },
  // },
  // {
  //   path: '/svg-preivew',
  //   name: 'SvgPreview',
  //   component: () => import('../views/svg-preview/SvgPreview.vue'),
  //   meta: {
  //     title: 'SVG图标库',
  //   },
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: 'notFound',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由守卫 - 设置页面标题和处理活动参数
router.beforeEach((_to, _from, next) => {
  const title = _to.meta.title;
  const isChangeTitle = false;
  if (title && isChangeTitle) {
    document.title = `Wynn Global - ${title}`;
  }

  const query = { ...(_to.query as Record<string, any>) };
  let needsUpdate = false;

  if (needsUpdate) {
    next({ ..._to, query });
  } else {
    next();
  }
});

export default router;
