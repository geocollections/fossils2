<template>
  <div id="app">
    <div id="pagewrap">
      <app-header/>
      <app-content/>
      <div style="clear: both;"></div>
      <app-footer/>
    </div>
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
        name: 'App',
        metaInfo: {
            title: 'Fossiilid.info',
            titleTemplate: ' %s '
        }
    }
</script>
<style src="../node_modules/bootstrap/dist/css/bootstrap.css"></style>
<style src="../node_modules/bootstrap-vue/dist/bootstrap-vue.css"></style>
<style src="../static/css/sarv.css"></style>
<style src="../static/css/sarv-fonts.css"></style>