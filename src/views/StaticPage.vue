<template>
  <div id='content' v-if="content">
    <h3>{{$t('header.zero')}}</h3>
    <div id="article" v-translate="{ et: content.content_et, en: content.content_en }"></div>
  </div>
</template>

<script>

export default {
  name: 'static-page',
  computed: {
      content : function() {
          return this.$store.state.page[this.$route.params.id][0]
      }
  },

  asyncData ({ store, route : {params: { id }}}) {
      return store.dispatch('FETCH_PAGE', { id })
  },

  title () {
    return this.content
      ? this.content.menu_title_et
      : ''
  }
}
</script>
