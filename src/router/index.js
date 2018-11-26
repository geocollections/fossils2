import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta,{ssrAttribute: 'data-vue-meta-server-rendered'})

const StaticPage = () => import('../views/StaticPage.vue')
const FrontPage = () => import('../views/FrontPage.vue')
const ItemPage = () => import('../views/ItemPage.vue')
const AdvancesSearch = () => import('../views/AdvancedSearch.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/:id(\\d+)',name: 'ItemPage', component: ItemPage , meta: { isSpecies: false} },
      { path: '/page/:id', component: StaticPage },
        { path: '/search', component: AdvancesSearch },
      { path: '/', component: FrontPage },
      { path: '*', redirect: '/' },
    ]
  })
}
