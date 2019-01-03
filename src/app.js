import Vue from 'vue'
import App from './App.vue'
// import VueIziToast from 'vue-izitoast'
import AsyncComputed from 'vue-async-computed'
import VueMoment from 'vue-moment'
// import VueLocalStorage from 'vue-localstorage' // VueLocalStorage for using local storage
import BootstrapVue from 'bootstrap-vue' // Bootstrap
import VueI18n from 'vue-i18n'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import titleMixin from './util/title'
import metaMixin from './util/meta'
import * as filters from './util/filters'
import * as directives from './util/customeDirectives'
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
// mixin for handling title
Vue.mixin(titleMixin)
Vue.mixin(metaMixin)
// Pop-up messages
// Vue.use(VueIziToast)
Vue.use(AsyncComputed)
Vue.use(VueMoment)
// Vue.use(VueLocalStorage)
Vue.use(BootstrapVue)
// Translations
Vue.use(VueI18n)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
  const store = createStore();
  const router = createRouter();

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router);


    /******************************
     *** TRANSLATION CODE START ***
     ******************************/

// Gets translations from json files
    const messages = {
        en: require('./assets/locales/en.json'),
        ee: require('./assets/locales/et.json'),
        se: require('./assets/locales/se.json'),
        fi: require('./assets/locales/fi.json'),
    };

// Translation settings
    const i18n = new VueI18n({
        locale: store.state.lang === 'et' ? 'ee' : store.state.lang,
        fallbackLocale: 'en',
        messages
    })
    /******************************
     ***  TRANSLATION CODE END  ***
     ******************************/

    // redirect to default path if taxon_id = 29 requested
    router.beforeEach((to, from, next) => {
        if(to.path === '/29') {
            next({path:'/'})
        } else {
            next()
        }
        // let query = {mode: store.state.mode , lang : store.state.lang}
        // next({query: store.state.route.query, replace: true });
    });
    // register global directives filters.
    Object.keys(directives).forEach(key => {
        Vue.directive(key, directives[key])
    })

    Vue.directive('translate', function (el, binding) {
        let value = store.state.lang === 'et' ? binding.value.et : binding.value.en
        el.innerHTML = value === undefined || value === null ? '' : value
    });

    Vue.directive('show-image',{
        componentUpdated: function (el, binding) {
            let currentInnerHtml = el.innerHTML
            currentInnerHtml +=
                "   <div style=\"display:block;cursor:pointer;position:absolute;top:0;right:0;\" :id=\"1+'-'\" v-show=\"mouseOverImage === 'taxon_image_'+1\" \n" +
                "               onclick=\"$(this).siblings('a').attr('href','http://geokogud.info/git/di.php?f=specimen_image/315/315-45.jpg&w=1280'); $(this).siblings('a').trigger('dblclick'); $(this).siblings('a').attr('href','/1091')\">\n" +
                "\n" +
                "          <img src=\"/static/imgs/zoom_in.png\" style=\"width: 32px;height: 32px;padding:2px 2px 0 0;\" />\n" +
                "          </div>"
            el.innerHTML = currentInnerHtml
        }
    });

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
