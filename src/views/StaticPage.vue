<template>
  <div id='content' v-if="content">
    <h3>{{$t('header.zero')}}</h3>
    <div id="article" v-translate="{ et: content.content_et, en: content.content_en }"></div>
  </div>
</template>

<script>
import {
    fetchStaticPage
} from '../api'
export default {
  name: 'static-page',

  data() {
      return {
          content : ''
      }
  },

  // asyncData ({ store, route: { params: { id }}}) {
  //     return store.dispatch('FETCH_PAGE', { id })
  // },

  watch: {
      '$route.params.id': {
          handler: function(newVal,oldVal) {
              this.loadStaticContent()
          }
      }
  },
  created: function () {
      this.loadStaticContent();
  },
  methods:  {
      loadStaticContent: function() {
          fetchStaticPage(this.$route.params.id).then((response) => {
              this.content = response.results[0];
          });
      },
  },

  title () {
    console.log(this.content)
    return this.content
      ? this.content.id
      : 'User not found'
  }
}
</script>
