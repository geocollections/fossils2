<template>
  <div id='content'>
    <h3>{{$t('header.zero')}}</h3>
    <div id='fossilgroups_box' v-render-front-page="{et:content_et, en:content_en}" ></div>
    <!--<div class='fossilgroup_box' v-for="item in content">-->
        <!--<router-link v-bind:to="'/'+ item.taxon" :title="item.title+' ('+ item.taxon__taxon+')'">-->
          <!--<img :src="'/static/fossilgroups/'+item.taxon+'.png'" :alt="'/' + item.frontpage +' ('+ item.taxon__taxon+')'"-->
               <!--border='0' />-->
          <!--<h2>{{item.frontpage}}</h2>-->
        <!--</router-link>-->
      <!--</div>-->
    <!--</div>-->
  </div>

</template>


<script>
  import MyMixin from '../../../mixins/mixin';
  export default {
    mixins: [MyMixin],
    name: 'front-page7',
    data() {
        return {
          content : '',
          content_et : '',
          content_en : ''
        }
    },

    created: function () {
      let lang =this.$localStorage.get('fossilsLang')
      if(lang === 'ee'){
        lang = 'et'
      }
      this.loadFrontPage(lang)
    },
    watch : {
      'isLangChanged' : {
        handler : function (newval, oldval) {
          console.log(newval)
        }
      }
    },
    methods:  {
      loadFrontPage: function(lang) {
        this.content = {}
        this.getRequest(this.apiUrl+'/taxon_page/?language=et&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon').then((response) => {
          this.content_et = response;
        });

        this.getRequest(this.apiUrl+'/taxon_page/?language=en&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon').then((response) => {
          this.content_en = response;
        });
      }
    },
  }
</script>
