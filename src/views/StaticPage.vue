<template>
  <div id='content' v-if="content">
    <h3>{{$t('header.zero')}}</h3>
    <!--<div id="article" v-translate="{ et: content.content_et, en: content.content_en }"></div>-->
    <div id="article">
      <span v-if="$store.state.lang === 'et'" v-html="content.content_et"></span>
      <span v-else v-html="content.content_en"></span>
    </div>

  </div>
</template>

<script>

export default {
  name: 'static-page',
   computed: {
       content : function() {
           if (this.$store.state.page[this.$route.params.id].length > 0)
            return this.$store.state.page[this.$route.params.id][0]
       },

       meta () {
           return [this.content.menu_title_et, this.content.title_et].join(", ")
       }
  },

  asyncData ({ store, route : {params: { id }}}) {
     return store.dispatch('FETCH_PAGE', { id })
  },

  metaInfo () {
    return {
        title : this.content.menu_title_et,
        meta:  [{ vmid: 'keywords', name: 'keywords', content: this.meta}]
    }
  }

}


</script>
