<template>
  <div id="content">
  <div id="taxon-box">
    <h1 style="text-align: center; border-bottom: solid 0px #ccc; font-weight: bold;">Otsingu tulemused</h1>
    <table style="text-align:left; " align="center" border="0" v-for="group in search_content">
      <tr>
        <td><img :src="'/static/fossilgroups/'+group[0][0].gr_id+'.png'" style="width: 80px;" /><!--{{forloop.counter}}--></td>

        <td class="searchresults-group">
          <h1>
            <router-link v-bind:to="'/'+ group[0][0].gr_id" :title="group[0][0].gr_name+''">{{group[0][0].gr_name}} ({{group[0][0].gr_name_local}})</router-link>
          </h1>
        </td>
        <td></td>
      </tr>

      <table style="text-align:left; " align="center" border="0"  v-for="family in group">
        <tr>
          <td><!--{{forloop.counter}}{{family.0.gen_no}}--></td>
          <td class="searchresults-genus"><em><router-link v-bind:to="'/'+family[0].fid">{{family[0].ftaxon}}</router-link></em> {{family[0].fauthor_year}}</td>
          <td>{{family[0].stratigraphy}}</td>
        </tr>
        <tr v-for="item in family ">
          <td><!--{{forloop.counter}}--></td>
          <td class="searchresults-species"><em><router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link></em> {{item.author_year}}</td>
          <td style="padding-left: 10px;">
            <span v-if="item.sp_fad == item.sp_lad">{{item.sp_fad}}</span>
            <span v-else="item.sp_fad">{{item.sp_fad}} - {{item.sp_lad}}</span>
          </td>
        </tr>

        <!-- species list if present -->
      </table>

    </table>

    <h1 style="text-align: center; border-bottom: solid 0px #ccc; font-weight: bold;" >Vasteid ei leitud</h1>
    <div id="noresults-box" v-if="search_content.length == 0">
      <p><strong>Võimalikud põhjused:</strong></p>
      <li>Sisestasite märksõna(d), millele vasted puuduvad.</li>
      <li>Vastavad fossiilid on küll olemas, kuid infot nende kohta ei ole veel andmebaasi kantud.</li>
      <li>Otsingukriteeriumid on vastuolulised (näit otsite Devoni ajastu fossiile Saaremaa leiukohtadest)</li>
    </div>

  </div>
  </div>
</template>


<script>

  export default {
    name: "search-results-page",

    components:  {
    },
    data (){
      return {
        search_content: '',
      }
    },
    created:function(){
        console.log('results')

    },
    methods: {}
  }

</script>
