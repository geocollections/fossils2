<template>
  <div id="app">
    <app-header></app-header>
    <app-content class="mt-5 mb-5" />
    <app-footer/>
  </div>
</template>
<script>
    import AppFooter from './components/AppFooter.vue'
    import AppHeader from './components/AppHeader.vue'
    import AppContent from './components/AppContent.vue'

    export default {
        components: {
            AppFooter,
            AppHeader,
            AppContent
        },
        data () {
            return {
                isFixed: false
            }
        },

        name: 'App',
        created() {
            try {
                this.setLangAndMode();
            } catch(e){
                console.log('IE do not work properly with vue-cookies')
                this.$router.push({ path: '/'+this.$store.state.activeItem.taxon.id , query:  {mode:'in_baltoscandia', lang: 'en'}});
            }

        },
        methods: {
            setLangAndMode: function() {
                this.$nextTick(() => {
                    if(this.$store.state.process === 'client') {
                        let lang = this.$store.state.lang, mode = this.$store.state.mode;
                        //check if manually set lang or mode value is correct otherwise set default

                        if(this.$router.currentRoute.query.hasOwnProperty('mode')
                            && this.checkIfModeIsCorrect(this.$router.currentRoute.query.mode)){
                            this.$cookies.set('fossils_mode', this.$router.currentRoute.query.mode)
                        }

                        if(this.$router.currentRoute.query.hasOwnProperty('lang')
                            && this.checkIfLangIsCorrect(this.$router.currentRoute.query.lang)){
                            this.$cookies.set('fossils_lang', this.$router.currentRoute.query.lang)
                        }

                        if(!this.$router.currentRoute.query.hasOwnProperty('mode') || !this.$router.currentRoute.query.hasOwnProperty('lang')) {
                            //set values from cookies otherwise from default settings
                            if(this.$cookies.get('fossils_mode') && this.checkIfModeIsCorrect(this.$cookies.get('fossils_mode'))){
                                mode = this.$cookies.get('fossils_mode')
                                this.$store.commit('SET_MODE', {mode});
                            } else {
                                //set default
                                this.$cookies.set('fossils_mode', this.$store.state.mode)
                            }

                            if(this.$cookies.get('fossils_lang') && this.checkIfModeIsCorrect(this.$cookies.get('fossils_lang'))) {
                                lang = this.$cookies.get('fossils_lang')
                                this.$store.commit('SET_LANG', {lang});
                            } else {
                                //set default
                                this.$cookies.set('fossils_lang', this.$store.state.lang)
                            }
                        }
                        // this.$router.currentRoute.path
                        this.$router.push({ path: '/'+this.$store.state.activeItem.taxon.id , query:  {mode:mode, lang: lang}});
                    }
                })
            },
            checkIfModeIsCorrect: function (mode) {
                let isCorrect = false;
                switch (mode){
                    case 'in_estonia':
                    case 'in_baltoscandia':
                    case 'in_global':
                        isCorrect = true;
                        break;
                    default: break;
                }
                return isCorrect;
            },
            checkIfLangIsCorrect: function (lang) {
                let isCorrect = false;
                switch (lang){
                    case 'et':
                    case 'en':
                    case 'se':
                    case 'fi':
                        isCorrect = true;
                        break;
                    default: break;
                }
                return isCorrect;
            }
        },
        mounted() {
            //set locale after route refresh
            if(this.$store.state.lang === 'et') this.$i18n.locale = 'ee'
            else this.$i18n.locale = this.$store.state.lang
            // let jquery = document.createElement('script');
            // jquery.setAttribute('src',"/static/js/jquery.js");
            // document.head.appendChild(jquery);

        },
        metaInfo () {
            return {
                title: 'Fossiilid.info',
                meta:  [{ vmid: 'keywords', name: 'keywords', content: ''},
                    { vmid: 'description', name: 'description', content: ''}]
            }
        },
    }
</script>
<style src="../static/css/bootstrap/css/bootstrap.css"></style>
<!--<style src="../static/js/use.fontawesome.com-5.4.2/all.css"></style>-->
<!--<style src="../node_modules/bootstrap/dist/css/bootstrap.css"></style>-->
<style src="../static/css/vue-multiselect.min.css"></style>
<!--<style src="../node_modules/bootstrap-vue/dist/bootstrap-vue.css"></style>-->
<!--<style src="../static/css/fonts.css"></style>-->
<style src="../static/css/creative.css"></style>
<style src="../static/css/mainpage.css"></style>
<style src="../static/js/leaflet-1.3.4/leaflet.css"></style>
<style src="../static/js/leaflet-fullscreen/leaflet.fullscreen.css"></style>
<style src="../static/js/leaflet-draw-1.0.4/leaflet.draw.css"></style>
<style src="../static/js/leaflet-coordinates-0.1.5/leaflet.coordinates.css"></style>
<style src="../static/js/leaflet-groupedlayercontrol/leaflet.groupedlayercontrol.min.css"></style>
<style src="../static/js/fancybox-3.4.2/jquery.fancybox.min.css"></style>