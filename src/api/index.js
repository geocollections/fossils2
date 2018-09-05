import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);
const logRequests = !!process.env.DEBUG_API;

const api = {
  url: 'https://api.geocollections.info/'
};

function fetch (child) {
  logRequests && console.log(`fetching ${child}...`);
    return new Promise((resolve, reject) => {
        Vue.http.get(api.url+child, {}).then(response => {
            resolve(response.body)
            console.log(response)
        }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
            reject(errResponse)
        });
    });
}

export function fetchStaticPage (id) {
  return fetch(`webpages/${id}`)
}

export function fetchFrontPage (lang) {
    return fetch(`/taxon_page/?language=${lang}&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon`)
}