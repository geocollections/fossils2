// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource' // VueResource for HTTP requests
import VueSession from 'vue-session' // VueSession for using session storage
import VueLocalStorage from 'vue-localstorage' // VueLocalStorage for using local storage
import BootstrapVue from 'bootstrap-vue' // Bootstrap
import VueIziToast from 'vue-izitoast' // Pop-up messages
import VueI18n from 'vue-i18n' // Translations
import VueMoment from 'vue-moment'
import VueCookie from 'vue-cookie'

// Bootstrap styles
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'izitoast/dist/css/iziToast.min.css' // Pop-up messages style
import 'flag-icon-css/css/flag-icon.min.css' // Flag icons
import 'vue-multiselect/dist/vue-multiselect.min.css' // Select input
// Custom styles
import '@/assets/css/styles.css'

// Autocomplete style
import 'vue2-autocomplete-js/dist/style/vue2-autocomplete.css'

Vue.use(VueResource)
Vue.use(VueSession)
Vue.use(VueLocalStorage)
Vue.use(BootstrapVue)
Vue.use(VueIziToast)
Vue.use(VueI18n)
Vue.use(VueMoment)
Vue.use(VueCookie)

Vue.config.productionTip = false



/******************************
 *** TRANSLATION CODE START ***
 ******************************/

// Gets translations from json files
const messages = {
  en: require('@/assets/locales/en.json'),
  ee: require('@/assets/locales/ee.json'),
  se: require('@/assets/locales/se.json'),
  fi: require('@/assets/locales/fi.json'),
};

// Gets preferred language from localStorage (fallback is ee)
const lang = Vue.localStorage.get('fossilsLang', 'ee')

// Translation settings
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: 'en',
  messages
})
/******************************
 ***  TRANSLATION CODE END  ***
 ******************************/



/****************************
 *** CUSTOM FILTERS START ***
 ****************************/

// TODO: Add filters here

/****************************
 ***  CUSTOM FILTERS END  ***
 ****************************/
// This adds session id and csrf to request | MUST BE BEFORE new Vue()
Vue.http.interceptors.push((request, next) => {
  let csrftoken = Vue.cookie.get('csrftoken')

  request.credentials = false;
  request.headers.set('X-CSRFTOKEN', csrftoken)
  next();
});

Vue.mixin({
  created: function () {
    let myOption = this.$options.myOption;
    let conf = this.$options.conf;
    if (conf) {
      console.log(conf)
    }
  }
});
Vue.directive('translate',{
  componentUpdated: function (el, binding) {
    el.innerHTML = Vue.localStorage.get('fossilsLang') === 'ee' ? binding.value.et : binding.value.en
  }
});
 let loopItems = function (item) {
   return "<div class=\'fossilgroup_box\'>"+
     "<a href=\'/#/"+ item.taxon+"\' :title=\"\"+item.frontpage+\" ("+item.taxon__taxon+")\" >" +
     "<img src=\"/static/fossilgroups/"+item.taxon+".png\" alt=\"/"+item.frontpage+" ("+item.taxon__taxon+")\" border=\"0\" ><h2>" + item.frontpage + "</h2></a></div>"

 };
// Vue.
Vue.directive('renderFrontPage',{
  componentUpdated: function (el, binding) {
    el.innerHTML = ''
    let content = Vue.localStorage.get('fossilsLang') === 'ee' ? binding.value.et : binding.value.en;
    for (var i = 0; i < content.length; i++) {
      el.innerHTML += loopItems(content[i])
    }
  }
});
    /* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  localStorage: {
    fossilsLang: {
      type: String,
      default: 'ee'
    },
  },

  components: { App},
  template: '<App/>',
  methods: {
    globalMethod: function () {
      return 'GlobalMethod'
    }
  },

});
