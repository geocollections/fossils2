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
        <li>Sulge menüü</li>
      </ul>
    </div>

    <div id="header-box">
      <div id="lang-block-top">
        <lang-buttons lang-class="'header'"/>
        <!--<b-nav-item-dropdown :text="mode == 'in_baltoscandia' ? $t('header.in_baltoscandia_mode') : $t('header.global_mode')" right>-->
          <!--<b-dropdown-item @click="changeMode('in_baltoscandia')" v-if="mode === 'in_global'">{{$t('header.in_baltoscandia_mode')}}</b-dropdown-item>-->
          <!--<b-dropdown-item @click="changeMode('in_global')" v-if="mode === 'in_baltoscandia'">{{$t('header.global_mode')}}</b-dropdown-item>-->
        <!--</b-nav-item-dropdown>-->
      </div>
      <div id="header1">
        <a href="http://balticdiversity.eu"><img id="bd-logo" src="/public/imgs/bd_logo0.png" border="0"/></a>
        <div id="slogan-block-top" style="text-transform: uppercase;">{{ $t('header.subtitle') }}</div>
      </div>
      <div id="header2">
        <h1> <router-link v-bind:to="'/'">{{ $t('header.title') }}</router-link></h1>
      </div>
      <div id="header3" v-if="isMounted === true">
        <div id="search_box" style="position:relative;">
          <autocomplete
            ref="autocomplete"
            :source="simpleTaxonSearchApiCall"
            results-property="results"
            :results-display="displayResults"
            :placeholder="$t('search.fossils_search')"
            @selected="onSelect"
          >
          </autocomplete>
        </div>
      </div><!-- header3 -->
      <div id="header4">
        <div id="title-menu">
          <router-link :to="{ path: '/page/28' }">{{ $t('menu.fossils') }}</router-link> |
          <router-link :to="{ path: '/page/29' }">{{ $t('menu.collecting') }}</router-link> |
          <router-link :to="{ path: '/page/30' }">{{ $t('menu.identifying ') }}</router-link>
        </div>
      </div><!-- header4 -->
      <div style="clear: both;"></div>
    </div><!-- header-box -->
  </div> <!-- header -->
</template>

<script>
  import LangButtons from '../components/LangButtons.vue'
  import Autocomplete from 'vuejs-auto-complete'

  export default {
    name: "app-header",
    components:  {
      LangButtons,
      Autocomplete
    },
    data ()  {
        return {isMounted : false}
    },
    computed: {
        mode () {
            return this.$store.state.mode
        }
    },
    mounted: function(){
        this.isMounted = true;
    },
    methods: {
        //todo:
      simpleTaxonSearchApiCall(value) {
        // return 'https://api.geocollections.info/taxon/?paginate_by=10&fields=id,taxon,common_name__name,rank__rank_short&multi_search=value:' + value + ';fields:taxon,common_name__name;lookuptype:icontains'
        return 'https://api.geocollections.info/taxon/?paginate_by=30&format=json&fields=id,taxon,rank__rank_en&multi_search=value:' + value + ';fields:taxon;lookuptype:icontains'
      },
      displayResults: function (result) {
        return result.taxon
        //return result.rank__rank_short + ' ' + result.taxon + ' (' + result.common_name__name + ')'
      },

      onSelect(value) {
        this.$refs.autocomplete.clearValues()
        this.$router.push({ path: '/'+value.selectedObject.id})
      },

    }
  }
</script>
