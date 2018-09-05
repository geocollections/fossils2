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
  computed: {
      content : function() {
          return this.$store.state.page[this.$route.params.id][0]
      }
  },
  watch: {
      // '$store.state.lang': {
      //     handler: function(newVal,oldVal) {
      //         let lang = this.$store.state.lang;
      //         this.$store.dispatch('FETCH_STATIC_PAGE', { lang })
      //     }
      // }
  },
  asyncData ({ store, route : {params: { id }}}) {
      return store.dispatch('FETCH_PAGE', { id })
  },
  // data() {
  //     return {
  //         content : ''
  //     }
  // },
  //
  // // asyncData ({ store, route: { params: { id }}}) {
  // //     return store.dispatch('FETCH_PAGE', { id })
  // // },
  //
  // watch: {
  //     '$route.params.id': {
  //         handler: function(newVal,oldVal) {
  //             this.loadStaticContent()
  //         }
  //     }
  // },
  // created: function () {
  //     this.loadStaticContent();
  // },
  // methods:  {
  //     loadStaticContent: function() {
  //         fetchStaticPage(this.$route.params.id).then((response) => {
  //             this.content = response.results[0];
  //         });
  //     },
  // },

  title () {
    return this.content
      ? this.content.menu_title_et
      : ''
  }
}
</script>
