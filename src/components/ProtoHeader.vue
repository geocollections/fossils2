<template>
    <header>
      <b-navbar toggleable="md" type="dark"id="mainNav" class="navbar-default  navbar-fixed-top" style="background-color: #020F20 !important;">
                <!--style="background-image: url('../../static/imgs/img_header.jpg') !important;"  variant="warning" -->

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand style=" letter-spacing: 3px;" href="/"><h2 class="text-uppercase" >{{ $t('header.title') }}</h2></b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <form class="form-inline my-2 my-lg-0">
            <autocomplete v-if="isMounted"
                          ref="autocomplete"
                          :source="simpleTaxonSearchApiCall"
                          results-property="results"
                          :results-display="displayResults"
                          :placeholder="$t('search.fossils_search')"
                          @selected="onSelect"></autocomplete></form>
            <b-nav-item href="/page/28">{{ $t('menu.fossils') }}</b-nav-item>
            <b-nav-item href="/page/29">{{ $t('menu.collecting') }}</b-nav-item>
            <b-nav-item href="/page/30">{{ $t('menu.identifying') }}</b-nav-item>
            <b-nav-item-dropdown :text="mode == 'in_baltoscandia' ? $t('header.in_baltoscandia_mode') : $t('header.global_mode')" right v-if="$router.currentRoute.name==='ItemPage'">
              <b-dropdown-item @click="changeMode('in_baltoscandia')" v-if="mode === 'in_global'">{{$t('header.in_baltoscandia_mode')}}</b-dropdown-item>
              <b-dropdown-item @click="changeMode('in_global')" v-if="mode === 'in_baltoscandia'">{{$t('header.global_mode')}}</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown>
              <template slot="button-content">
                <em>Lang</em>
              </template>

              <b-dropdown-item  @click="changeLang('ee')" class="p-2">EST &nbsp;<span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></b-dropdown-item>
              <b-dropdown-item  @click="changeLang('en')" class="p-2" >ENG &nbsp;<span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></b-dropdown-item>
              <b-dropdown-item  @click="changeLang('fi')" class="p-2">FIN &nbsp;<span class="flag-icon flag-icon-fi flag-icon-squared circle-flag"></span></b-dropdown-item>
              <b-dropdown-item  @click="changeLang('se')" class="p-2" >SWE &nbsp;<span class="flag-icon flag-icon-se flag-icon-squared circle-flag"></span></b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
</template>
<script>
  import LangButtons from '../components/LangButtons.vue'
  import Autocomplete from 'vuejs-auto-complete'

  export default {
    name: "proto-header",
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
        },
        filteredSearchResult () {
            return _.groupBy(this.$refs.autocomplete.results,'id')
        }
    },
    mounted: function(){
        this.isMounted = true;
        console.log(this.$router.currentRoute.name)
    },

    methods: {
      changeLang(lang) {
          this.$i18n.locale = lang;
          if (lang === 'ee') lang = 'et';
          this.$store.commit('SET_LANG', {lang});
          this.$router.push({ path: this.$router.currentRoute.path, query: {lang:lang} });
      },
      simpleTaxonSearchApiCall(value) {
          return 'https://api.geocollections.info/taxon/?sql=simple_taxon_search&keyword='+ value;
          //return 'https://api.geocollections.info/taxon/?paginate_by=10&fields=id,taxon,common_name__name,rank__rank_short&multi_search=value:' + value + ';fields:taxon,common_name__name;lookuptype:icontains'
        // return 'https://api.geocollections.info/taxon/?paginate_by=30&format=json&fields=id,taxon,rank__rank_en&multi_search=value:' + value + ';fields:taxon;lookuptype:icontains'
      },
      displayResults: function (result) {
          return result.name
          // console.log(this.$refs.autocomplete)
        //return result.rank__rank_short + ' ' + result.taxon + (result.common_name__name === null ? '' :' (' + result.common_name__name + ')')
      },
      changeMode: function(mode) {
          this.$store.commit('SET_MODE', {mode})
          this.$router.push({ path: this.$router.currentRoute.path, query: {mode:mode} })
      },
      onSelect(value) {
        this.$refs.autocomplete.clearValues()
        this.$router.push({ path: '/'+value.selectedObject.id})
      },

    }
  }
</script>
<style scoped>

</style>
