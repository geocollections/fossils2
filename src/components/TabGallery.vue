<template>
    <div id="#tab-gallery" class="tab-pane" :class="{active: $store.state.activeTab === 'gallery'}" role="tabpanel">
        <div class="card">
            <div class="card-header">{{$t('header.f_taxon_images')}}</div>
            <div class="card-body">
                <div v-if="['None','Phylum', 'Kingdom', 'None', 'Class', 'Order'].includes(taxon.rank__rank_en) && taxonImages !== undefined ">
                    <image-gallery :images="taxonImages" if="taxonImages"></image-gallery>
                </div>

                <div v-if="['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(taxon.rank__rank_en)">
                    <image-gallery :images="speciment_attachment" v-if="speciment_attachment" :isSpecimen="true"></image-gallery>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    import ImageGallery from "../components/ImageGallery.vue"
    export default {
        name: "TabGallery",
        computed: {
            taxon () {return this.$parent.taxon},
            taxonImages () {return this.$parent.taxonImages},
            speciment_attachment () {return this.$parent.speciment_attachment},
        },
        components: {
            ImageGallery,
        }
    }
</script>

<style scoped>
    #myCarousel .list-inline {
        white-space:nowrap;
        overflow-x:auto;
    }
</style>