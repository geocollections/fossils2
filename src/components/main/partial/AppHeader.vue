<template>
  <!-- header starts -->
  <div id="header">
    <div id="header-search-button" onclick="document.getElementById('header3').style.display='block'"></div>
    <div id="header-menu-button" onclick="document.getElementById('mobile-menu').style.display='block'"></div>
    <div id="mobile-menu" onclick="document.getElementById('mobile-menu').style.display='none'">
      <ul>
        <li><a href="/page/28">{{ $t('menu.fossils') }}</a></li>
        <li><a href="/page/29">{{ $t('menu.collecting ') }}</a></li>
        <li><a href="/page/30">{{ $t('menu.identifying ') }}</a></li>
        <li><a href="/page/31">{{ $t('menu.fossils_estonia ') }}</a></li>
        <li><a href="http://stratigraafia.info/index.php?page=4">{{ $t('menu.time ') }}</a></li>
        <li><a href="http://geokogud.info">{{ $t('menu.collections ') }}</a></li>
        <!--<li>{{ $t('menu.detail_search ') }}</li>-->
        <li>Sulge menüü</li>
      </ul>
    </div>

    <div id="header-box">

      <div id="lang-block-top">
        <lang-buttons lang-class="'header'"/>
      </div>
      <div id="header1">
        <!-- bd-logo -->
        <a href="http://balticdiversity.eu"><img id="bd-logo" src="/static/imgs/bd_logo0.png" border="0"/></a>
        <div id="slogan-block-top" style="text-transform: uppercase;">{{ $t('header.subtitle') }}</div>

      </div>

      <div id="header2">
        <h1><a href='/'>{{ $t('header.title') }}</a></h1>
      </div>

      <div id="header3">

        <div id="search_box" style="position:relative;">
          <autocomplete
            source="http://127.0.0.1:8001/taxon-search/?q="
            results-property="items"
            results-display="name"
            :placeholder="$t('search.fossils_search')"
            v-if="hideAdvancedSearch"
          >
          </autocomplete>
          <!--<input type='text' id="searchfield" v-model="searchField" :placeholder="$t('search.fossils_search')" v-if="hideAdvancedSearch"-->
                 <!--@input="searchTaxon"/>-->
          <div v-if="!hideAdvancedSearch">
            <!--id="search-custom"  -->
            <form v-on:submit.prevent name="detailed-search">
              <table align="center">
                <tr>
                  <td>{{ $t('search.hightaxon ') }}:</td>
                  <td>
                    <autocomplete
                      source="http://127.0.0.1:8001/taxon-detailed-search/?q="
                      results-property="items"
                      results-display="name"
                    >
                    </autocomplete>
                    <!--<input type="text" name="taxon" id="searchfield-taxon" autocomplete="off"/>-->
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('search.species ') }}:</td>
                  <td><input type="text" name="species" ref="species" v-model="searchParams.species"/></td>
                </tr>
                <tr>
                  <td>{{ $t('search.locality ') }}:</td>
                  <td><input type="text" name="locality" ref="locality" v-model="searchParams.locality"/></td>
                </tr>
                <tr>
                  <td>{{ $t('search.country ') }}:</td>
                  <td><input type="text" name="region" ref="region" v-model="searchParams.region"/></td>
                </tr>
                <tr>
                  <td>{{ $t('search.stratigraphy ') }}:</td>
                  <td><input type="text" name="stratigraphy" id="searchfield-stratigraphy"
                             autocomplete="off" ref="stratigraphy" v-model="searchParams.stratigraphy"/></td>
                </tr>
                <!--<tr><td>With occurrence records:</td><td><input type="checkbox" value="1" name="with_occurrence" /></td></tr>
                <tr><td>Ainult piltidega:</td><td><input type="checkbox" value="1" name="with_images" /></td></tr>
                <tr><td>Välista puuraugud:</td><td><input type="checkbox" value="1" name="no_drillcores" /></td></tr>-->
                <tr>
                  <td></td>
                  <td><button type="submit" name="SEARCH" @click="searchExtended()" style="width: 100px;">{{ $t('search.button ') }}</button></td>
                  <!-- INPUT -> Button -->
                </tr>
              </table>
            </form>
          </div>
        </div>
      </div><!-- header3 -->
      <div id="header4">
        <div id="title-menu">
          <router-link :to="{ path: '/page/28' }">{{ $t('menu.fossils') }}</router-link> |
          <router-link :to="{ path: '/page/29' }">{{ $t('menu.collecting') }}</router-link> |
          <router-link :to="{ path: '/page/30' }">{{ $t('menu.identifying ') }}</router-link>

          <!--<a href="/page/28">{{ $t('menu.fossils ') }}</a> |-->
          <!--<a href="/page/29">{{ $t('menu.collecting ') }}</a> |-->
          <!--<a href="/page/30">{{ $t('menu.identifying ') }}</a> |-->
          <!--<a href="http://stratigraafia.info/index.php?page=4">Geoloogiline aeg</a> |
      <a href="http://geokogud.info">{{ $t('menu.collections') }}</a> | -->
          <!--<span style="cursor:pointer"-->
                <!--id="show-detailed-search-btn" @click="hideAdvancedSearch = !hideAdvancedSearch">-->
            <!--<span v-if="hideAdvancedSearch">{{ $t('menu.detail_search ') }} </span>-->
            <!--<span v-if="!hideAdvancedSearch">{{ $t('menu.search ') }} </span>-->
          <!--</span>-->
        </div>
      </div><!-- header4 -->
      <div style="clear: both;"></div>
    </div><!-- header-box -->
  </div> <!-- header -->
</template>

<script>
  import LangButtons from '@/components/main/partial/LangButtons'
  import Autocomplete from 'vuejs-auto-complete'

  export default {
    name: "app-header",
    components:  {
        LangButtons,
          Autocomplete
    },
    data (){
      return {
        searchField:null,
        hideAdvancedSearch: true,
        searchParams:
          {
              species:'',
            locality:'',
            region:'',
            stratigraphy:''

          }
      }
    },
    methods: {
      searchExtended() {
        if (this.$route.path != '/search/detail') {
          this.$router.push({ path: '/search/detail' , params: {'params': this.searchParams}})
        } else {
            console.log('doubled method')
            this.$http.post('http://127.0.0.1:8001/search$',this.searchParams).then(response => {
              if (response.status === 200) {
                this.content = response.body.search_content
                console.log( response.body.search_content[0])
              }
            }, errResponse => {
              console.log('ERROR: ' + JSON.stringify(errResponse));
            })
        }

      }
    }
  }

</script>
