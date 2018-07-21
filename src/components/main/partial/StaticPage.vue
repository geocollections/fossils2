<template>

  <div id='content'>
    <div id="article" v-html="raw_html"></div>
  </div>

</template>

<script>
  import MyMixin from '../../../mixins/mixin';
  export default {
    mixins: [MyMixin],
    components: {

    },
    name: 'static-page',
    data() {
      return {
        raw_html : ''
      }
    },
    watch: {
      '$route.params.id': {
          handler: function(newVal,oldVal) {
            this.loadStaticContent()
          }
      }
    },
    methods:  {
        loadStaticContent: function() {
          this.getRequest(this.apiUrl+'/webpages/'+this.$route.params.id).then((response) => {
//            this.raw_html = this.$localStorage.get('lang') === 'ee' ? response.content_et : response.content_en
              this.raw_html = response[0].content_et
          });
        }
    },
    mounted: function (){
        this.loadStaticContent()

    }
  }
</script>
