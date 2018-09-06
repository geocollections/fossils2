import Vue from 'vue'

export default {
  SET_PAGE: (state, { id, page }) => {
    Vue.set(state.page, id, page.results || false) /* false means page not found */
  },

  SET_FRONT_PAGE: (state, { lang, page }) => {
    Vue.set(state.frontPage, lang, page.results || false) /* false means user not found */
  },

  SET_RANK: (state, { rank }) => {
    Vue.set(state.lists, 'ranks', rank.results || false)
  },
}
