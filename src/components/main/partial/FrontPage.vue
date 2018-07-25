<template>

  <div id='content'>
    <div id='fossilgroups_box'>
      <div class='fossilgroup_box' v-for="item in content">
        <router-link v-bind:to="'/'+ item.taxon" :title="item.title+' ('+ item.taxon__taxon+')'">
          <img :src="'/static/fossilgroups/'+item.taxon+'.png'" :alt="'/' + item.frontpage +' ('+ item.taxon__taxon+')'"
               border='0' />
          <h2>{{item.frontpage}}</h2>
        </router-link>
      </div>
    </div>
  </div>

</template>


<script>
  import MyMixin from '../../../mixins/mixin';
  import LangButtons from '@/components/main/partial/LangButtons';
  export default {
    components: { LangButtons},
    mixins: [MyMixin],
    name: "app-content",
    data() {
        return {
          content : ''
        }
    },

    created: function () {
      let lang =this.$localStorage.get('fossilsLang')
      if(this.$localStorage.get('fossilsLang') === 'ee'){
        lang = 'et'
      }
      this.loadFrontPage(lang)
    },
    mounted: function () {
      console.log('mounted')
    },
    updated: function () {
      console.log('updated')
    },
    watch: {
      lang: {
        handler: function(val, oldVal) {
          console.log('w')
          this.loadFrontPage(val) // call it in the context of your component object
        },
        deep: true
      }
    },
    methods:  {
      loadFrontPage: function(lang) {
        this.getRequest(this.apiUrl+'/taxon_page/?language='+lang+'&fields=frontpage,taxon,taxon__taxon').then((response) => {
          this.content = response;
        });
      }
    },
  }
</script>
