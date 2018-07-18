<script src="../../../main.js"></script>
<template>
  <div id="content">
    <div id="taxon-box">
      <div id="taxon-header">
        <!--<div id="fossilgroup-icon">-->
          <!--<router-link v-bind:to="'/'+content.fossil_group.id" v-if="'fossil_group' in content">-->
            <!--<img border="0" :src="'/static/fossilgroups/'+content.fossil_group.id+'.png'" :alt="content.fossil_group.name"-->
                 <!--:title="content.fossil_group.name" style="height: 80px; margin-top: 0px; padding-right: 0px;" />-->
            <!--<br />content.fossil_group.name</router-link>-->
          <!--<router-link v-bind:to="'/'+content.id" v-else-if="content.is_fossil_group = 1">-->
            <!--<img border="0" :src="'/static/fossilgroups/'+ content.id+'.png'" :alt="content.taxon"-->
                 <!--:title="content.taxon" style="height: 95px; margin-top: 0; padding-right: 0px;" /></router-link>-->
        <!--</div>-->
        <div id="taxon-title">

        </div>

        <!--<div id="taxon-title">-->
          <!--<h1 style='color: #333;'>-->
            <!--<span style="color:#333; font-weight:bold" v-if="content.class && content.class != content.taxon">{{content.class}}</span><br />-->
            <!--<div style="font-size: 0.7em;" v-else-if="'fossil_group' in content">-->
              <!--&lt;!&ndash;{{strings_fossils.f_fossil_group|default_if_none:"Fossil group"}}:&ndash;&gt;-->
              <!--<router-link v-bind:to="'/'+content.fossil_group.id">{{content.fossil_group.name}}</router-link>-->
            <!--</div>-->

            <!--<span style="font-size: 0.7em;">{{content.rank}}</span>-->
            <!--<em v-if="content.rank_id in content.rank_list">{{content.taxon}}</em>-->
            <!--<span v-if="!(content.rank_id in content.rank_list)">{{content.taxon}}</span>-->
            <!--<span style="font-size: 0.7em;">{{content.author_year}}</span>-->
          <!--</h1>-->

          <!--<div class="taxon_names" v-if="content.taxon_names" v-for="item in content.taxon_names">-->
            <!--<strong>{{item.language}}</strong>: {{item.name}};-->
          <!--</div>-->
        <!--</div>-->


      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {

    },
    name: 'item-page',
    data() {
      return {
        content : ''
      }
    },

    methods:  {

    },
    created: function (){
      this.$http.get('http://127.0.0.1:8001/taxon/'+this.$route.params.id).then(response => {
        if (response.status === 200) {
          this.content = response.body.results[0]
          this.id = response.body.results[0].id
          console.log(this.content)
        }
      }, errResponse => {
        console.log('ERROR: ' + JSON.stringify(errResponse));
      })
    }
  }
</script>
