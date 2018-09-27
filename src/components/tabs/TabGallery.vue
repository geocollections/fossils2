<template>
    <div id="#tab-gallery" class="tab-pane" :class="{active: $store.state.activeTab === 'gallery'}" role="tabpanel">
        <div class="p-3">
            <div class="card" v-if="images && images.length > 0">
                <div class="card-header" v-if="isSpecimen">{{ $t('header.f_higher_taxon_images_title_gallery') }}</div>
                <div class="card-header" v-if="!isSpecimen">{{ $t( 'header.f_higher_taxon_images_title_visualtool') }}</div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-8" if="$store.state.process === 'client'">
                            <lingallery ref="lingallery" :items="images" @currentIndex="setCurrentIndex"/>
                        </div>
                        <div class="card col-lg-4" v-if="currentImage != undefined">
                            <div class="card-body">
                                <div class="row" v-if="isSpecimen">{{currentImage.caption}}</div>
                                <div class="row" v-if="!isSpecimen">Name: {{currentImage.link__taxon}}</div>
                                <div class="row" v-if="currentImage.attachment__author__agent != null">Author: {{currentImage.attachment__author__agent}}</div>
                                <div class="row" v-if="currentImage.attachment__date_created != null">Created: {{currentImage.attachment__date_created}}</div>
                                <div class="row p-3">
                                    <button v-if="!isSpecimen" type="button" class="btn btn-info" @click="navigate(currentImage.link)">{{$t('main.button_read_more')}}</button>
                                    <div v-if="isSpecimen">
                                        <button type="button" class="btn btn-info"  @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen',object:currentImage.specimen_id, width:500,height:500})">INFO</button>
                                        <button type="button" class="btn btn-secondary"  @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen_image',object:currentImage.specimen_image_id, width:500,height:500})">IMAGE</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else><i>There is no images</i></div>
        </div>
    </div>

</template>

<script>

    import Lingallery from "../Lingallery.vue";
    export default {
        name: "TabGallery",
        components: { Lingallery },
        data () {
            return { currentIndex: 0 }
        },
        computed: {
            taxon () {return this.$parent.taxon},
            isSpecimen () {return this.$parent.isSpecimen},
            currentImage () { return this.images[this.currentIndex]},
            images () { return this.$parent.images }
        },
        methods: {
            navigate (link)  {
                this.$router.push({ path: '/'+link})
            },

            setCurrentIndex (event) {
                this.currentIndex = event
            }
        }

    }
</script>

<style scoped>

</style>