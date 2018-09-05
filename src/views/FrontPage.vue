<template>
  <div id='content'>
    <h3>{{$t('header.zero')}}</h3>
    <div id='fossilgroups_box'>
      <div class='fossilgroup_box'  v-for="item in content">
        <router-link v-bind:to="'/'+item.taxon" :title="item.taxon__taxon" >
          <img :src="'/public/fossilgroups/'+item.taxon+'.png'" :alt="item.frontpage+' ('+item.taxon__taxon+')'" border="0" ><h2>{{item.frontpage}}</h2></router-link></div>"
    </div>

  </div>
</template>

<script>
export default {
  name: 'front-page',
  computed: {
    content : function() {
        return this.$store.state.lang === 'et' ? this.$store.state.frontPage.et : this.$store.state.frontPage.en
    }
  },
  watch: {
    '$store.state.lang': {
      handler: function(newVal,oldVal) {
        let lang = this.$store.state.lang;
        this.$store.dispatch('FETCH_PAGE', { lang })
      }
    }
  },
  asyncData ({ store}) {
    let lang = store.state.lang
    return store.dispatch('FETCH_PAGE', { lang })
  },

  title () {
    return ''
  }
}
</script>
