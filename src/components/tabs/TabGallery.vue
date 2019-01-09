<template>
    <div id="#tab-gallery" class="tab-pane" :class="{active: $store.state.activeTab === 'gallery'}" role="tabpanel">
        <transition name="fade">
            <b-row class="m-1" style="max-width: 1280px;" v-if="!$parent.imagesLoading">
                <div class="col-lg-12 photogallery" style="width: 100%;">
                    <div v-for="image in $parent.images" style="float: left; position: relative;" class="image_highlight" v-if="image.src" >
                        <a data-fancybox="gallery2" :href="image.src" :data-caption="image.caption">
                            <img :alt="image.caption" style="height: 200px;" :src="image.thumbnail" onerror="this.style.display='none'"/>
                        </a>
                    </div>
                </div>
                <div id="bottomOfGallery"></div>
                <div v-if="imagesLoading">
                    <spinner :show="imagesLoading"></spinner><span class="p-2">{{$t('messages.pageLoading')}}</span>
                </div>
            </b-row>
        </transition>
    </div>
</template>

<script>
    import {fetchImages,fetchSelectedImages} from '../../api'
    import Spinner from "../Spinner.vue";

    export default {
        name: "TabGallery",
        components: {Spinner},
        data() {return {bottom: false, imagesLoading: false, noMoreResults: false}},
        created() {
            window.addEventListener('scroll', () => {
                this.bottom = false;
                this.bottom = this.bottomVisible()
            });
            this.loadMoreImages()
            // this.triggerFirstScroll()
        },
        watch: {
            'bottom': {
                handler: function (bottom) {
                    if (bottom) {
                       this.loadMoreImages();
                    }
                },
                deep: true
            }
        },
        methods: {
            bottomVisible() {
                const visible = document.documentElement.clientHeight
                return document.getElementById('bottomOfGallery') === null ?
                    false : ((document.getElementById('bottomOfGallery').getBoundingClientRect().bottom - 100) <= visible)
            },
            loadMoreImages() {
                if(this.imagesLoading) return;
                this.imagesLoading = true;
                if(this.$store.state.searchParameters.images.allowPaging === false || this.noMoreResults) {
                    this.imagesLoading = false;
                    return;
                }
                let query;
                if(this.$store.state.searchParameters.selectedImages.allowPaging === true) {
                    query = fetchSelectedImages(this.$parent.taxon.id,this.$store.state.searchParameters)
                } else if (this.$store.state.searchParameters.images.allowPaging) {
                    query = fetchImages(this.$parent.taxon.hierarchy_string,this.$store.state.searchParameters)
                }

                //67033
                query.then((response) => {
                    if(response && response.results && response.results.length > 0) {
                        this.$parent.images = this.$parent.images.concat(this.$parent.composeImageRequest(response.results));
                    } else {
                        if(this.$store.state.searchParameters.selectedImages.allowPaging){
                            this.$store.state.searchParameters.selectedImages.allowPaging = false
                        } else {
                            this.noMoreResults = true;
                        }
                    }
                    if(this.$store.state.searchParameters.selectedImages.allowPaging) {
                        this.$store.state.searchParameters.selectedImages.page = this.$store.state.searchParameters.selectedImages.page + 1;
                    } else {
                        this.$store.state.searchParameters.images.page = this.$store.state.searchParameters.images.page + 1;
                    }

                    this.imagesLoading = false;
                });
            },
            triggerFirstScroll() {
                window.scrollTo(0, 250);
            }

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
        max-width: 1280px !important;text-align: center;
    }

    .photogallery h3 {
        color: #fff;
        padding-bottom: 8px;
        text-shadow: none;
        font-size: 0.9em;
    }

</style>