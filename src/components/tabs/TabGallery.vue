<template>
    <div id="#tab-gallery" class="tab-pane" :class="{active: $store.state.activeTab === 'gallery'}" role="tabpanel">
        <b-row v-if="loading">
            <spinner :show="loading"></spinner><span class="p-2">{{$t('messages.pageLoading')}}</span>
        </b-row>
        <b-row class="m-1" v-if="!loading">
            <div class="photogallery">
                <h3>{{$t(imagesTitle)}} ({{$parent.taxon.taxon}})</h3>
                <div v-for="image in images" style="float: left; position: relative;" class="image_highlight">
                    <a data-fancybox="gallery2" :href="image.src" :data-caption="image.caption">
                        <img :alt="image.caption" style="height: 200px;" :src="image.thumbnail"/>
                    </a>
                </div>
            </div>
        </b-row>
    </div>

</template>

<script>
    import {
        fetchImages,
        fetchAttachment,
        fetchSelectedImages
    } from '../../api'
    import Spinner from "../Spinner.vue";
    export default {
        name: "TabGallery",
        components: {Spinner},
        data() {
            return {
                images : [],
                loading : true,
                imagesTitle: ''
            }
        },
        mounted () {
            this.getImages();
        },
        methods: {
            getImages() {
                this.loading = true;
                if(this.$parent.isHigherTaxon(this.$parent.taxon.rank__rank_en)) {
                    fetchSelectedImages(this.$parent.taxon.id).then((response) => {
                        if(response.results.length === 0) {
                            fetchImages(this.$parent.taxon.hierarchy_string).then((response) => {
                                this.images = this.$parent.composeImageRequest(response.results)
                                this.loading = false
                                this.imagesTitle = 'header.f_higher_taxon_images_title_visualtool'
                            });
                        } else {
                            this.images = this.$parent.composeImageRequest(response.results)
                            this.loading = false
                            this.imagesTitle = 'header.f_higher_taxon_images_title_gallery'
                        }
                    });
                } else {
                    fetchAttachment(this.$parent.taxon.hierarchy_string).then((response) => {
                        this.isSpecimen = true;
                        this.images = this.$parent.composeImageRequest(response.results);
                        this.loading = false
                    });
                }
            },
        }
    }
</script>

<style scoped>
    /* galeriid ümbritsev stiil */
    .photogallery {
        /*display:inline-block;*/
        background-color: #000; /* eeldusel et enamik pilte on mustal taustal */
        -moz-border-radius: 6px;
        -webkit-border-radius: 6px;
        border-radius: 6px;
        padding: 5px;
        margin: 0;
        /*max-height: 400px;*/
        overflow: auto;
    }

    .photogallery h3 {
        color: #fff;
        padding-bottom: 8px;
        text-shadow: none;
        font-size: 0.9em;
    }

    .photogallery img {
    }


</style>