<template>
    <header class="border-bottom">
      <span id="top"></span>
      <div class="container-fluid">
        <b-navbar toggleable="md" type="light"id="mainNav" class="border-bottom fixed-top"
                  :style="{'height':scroll ? '50px' : ''}">
          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
          <b-navbar-brand
                  :style="{'color':scroll ? 'red' : '','letter-spacing': scroll ? '0px':'3px','font-size':scroll ? 'smaller !important' : ''}"
                  href="/"><h2 class="text-uppercase" >{{ $t('header.title') }}</h2></b-navbar-brand>
          <b-collapse is-nav id="nav_collapse">
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <form class="form-inline my-2 my-lg-0" style="color:red !important; ">
                <autocomplete v-if="isMounted"
                              ref="autocomplete"
                              :source="simpleTaxonSearchApiCall"
                              results-property="results"
                              :results-display="displayResults"
                              :placeholder="$t('search.fossils_search')"
                              @selected="onSelect"></autocomplete></form>
              <b-nav-item href="http://geocollections.info">{{ $t('menu.geocollections') }}</b-nav-item>
              <b-nav-item-dropdown>
                <template slot="button-content">{{ $t('menu.language') }}</template>

                <b-dropdown-item  @click="changeLang('ee')" class="p-2">EST &nbsp;<span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></b-dropdown-item>
                <b-dropdown-item  @click="changeLang('en')" class="p-2">ENG &nbsp;<span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></b-dropdown-item>
                <b-dropdown-item  @click="changeLang('fi')" class="p-2">FIN &nbsp;<span class="flag-icon flag-icon-fi flag-icon-squared circle-flag"></span></b-dropdown-item>
                <b-dropdown-item  @click="changeLang('se')" class="p-2">SWE &nbsp;<span class="flag-icon flag-icon-se flag-icon-squared circle-flag"></span></b-dropdown-item>
              </b-nav-item-dropdown>
              <b-nav-item-dropdown>
                <template slot="button-content">{{ $t('menu.more') }}</template>
                <b-dropdown-item  href="/page/28" class="p-2">{{ $t('menu.fossils') }}</b-dropdown-item>
                <b-dropdown-item  href="/page/29" class="p-2">{{ $t('menu.collecting') }}</b-dropdown-item>
                <b-dropdown-item  href="/page/30" class="p-2">{{ $t('menu.identifying') }}</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>

    </header>
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
        return {isMounted : false, scroll:false}
    },
    computed: {
        mode () {
            return this.$store.state.mode
        }
    },
    mounted: function(){
        this.isMounted = true;
    },
    beforeMount() {
        document.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy () {
        document.addEventListener('scroll', this.handleScroll);
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
          //Hard refresh is not working
        // this.$router.push({ path: '/'+value.selectedObject.id})
          location.replace('/'+value.selectedObject.id)

      },
      handleScroll (e) {
          this.scroll =  document.documentElement.scrollTop > 0;
      }

    }
  }
</script>
<style scoped>
  .autocomplete__box {
    border:2px solid #eb3812 !important;
    border-radius: 2px !important;
    padding: 1px 5px !important;
  }
</style>
