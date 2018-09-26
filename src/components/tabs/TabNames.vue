<template>
    <div id="#tab-names" class="tab-pane" :class="{active: $store.state.process === 'server' || ($store.state.process === 'client' && $store.state.activeTab === 'names')}" role="tabpanel">
        <div class="row p-3"><h2 v-show="$store.state.process === 'server'">Common names</h2></div>
        <div class="row p-3" v-if="filteredCommonNames && filteredCommonNames.length > 0">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <span v-if="filteredCommonNames.length > 0" v-for="item in filteredCommonNames">
                          <strong>{{item.language}}</strong>: {{item.name}};
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row p-3" v-if="synonyms && synonyms.length > 0">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">{{$t('header.f_species_synonymy')}}</div>
                    <div class="card-body">
                        <ul>
                            <li v-for="synonym in synonyms">
                                <em>{{synonym.taxon_synonym}}</em>:
                                {{synonym.author}}, {{synonym.year}}, lk. {{synonym.pages}},
                                joon. {{synonym.figures}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabNames",
        computed: {
            isSSRprocess () {
                console.log(this.$parent.isSSRprocess)
                return this.$parent.isSSRprocess
            },
            filteredCommonNames () {return this.$parent.filteredCommonNames},
            synonyms () {return this.$parent.synonyms}
        }
    }
</script>

<style scoped>

</style>