<template>
    <section>
        <div class="col-lg-12" v-if="errorMessege"><b-alert show variant="warning"><span v-html="errorMessege"></span></b-alert></div>
        <div id="fossilgroups_box" style="max-width: 1280px !important;text-align: center" v-if="content">
            <div class='fossilgroup_box'  v-for = "item in content">
                <a :href="'/'+item.taxon" :title="item.taxon__taxon" >
                        <img :src="'https://files.geocollections.info/img/fossiilid/fossilgroups/'+item.taxon+'.png'" :alt="item.frontpage+' ('+item.taxon__taxon+')'">
                    {{item.frontpage}}
                </a>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  name: 'front-page',
  computed: {
    content : function() {
        if (this.$store.state.lang === 'et') return this.$store.state.frontPage.et
        else if (this.$store.state.lang === 'en') return this.$store.state.frontPage.en
        else if (this.$store.state.lang === 'fi') return this.$store.state.frontPage.fi
        else if (this.$store.state.lang === 'se') return this.$store.state.frontPage.se
        // return this.$store.state.lang === 'et' ? this.$store.state.frontPage.et : this.$store.state.frontPage.en
    },
    errorMessege : function () {
        return this.$store.state['errorMessage']
    }
  },

  watch: {
    '$store.state.lang': {
      handler: function(newVal,oldVal) {
        let lang = this.$store.state.lang;
        this.$store.dispatch('FETCH_FRONT_PAGE', { lang })
      }
    }
  },
  asyncData ({ store}) {
    let lang = store.state.lang
    return store.dispatch('FETCH_FRONT_PAGE', { lang })
  }
}
</script>
<style>
    .css-loader {
        border: 10px solid #f3f3f3;
        border-top: 10px solid rgb(240, 95, 64);
        border-radius: 50%;
        width: 180px;
        height: 180px;
        animation: spin 2s linear infinite;
    }
    @keyframes spin {
        0% {transform: rotate(0deg)}
        100% {transform: rotate(360deg)}

    }
</style>
