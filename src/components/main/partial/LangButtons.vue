<template>
  <div v-bind:class="checkMe()">
    <span @click="changeLang('ee')" class="p-2">EST &nbsp;<span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></span>
    <span @click="changeLang('en')" class="p-2" >ENG &nbsp;<span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></span>
    <span @click="changeLang('fi')" class="p-2">FIN &nbsp;<span class="flag-icon flag-icon-fi flag-icon-squared circle-flag"></span></span>
    <span @click="changeLang('se')" class="p-2" >SWE &nbsp;<span class="flag-icon flag-icon-se flag-icon-squared circle-flag"></span></span>

  </div>
</template>

<script>
  import MyMixin from '../../../mixins/mixin';
  export default {

    name: "lang-buttons",
    mixins: [MyMixin],
    props: {
      langClass: String
    },
    methods: {
      checkMe () {
        return this.$props.langClass === 'header' ? 'lang-buttons p-3' : 'footer-lang-buttons p-3'
      },
      changeLang(lang) {
        this.$localStorage.set('fossilsLang', lang)
        this.$i18n.locale = lang
        this.toastInfo(this.$t('messages.langChange'))
        this.setLangChanged(lang)
      },

      toastInfo(text) {
        this.$toast.info(text, 'Info', {
          position: 'bottomRight',
          timeout: 2000,
          pauseOnHover: false
        })
      },
    }
  }
</script>

<style scoped>
  .lang-buttons {
    position: absolute;
    right: 0;
  }

  .lang-buttons > span:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  .lang-buttons > span:active {
    font-weight: bold;
  }

  .footer-lang-buttons > span:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  .footer-lang-buttons > span:active {
    font-weight: bold;
  }

  .circle-flag {
    border-radius: 100%;
  }
</style>
