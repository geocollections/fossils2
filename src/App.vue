<template>
  <!-- wrapper -->
  <div id="pagewrap">
    <div id="msg-box-success" style="display:none;padding:10px;background-color:#edfeed"></div>
    <div id="msg-box-error" style="display:none;padding:10px;background-color:#feeded;"></div>
    <app-header/>
    <app-content/>
    <div style="clear: both;"></div>
    <app-footer/>
  </div>
  <!-- end wrapper -->
</template>

<script>
  import AppFooter from '@/components/main/partial/AppFooter'
  import AppHeader from '@/components/main/partial/AppHeader'
  import AppContent from "@/components/main/AppContent";

  export default {
    components: {
      AppContent,
      AppFooter,
      AppHeader,
    },
    name: 'App'
  }
</script>
