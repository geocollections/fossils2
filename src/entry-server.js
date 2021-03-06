import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'


// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()
    if(context.cookies.fossils_lang && context.cookies.fossils_lang != null)
        store.state.lang = context.cookies.fossils_lang
    if(context.cookies.fossils_mode && context.cookies.fossils_mode != null)
          store.state.mode = context.cookies.fossils_mode
    // store.state.route.query = { mode: store.state.mode, lang : store.state.lang}
    const meta = app.$meta()
    context.meta = meta
    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }
    // set router's location
    router.push(url)

    // wait until router has resolved possible async hooks
    router.onReady(() => {

      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      let process = 'server';
      store.commit('SET_PROCESS', {process})
        function fetchTaxon(app,store,router,context,id,matchedComponents,reject){
            Promise.all([
                store.dispatch('FETCH_TAXON', { id })
            ]).then(() => {
                if(!store.state.activeItem.taxon) {
                    //IF taxon do not exist show error page
                    resolve(app)
                } else {
                    // Call fetchData hooks on components matched by the route.
                    // A preFetch hook dispatches a store action and returns a Promise,
                    // which is resolved when the action is complete and store state has been
                    // updated.
                    Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
                        store,
                        route: router.currentRoute
                    }))).then(() => {
                        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
                        // After all preFetch hooks are resolved, our store is now
                        // filled with the state needed to render the app.
                        // Expose the state on the render context, and let the request handler
                        // inline the state in the HTML response. This allows the client-side
                        // store to pick-up the server-side state without having to duplicate
                        // the initial data fetching on the client.
                        context.state = store.state
                        resolve(app)
                    }).catch(reject)
                }
            }).catch(reject)
        }
      let id = router.currentRoute.params.id;
      if (router.currentRoute.name === 'ItemPage') {
          if(isNaN(id)) {
              Promise.all([store.dispatch('FETCH_TAXON_BY_NAME', { id }) ]).then(() => {
                  if(!store.state.activeItem.taxon) {
                      //IF taxon do not exist show error page
                      resolve(app)
                  } else {
                      id = store.state.activeItem.taxon.id
                      fetchTaxon(app,store,router,context,id,matchedComponents,reject)
                  }
              }).catch(reject)
          } else {
              fetchTaxon(app,store,router,context,id,matchedComponents,reject)
          }


      } else {
          Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
              store,
              route: router.currentRoute
          }))).then(() => {
              isDev && console.log(`data pre-fetch2: ${Date.now() - s}ms`)
              // After all preFetch hooks are resolved, our store is now
              // filled with the state needed to render the app.
              // Expose the state on the render context, and let the request handler
              // inline the state in the HTML response. This allows the client-side
              // store to pick-up the server-side state without having to duplicate
              // the initial data fetching on the client.
              context.state = store.state
              resolve(app)
          }).catch(reject)
      }


    }, reject)
  })
}
