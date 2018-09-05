import {
  fetchStaticPage,
  fetchFrontPage
} from '../api'

export default {

  FETCH_PAGE: ({ commit, state }, { id }) => {
    return state.page[id]
      ? Promise.resolve(state.page[id])
      : fetchStaticPage(id).then(page => commit('SET_PAGE', { id, page }))
  },
  FETCH_FRONT_PAGE: ({ commit, state }, { lang }) => {
      return state.frontPage[lang]
          ? Promise.resolve(state.frontPage[lang])
          : fetchFrontPage(lang).then(page => commit('SET_FRONT_PAGE', { lang, page }))
      // fetchStaticPage(id).then(page => commit('SET_PAGE', { id, page }))
  }
}
