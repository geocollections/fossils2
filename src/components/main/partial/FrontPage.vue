<template>

  <div id='content'>
    <div id='fossilgroups_box'>
      <div class='fossilgroup_box' v-for="item in content">
        <router-link v-bind:to="'/'+ item.id" :title="item.title+' ('+ item.taxon__taxon+')'">
          <img :src="'/static/fossilgroups/'+item.id+'.png'" :alt="'/' + item.title +' ('+ item.taxon__taxon+')'"
               border='0' />
          <h2>{{item.frontpage}}</h2>
        </router-link>
        <!--<router-link v-bind:to="'/'+ item.node_id" :title="item.title+' ('+ item.taxon+')'">-->
        <!--<img :src="'/static/fossilgroups/'+item.node_id+'.png'" :alt="'/' + item.title +' ('+ item.taxon+')'"-->
               <!--border='0' />-->
          <!--<h2>{{item.name}}</h2>-->
        <!--</router-link>-->
      </div>
    </div>
  </div>

</template>


<script>

  export default {
    name: "app-content",
    data() {
        return {
            content : ''
        }
    },
    methods: {

    },
    created: function () {
      let class_ids=[36, 39, 47, 46, 56, 55, 57, 63, 64, 49, 51, 260, 53, 93, 95, 99, 273, 105, 97, 62, 34, 32, 317, 112]

      let lang =this.$localStorage.get('fossilsLang')
      if(this.$localStorage.get('fossilsLang') === 'ee'){
          lang = 'et'
      }
      this.$http.get('http://127.0.0.1:8001/taxon_page/?language='+lang).then(response => {
        if (response.status === 200) {
          this.content = response.body.results
        }
      }, errResponse => {
        console.log('ERROR: ' + JSON.stringify(errResponse));
      })

    }
  }
</script>
