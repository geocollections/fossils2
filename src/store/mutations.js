import Vue from 'vue'

export default {
  SET_ACTIVE_TYPE: (state, { type }) => {
    state.activeType = type
  },

  SET_LIST: (state, { type, ids }) => {
    state.lists[type] = ids
  },

  SET_ITEMS: (state, { items }) => {
    items.forEach(item => {
      if (item) {
        Vue.set(state.items, item.id, item)
      }
    })
  },

  SET_PAGE: (state, { id, page }) => {
    Vue.set(state.page, id, page.results || false) /* false means page not found */
  },

  SET_FRONT_PAGE: (state, { lang, page }) => {
    Vue.set(state.frontPage, lang, page.results || false) /* false means user not found */
  }
}
