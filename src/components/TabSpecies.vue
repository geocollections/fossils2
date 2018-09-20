<template>
    <div id="#tab-species" class="tab-pane" :class="{active: $store.state.activeTab === 'species'}" role="tabpanel">
        <div class="row  p-3">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">{{$t('header.f_species_list')}}</div>
                    <div class="card-body"  v-if="allSpecies && allSpecies.length > 0">
                        <div v-if="$parent.isDefinedAndNotEmpty(specimenIdentification)">
                            <div style='font-size: 0.8em;' v-for="(item, idx) in allSpecies">
                                &ensp;&ensp;&ensp;{{$parent.calculateSpeciesIdx(idx)}}. <em><router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link></em>
                                | <span v-translate="{et:item.stratigraphy_base__stratigraphy,  en: item.stratigraphy_base__stratigraphy_en}"></span>
                                <span v-if="item.stratigraphy_top__stratigraphy !=null"> → </span><span v-translate="{et:item.stratigraphy_top__stratigraphy,  en: item.stratigraphy_top__stratigraphy_en}"></span>
                            </div>
                            <div class="col-xs-12 col-xs-6 pagination-center">
                                <b-pagination
                                        size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="$store.state.searchParameters.watched.page" :per-page="$store.state.searchParameters.watched.paginateBy">
                                </b-pagination>
                            </div>
                        </div>
                        <div v-else>Selle rühma all ei ole liike registreeritud</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabSpecies",
        computed : {
            specimenIdentification () {return this.$store.state.activeItem['specimenIdentification'] },
            allSpecies () {return this.$parent.allSpecies},
            response () {return this.$parent.response}
        }
    }
</script>

<style scoped>

</style>