<template>
  <div id="app">
    <app-header/>
    <app-content style="margin-top: -15%"/>
    <app-footer/>
  </div>
</template>
<script>
    import AppFooter from './components/AppFooter.vue'
    import AppHeader from './components/AppHeader.vue'
    import AppContent from './components/AppContent.vue'
    import FixedHeader from 'vue-fixed-header'

    export default {
        components: {
            AppFooter,
            AppHeader,
            AppContent,
            FixedHeader
        },
        data () {
            return {
                isFixed: false
            }
        },
        name: 'App',
        mounted() {
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

<style src="../node_modules/bootstrap/dist/css/bootstrap.css"></style>
<!--<style src="../node_modules/bootstrap-vue/dist/bootstrap-vue.css"></style>-->
<style src="../static/css/fonts.css"></style>
<style src="../static/css/creative.css"></style>
<style src="../static/css/mainpage.css"></style>
<style src="../static/css/picture.galery.css"></style>

<!--<style src="../static/css/sarv.css"></style>-->
<!--<style src="../static/css/sarv-fonts.css"></style>-->