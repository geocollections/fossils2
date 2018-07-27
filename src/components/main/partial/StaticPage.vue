<template>

  <div id='content'>
    <h3>{{$t('header.zero')}}</h3>
    <div id="article" v-translate="{ et: content.content_et, en: content.content_en }"></div>
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
        content : '',
        lang_ : ''
      }
    },
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
          this.getRequest(this.apiUrl+'/webpages/'+this.$route.params.id).then((response) => {
            this.content = response[0];
          });
        },
    },

  }
</script>
