<template>
    <div id="#tab-gallery" class="tab-pane" :class="{active: $store.state.activeTab === 'gallery'}" role="tabpanel">
        <b-row v-if="$parent.imagesLoading">
            <spinner :show="$parent.imagesLoading"></spinner><span class="p-2">{{$t('messages.pageLoading')}}</span>
        </b-row>
        <b-row class="m-1" v-if="!$parent.imagesLoading">
            <div class="photogallery">
                <h3>{{$t($parent.imagesTitle)}} ({{$parent.taxon.taxon}})</h3>
                <div v-for="image in $parent.images" style="float: left; position: relative;" class="image_highlight">
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