<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-1"></div>
            <div class="col-lg-10">
                <div id='fossilgroups_box'>
                    <div class='fossilgroup_box'  v-for="item in content">
                        <router-link v-bind:to="'/'+item.taxon" :title="item.taxon__taxon" >
                            <img :src="'/static/fossilgroups/'+item.taxon+'.png'" :alt="item.frontpage+' ('+item.taxon__taxon+')'" border="0" ><h2>{{item.frontpage}}</h2></router-link></div>
                </div>
            </div>

            <div class="col-lg-1"></div>
        </div>

      <!--<div fluid class="p-3 figcaption" v-if="content">-->
          <!--<b-row class="p-2">-->
            <!--<b-col v-for="j in 6">-->
              <!--<router-link v-bind:to="'/'+content[j+6-1].taxon" >-->
                <!--<b-img thumbnail fluid :src="'/static/fossilgroups/'+content[j-1].taxon+'.png'" alt="Thumbnail" />-->
                <!--<span class="caption>">{{content[j-1].frontpage}}</span>-->
              <!--</router-link>-->
            <!--</b-col>-->
          <!--</b-row>-->
          <!--<b-row class="p-2">-->
            <!--<b-col v-for="j in 6">-->
              <!--<router-link v-bind:to="'/'+content[j+6-1].taxon" >-->
                <!--<b-img thumbnail fluid :src="'/static/fossilgroups/'+content[j+6-1].taxon+'.png'" alt="Thumbnail" />-->
                <!--<span class="caption>">{{content[j+6-1].frontpage}}</span>-->
              <!--</router-link>-->
            <!--</b-col>-->
          <!--</b-row>-->
          <!--<b-row class="p-2">-->
            <!--<b-col v-for="j in 6">-->
              <!--<router-link v-bind:to="'/'+content[j+12-1].taxon" >-->
                <!--<b-img thumbnail fluid :src="'/static/fossilgroups/'+content[j+12-1].taxon+'.png'" alt="Thumbnail" />-->
                <!--<span class="caption>">{{content[j+12-1].frontpage}}</span>-->
              <!--</router-link>-->
            <!--</b-col>-->
          <!--</b-row>-->
          <!--<b-row class="p-2">-->
            <!--<b-col v-for="j in 5">-->
              <!--<router-link v-bind:to="'/'+content[j+18-1].taxon" >-->
                <!--<b-img thumbnail fluid :src="'/static/fossilgroups/'+content[j+18-1].taxon+'.png'" alt="Thumbnail" />-->
                <!--<span class="caption>">{{content[j+18-1].frontpage}}</span>-->
              <!--</router-link>-->
            <!--</b-col>-->
          <!--</b-row>-->

      <!--</div>-->
    </div>
  <!--<section id='content'  class="container">-->
    <!--<h3>{{$t('header.zero')}}</h3>-->
      <!--<div  v-bind:class="isRowCreated(index)? 'row' : ''" v-for="(item, index) in content">-->
      <!--<div class="col-xs-6 col-md-3">-->
        <!--<router-link class="thumbnail" v-bind:to="'/'+item.taxon" :title="item.taxon__taxon" >-->
          <!--<img :src="'/static/fossilgroups/'+item.taxon+'.png'" :alt="item.frontpage+' ('+item.taxon__taxon+')'" border="0" ><h2>{{item.frontpage}}</h2></router-link>-->
      <!--</div>-->
      <!--</div>-->
  <!--</section>-->
</template>

<script>
export default {
  name: 'front-page',
  computed: {
    content : function() {
        return this.$store.state.lang === 'et' ? this.$store.state.frontPage.et : this.$store.state.frontPage.en
    }
  },
  methods: {
      isRowCreated: function (index) {
          return [3,7, 11, 15].includes(parseInt(index))
      }
  },
  watch: {
    '$store.state.lang': {
      handler: function(newVal,oldVal) {
        let lang = this.$store.state.lang;
        this.$store.dispatch('FETCH_FRONT_PAGE', { lang })
      }
    }
  },
  asyncData ({ store}) {
    let lang = store.state.lang
    return store.dispatch('FETCH_FRONT_PAGE', { lang })
  }
}
</script>
<style scoped>

</style>