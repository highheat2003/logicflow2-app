import { createRouter, createWebHistory } from 'vue-router';
import Demo1 from '@/views/demo1/Demo1.vue';
import Demo2 from '@/views/demo2/Demo2.vue';
import Demo3 from '@/views/demo3/Demo3.vue';
import Demo4 from '@/views/demo4/Demo4.vue';
import Mvp1 from '@/views/mvp1/Mvp1.vue';
import Mvp2 from '@/views/mvp2/Mvp2.vue';
import LF2 from '@/views/vue_demo2/components/LF.vue';
import TurboAdapter2 from '@/views/vue_demo2/components/TurboAdapter.vue';

const routes = [
  { path: '/', redirect: '/demo1' },
  { path: '/demo1', component: Demo1 },
  { path: '/demo2', component: Demo2 },
  { path: '/demo3', component: Demo3 },
  { path: '/demo4', component: Demo4 },
  { path: '/mvp1', component: Mvp1 },
  { path: '/mvp2', component: Mvp2 },
  { path: '/LF2', component: LF2 },
  { path: '/TurboAdapter2', component: TurboAdapter2 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
