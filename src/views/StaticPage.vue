<template>
  <section class="container-fluid mt-2">
    <div class="card" v-if="content">
      <span class="card-body" v-html="currentContent"></span>
    </div>
  </section>
</template>

<script>

export default {
  name: 'static-page',
   computed: {
       content : function() {
           if (this.$store.state.page[this.$route.params.id].length > 0)
            return this.$store.state.page[this.$route.params.id][0]
       },
       currentContent () {
           return this.$store.state.lang === 'et'
               ? this.content.content_et
               : this.content.content_en
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
