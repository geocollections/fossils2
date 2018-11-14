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
              <form class="form-inline my-lg-0 mr-5">
                  <vue-multiselect class="align-middle" style=" width: 20em !important; text-align: center !important;"
                                   id="search"
                                   :custom-label="displayResults" track-by="code"
                                   :placeholder="$t('search.fossils_search')"
                                   :options="searchResults"
                                   :searchable="true"
                                   :loading="isLoading"
                                   :max-height="600"
                                   :show-no-results="false"
                                   :show-labels="false"
                                   @select="onSelect" @search-change="simpleTaxonSearchApiCall">
                    <template slot="noResult"><b>NoRes</b></template>
                  </vue-multiselect>
              </form>
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
  import VueMultiselect from 'vue-multiselect'
  import LangButtons from '../components/LangButtons.vue'
  import Autocomplete from 'vuejs-auto-complete'
  import {
      fetchSimpleTaxonSearch
  } from '../api'
  export default {
    name: "app-header",
    components:  {
      VueMultiselect,
      LangButtons,
      Autocomplete
    },

    data ()  {
        return {isMounted : false, scroll:false, searchResults: [], isLoading: false, selectedTaxon: null}
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
        },


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
        simpleTaxonSearchApiCall(value) {
            if(value.length < 3)  this.searchResults = [];
            if(value.length > 2) {
                this.isLoading = true;
                fetchSimpleTaxonSearch(value).then((response) => {
                    this.isLoading = false;
                    this.searchResults = response.results
                });
            }
        },
        onSelect (value) {
            this.selectedTaxon = null
            location.replace('/'+value.id)
        },
        displayResults: function (item) {
            return `${item.name[0]}`
        },
        changeLang(lang) {
            if (this.$store.state.lang === lang) return;
            this.$i18n.locale = lang;
            if (lang === 'ee') lang = 'et';
            this.$store.commit('SET_LANG', {lang});
            this.$cookies.set('fossils_lang',lang)
            this.$router.push({ path: this.$router.currentRoute.path, query:  {mode:this.$store.state.mode, lang: lang}  });
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

</style>
