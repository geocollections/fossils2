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
//todo: remove
export function fetchIdsByType (type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetch(`${type}stories`)
}
//todo: remove
export function fetchItem (id) {
  return fetch(`item/${id}`)
}
//todo: remove
export function fetchItems (ids) {
  return Promise.all(ids.map(id => fetchItem(id)))
}

export function fetchStaticPage (id) {
  return fetch(`webpages/${id}`)
}

export function fetchFrontPage (lang) {
    return fetch(`/taxon_page/?language=${lang}&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon`)
}

//todo: remove
export function watchList (type, cb) {
  let first = true
  const ref = api.child(`${type}stories`)
  const handler = snapshot => {
    if (first) {
      first = false
    } else {
      cb(snapshot.val())
    }
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}
