<template>
    <header class="border-bottom">
      <span id="top"></span>
      <div class="container-fluid">
        <b-navbar toggleable="md" type="light"id="mainNav" class="border-bottom fixed-top">
          <b-navbar-brand
                  :style="{
                  'color':scroll ? '#eb3812' : '',
                  // 'letter-spacing': scroll ? '0px':'2px',
                  'font-size':scroll ? '18px' : 'larger',
                  'text-transform': 'uppercase','font-weight':'700 !important'}"
                  href="/">{{ $t('header.title') }}</b-navbar-brand>
          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
          <b-collapse is-nav id="nav_collapse">
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <form class="form-inline my-2 my-lg-0 mr-5" style="color:red !important; ">
                <autocomplete v-if="isMounted"
                              ref="autocomplete"
                              :source="simpleTaxonSearchApiCall"
                              results-property="results"
                              :results-display="displayResults"
                              :placeholder="$t('search.fossils_search')"
                              @selected="onSelect"></autocomplete></form>
              <b-nav-item-dropdown  right>
                <template slot="button-content" >{{$t(mode)}}</template>
                <b-dropdown-item @click="changeMode('in_estonia')" :class="$store.state.mode === 'in_estonia'? 'font-weight-bold' : ''">{{$t('header.in_estonia_mode')}}</b-dropdown-item>
                <b-dropdown-item @click="changeMode('in_baltoscandia')" :class="$store.state.mode === 'in_baltoscandia'? 'font-weight-bold' : ''">{{$t('header.in_baltoscandia_mode')}}</b-dropdown-item>
                <b-dropdown-item @click="changeMode('in_global')" :class="$store.state.mode === 'in_global'? 'font-weight-bold' : ''">{{$t('header.global_mode')}}</b-dropdown-item>
              </b-nav-item-dropdown>
              <b-nav-item-dropdown  right>
                <template slot="button-content" >{{langCode}}</template>
                <b-dropdown-item  @click="changeLang('ee')" :class="$store.state.lang === 'et'? 'font-weight-bold' : ''" class="p-2">EST &nbsp;<span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></b-dropdown-item>
                <b-dropdown-item  @click="changeLang('en')" :class="$store.state.lang === 'en'? 'font-weight-bold' : ''" class="p-2">ENG &nbsp;<span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></b-dropdown-item>
                <b-dropdown-item  @click="changeLang('fi')" :class="$store.state.lang === 'fi'? 'font-weight-bold' : ''" class="p-2">FIN &nbsp;<span class="flag-icon flag-icon-fi flag-icon-squared circle-flag"></span></b-dropdown-item>
                <b-dropdown-item  @click="changeLang('se')" :class="$store.state.lang === 'se'? 'font-weight-bold' : ''" class="p-2">SWE &nbsp;<span class="flag-icon flag-icon-se flag-icon-squared circle-flag"></span></b-dropdown-item>
              </b-nav-item-dropdown>
              <b-nav-item-dropdown right>
                <template slot="button-content">{{ $t('menu.more') }}</template>
                <b-dropdown-item  href="/page/28">{{ $t('menu.fossils') }}</b-dropdown-item>
                <b-dropdown-item  href="/page/29">{{ $t('menu.collecting') }}</b-dropdown-item>
                <b-dropdown-item  href="/page/30">{{ $t('menu.identifying') }}</b-dropdown-item>
                <b-dropdown-item  href="http://geocollections.info">{{ $t('menu.geocollections') }}</b-dropdown-item>
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
        langCode () {
            let code = 'ENG';
            switch (this.$store.state.lang) {
                case 'et': code = 'EST'; break;
                case 'se': code = 'SWE'; break;
                case 'fi': code = 'FIN'; break;
                default: break;
            }
            return code;
        },
        mode(){
            if(this.$store.state.mode === 'in_baltoscandia') return 'header.in_baltoscandia_mode';
            else if(this.$store.state.mode === 'in_estonia') return 'header.in_estonia_mode';
            else return 'header.global_mode';
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
          if (this.$store.state.lang === lang) return;
          this.$i18n.locale = lang;
          if (lang === 'ee') lang = 'et';
          this.$store.commit('SET_LANG', {lang});
          this.$cookies.set('fossils_lang',lang)
          this.$router.push({ path: this.$router.currentRoute.path, query:  {mode:this.$store.state.mode, lang: lang}  });
      },
      simpleTaxonSearchApiCall(value) {
          return 'https://api.geocollections.info/solr/fossils_search/?q=name:*'+ value +'*';
          //return 'https://api.geocollections.info/taxon/?paginate_by=10&fields=id,taxon,common_name__name,rank__rank_short&multi_search=value:' + value + ';fields:taxon,common_name__name;lookuptype:icontains'
        // return 'https://api.geocollections.info/taxon/?paginate_by=30&format=json&fields=id,taxon,rank__rank_en&multi_search=value:' + value + ';fields:taxon;lookuptype:icontains'
      },
      displayResults: function (result) {
          return result.name[0]
          // console.log(this.$refs.autocomplete)
        //return result.rank__rank_short + ' ' + result.taxon + (result.common_name__name === null ? '' :' (' + result.common_name__name + ')')
      },

      onSelect(value) {
        this.$refs.autocomplete.clearValues()
          //Hard refresh is not working
        // this.$router.push({ path: '/'+value.selectedObject.id})
          location.replace('/'+value.selectedObject.id)

      },
      changeMode: function(mode) {
          this.$store.commit('SET_MODE', {mode})
          this.$cookies.set('fossils_mode',mode)
          this.$router.push({ path: this.$router.currentRoute.path, query: {mode:mode, lang: this.$store.state.lang} })
      },
      handleScroll (e) {
          this.scroll =  document.documentElement.scrollTop > 1;
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
