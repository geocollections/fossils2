<template>
    <section>

    </section>
</template>

<script>
export default {
  name: 'advanced-search-page',
  computed: {

  },
  methods: {

  },
  watch: {
    '$store.state.lang': {
      handler: function(newVal,oldVal) {
        let lang = this.$store.state.lang;
        this.$store.dispatch('FETCH_FRONT_PAGE', { lang })
          console.log(this.$store.state)
      }
    }
  },
  asyncData ({ store}) {
    let lang = store.state.lang
    return store.dispatch('FETCH_FRONT_PAGE', { lang })
  }
}
</script>
