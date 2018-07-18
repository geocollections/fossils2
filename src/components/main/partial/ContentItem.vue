<template>
  <div id="content">

  </div>
</template>


<script>
  export default {
    name: "content-item",
    data() {
      return {
        content : '',
        id : ''
      }
    },
    methods: {
      created: function () {
          console.log('Content item')
        this.$http.get('http://localhost:8000/?record_id='+this.$route.params.id).then(response => {
          if (response.status === 200) {
            this.content = response.body.content
            this.id = response.body.id
            console.log(this.content)
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },
    },


  }
</script>
