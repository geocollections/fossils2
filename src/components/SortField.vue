<template>
    <button class="btn btn-link" @click="order($props.value)">
        <span>{{ $t($props.name) }}</span>
    <span v-show="$store.state.searchParameters.specimens.sortBy === localizePredicate($props.value) && $store.state.searchParameters.specimens.sortByAsc">&darr;</span>
    <span v-show="$store.state.searchParameters.specimens.sortBy === localizePredicate($props.value) && !$store.state.searchParameters.specimens.sortByAsc">&uarr;</span>
    </button>
</template>

<script>
    export default {
        name: "SortField",
        data() {
            return {
                predicate: null
            }
        },
        props: ['value', 'name'],
        methods: {
            order: function (predicate) {
                predicate = this.localizePredicate(predicate);
                let searchParameters = {
                    page : 1,
                    paginateBy : this.$store.state.searchParameters.specimens.paginateBy,
                    sortByAsc : (this.$store.state.searchParameters.specimens.sortBy === predicate ? !this.$store.state.searchParameters.specimens.sortByAsc : true),
                    sortBy : predicate,
                    order : !this.$store.state.searchParameters.specimens.sortByAsc ? "ASCENDING" :  "DESCENDING",
                }
                //DO not have any effect ???
                // this.$store.commit('SET_SPECIMEN_SEARCH_PARAMS', {searchParameters})
                this.$store.state.searchParameters.specimens = searchParameters;
                // this.$parent.getSpecimens();
            },
            localizePredicate(predicate) {
                let tokens = predicate.split(",");
                if(tokens.length === 1) return predicate;
                let value_et = tokens[0], value_en = tokens[1];
                return this.$store.state.lang === 'et' ? value_et : value_en;
            }
        }

    }
</script>

<style scoped>

</style>