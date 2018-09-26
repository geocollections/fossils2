<template>
    <div id="#tab-classification" class="tab-pane" :class="{active:$store.state.activeTab === 'classification'}" role="tabpanel">
        <div class="row p-3">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">{{$t('header.fossils_classification')}}</div>
                    <div class="card-body">
                        <classification-table :hierarchy ="hierarchy"
                                              :parent = "parent"
                                              :taxon = "taxon"
                        ></classification-table>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">{{$t('header.fossils_browse_tree')}}</div>
                    <div class="card-body">
                        <taxonomical-tree v-if="isTaxonomicTreeIsLoaded"
                                          :taxon_="taxon"
                                          :parent_="parent"
                                          :hierarchy_="hierarchy"
                                          :sortedSistersWithoutCurrentTaxon_="sortedSistersWithoutCurrentTaxon"
                                          :sortedSisters_ = "sortedSisters"
                                          :sortedSiblings_ = "sortedSiblings"
                        ></taxonomical-tree>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ClassificationTable from "../ClassificationTable.vue";
    import TaxonomicalTree from "../TaxonomicalTree.vue";
    export default {
        name: "TabClassification",
        components: {
            ClassificationTable, TaxonomicalTree
        },
        computed: {
            hierarchy () {return this.$parent.hierarchy},
            parent () {return this.$parent.parent},
            taxon () {return this.$parent.taxon},
            sortedSistersWithoutCurrentTaxon (){return this.$parent.sortedSistersWithoutCurrentTaxon},
            sortedSisters () {return this.$parent.sortedSisters},
            sortedSiblings () {return this.$parent.sortedSiblings},
            isTaxonomicTreeIsLoaded () {return this.$parent.isTaxonomicTreeIsLoaded}
        }
    }
</script>

<style scoped>

</style>