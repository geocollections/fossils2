<template>

  <div id='content'>
    <div id="article" v-html="raw_html"></div>
  </div>

</template>

<script>


  export default {
    components: {

    },
    name: 'static-page',
    data() {
      return {
        apiUrl: 'http://localhost:8000/',
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
          console.log(this.$config)
          this.$http.get('http://127.0.0.1:8001/webpages/'+this.$route.params.id,
            {
              emulateJSON: true
            }
          ).then(response => {
            if (response.status === 200) {
              this.raw_html = response.body.results[0].content_et
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
          })
        }
    },
    created: function (){
        console.log('Static page')
      this.loadStaticContent()
    }
  }
</script>
