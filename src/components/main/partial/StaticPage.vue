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
        raw_html : '',
        content : ''
      }
    },
    watch: {
      '$route.params.id': {
          handler: function(newVal,oldVal) {
            this.loadStaticContent()
            this.applyTranslation()
          }
      },
      '$fossilsLang': {
        handler: function(val, oldVal) {
          console.log("TWTW") // call it in the context of your component object
        },
        deep: true
      }
    },
    created: function () {
      this.loadStaticContent()
    },
    updated: function () {
      this.loadStaticContent()
    },
    methods:  {
        loadStaticContent: function() {
          this.getRequest(this.apiUrl+'/webpages/'+this.$route.params.id).then((response) => {
            this.content = response[0];
            this.applyTranslation()
          });
        },
        applyTranslation: function() {
          this.raw_html = this.$localStorage.get('fossilsLang') === 'ee' ? this.content.content_et : this.content.content_en
        }
    },

  }
</script>
