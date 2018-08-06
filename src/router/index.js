import Vue from 'vue';
import Router from 'vue-router';
import Map from '@/views/Map';
import NotFound from '@/views/NotFound';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Map',
      component: Map,
    },
    {
      path: '*',
      name: '404',
      component: NotFound,
    },
  ],
});
