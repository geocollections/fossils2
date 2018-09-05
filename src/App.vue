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
        name: 'App'
    }
</script>
