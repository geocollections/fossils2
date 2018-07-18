import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import AppContent from '@/components/main/AppContent'
import StaticPage from '@/components/main/partial/StaticPage'
import FrontPage from '@/components/main/partial/FrontPage'
import SearchResultsPage from '@/components/main/partial/SearchResultsPage'
import ItemPage from '@/components/main/partial/ItemPage'

Vue.use(Router);
Vue.use(Meta);

const router = new Router({
  //mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      component: AppContent,
      children: [
        {
          path: '',
          component: FrontPage
        },
        {
          path: '/:id',
          component: ItemPage
        },
        {
          path: '/page/:id',
          component: StaticPage
        },
        {
          path: '/search/detail',
          component: SearchResultsPage
        }
      ]
    },

  ]
});

export default router
