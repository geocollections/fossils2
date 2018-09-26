<template>
  <div>
    <h3>{{$t('header.zero')}}</h3>
    <div v-if="imagesLength > 0">
      <div class="row">
        <div class="col-lg-8">
          <lingallery ref="lingallery" :items="items" @currentIndex="load"/>
        </div>
        <div class="card col-lg-4">
          <div class="card-body">
            <div class="row">Name: {{currentImage.link__taxon}}</div>
            <div class="row" v-if="currentImage.attachment__author__agent != null">Author: {{currentImage.attachment__author__agent}}</div>
            <div class="row" v-if="currentImage.attachment__date_created != null">Created: {{currentImage.attachment__date_created}}</div>
            <div class="row" v-if="$props.isSpecimen">{{currentImage}}</div>
            <div class="row p-3">
              <button v-if="!$props.isSpecimen" type="button" class="btn btn-info" @click="$navigate(currentImage.link)">{{$t('main.button_read_more')}}</button>
              <div v-if="$props.isSpecimen">
                <button type="button" class="btn btn-info"  @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen',object:currentImage.specimen_id, width:500,height:500})">INFO</button>
                <button type="button" class="btn btn-secondary"  @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen_image',object:currentImage.specimen_image_id, width:500,height:500})">IMAGE</button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
    <!--<div class='photogallery'>-->
      <!--<h3 v-if="!$props.isSpecimen">{{$t('header.f_higher_taxon_images_title_visualtool')}} ({{$parent.taxon.taxon}})</h3>-->
      <!--&lt;!&ndash;<h3 v-else>{{$t('header.f_higher_taxon_images_title_gallery')}}</h3>&ndash;&gt;-->
      <!--<div v-for="idx in imagesLength" style="position:relative;float:left;" @mouseover="showImageInfo(imageName+'_'+idx)" v-bind:class="$props.isSpecimen === true ? 'image_highlight' : ''" @mouseout="hideImageInfo(imageName+'_'+idx)" @click="navigate(idx)">-->
        <!--<a :rel="$props.isSpecimen === true ? 'gallery-1' : 'gallery-2'" :href="1`  (idx, true)" ref="link" onclick="return false;" class="swipebox" :title="imageTitle(idx)">-->
          <!--<img style="vertical-align: top;" :src="getImage(idx, false)" :alt="imageTitle(idx)" :title="imageTitle(idx)" border="0" /></a>-->
        <!--<div v-show="$props.isSpecimen === true && mouseOverImage === imageName+'_'+idx" class="image_label" >-->
          <!--<div style="padding: 3px;">-->
            <!--<strong>{{imageTitle(idx)}} <br />-->
              <!--<span  @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen',object:getImageId(idx), width:500,height:500})"-->
                     <!--class="openwinlink">-->
                      <!--INFO</span>-->
              <!--|-->
              <!--<span @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen_image',object:getSpecimenImageId(idx), width:500,height:500})"-->
                    <!--class="openwinlink">-->
                      <!--IMAGE</span></strong></div>-->
        <!--</div>-->
        <!--<div :id = "imageName+'_'+idx" class="zoomIcon" style="display:block;cursor:pointer;position:absolute;top:0;right:0;" v-show="mouseOverImage === imageName+ '_'+idx">-->
          <!--<img src="/static/imgs/zoom_in.png" style="width: 32px;height: 32px;padding:2px 2px 0 0;" />-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>

  import Lingallery from "../components/Lingallery.vue";
  export default {
    components: {Lingallery},
    name: "image-gallery",
    props: ['images','isSpecimen'],
    data () {
      return {
          currentIndex: 0,
        taxonImages: [],
        imagesLength: 0, // workaround of a problem!!!
                          // there is problem with rendering native js function of swipebox. in foreach loop it does not work
        mouseOverImage: null
      }
    },

    computed: {
        currentImage () {
           return this.taxonImages[this.currentIndex]
        },
        items(){
          let images = [];
          if (this.taxonImages.length === 0) return [];
          for (let i = 1; i < this.taxonImages.length; i ++) {
              images.push({src:this.getImage(i, false), thumbnail:this.getImage(i, false), caption: this.imageTitle(i)})
          }
          return images
      },
      nonEmptyImages: function() {
        return this.$props.images.length !== 0
      },
      imageName: function() {
        if (this.$props.isSpecimen === true) return 'specimen' ;
        return'image';
      }
    },
    //
    watch: {
      '$props.images':{
        handler: function (newval) {
          if(newval && newval.length > 0) {
            this.imagesLength = newval.length
            this.taxonImages = this.composeImageRequest(newval)
          }
        },
        deep: true
      },
    },

    methods: {
      navigate (link)  {
          this.$router.push({ path: '/'+link})
      },
      getImage(idx, isFull) {
        if(this.taxonImages[idx-1] === undefined) return;
        return isFull === true ? this.taxonImages[idx-1].fullPath : this.taxonImages[idx-1].path
      },

      imageTitle: function(idx) {
        if(this.taxonImages[idx-1] === undefined) return;
        if (this.$props.isSpecimen === true) {
          return this.taxonImages[idx-1].database__acronym +' '+this.taxonImages[idx-1].specimen__specimen_id + ' '
            + this.$parent.taxon.taxon+ ' ' + this.$parent.taxon.author_year
        } else {
          return this.taxonImages[idx-1].link__taxon
        }
      },

      showImageInfo: function(imageIdx){
        this.mouseOverImage = imageIdx
      },
      hideImageInfo: function(imageIdx){
        this.mouseOverImage = null
      },
      composeImageRequest : function(taxonImages) {
        if(taxonImages === undefined) return;
        let fileUrl = 'http://files.geocollections.info';
        taxonImages.forEach(function(element) {
          if (element.uuid_filename && element.uuid_filename != null) {
            element.path = fileUrl + '/small/' + element.uuid_filename.substring(0,2)+'/'+ element.uuid_filename.substring(2,4)+'/'+ element.uuid_filename;
            element.fullPath = self.fileUrl + '/large/' + element.uuid_filename.substring(0,2)+'/'+ element.uuid_filename.substring(2,4)+'/'+ element.uuid_filename;
          }
          else if(element.attachment__uuid_filename && element.attachment__uuid_filename != null) {
            element.path = fileUrl + '/small/' + element.attachment__uuid_filename.substring(0,2)+'/'
              + element.attachment__uuid_filename.substring(2,4)+'/'+ element.attachment__uuid_filename;
            element.fullpath = fileUrl + '/large/' + element.attachment__uuid_filename.substring(0,2)+'/'
              + element.attachment__uuid_filename.substring(2,4)+'/'+ element.attachment__uuid_filename;
          }

        });
        return taxonImages
      },
        load (event) {
          this.currentIndex = event
        }
    },
  }
</script>

<style scoped>
  .flex-column {
    max-width : 260px;
  }
  .container {
    background: #f9f9f9;
  }

  #lingallery {
    max-width: 100%;
  }
  figure {
    position: relative;
    margin: 0;
    padding: 0;
    max-width: 100%;
    text-align: center;
    cursor: pointer;
  }
  figure img {
    max-width: 100%;
    max-height: 100%;
    transition: opacity .25s ease;
  }
  figure img.loading {
    opacity: 0.25;
    min-height: 200px;
    transition: opcacity .25s ease;
  }
  figure a.control {
    position: absolute;
    top: calc(50% - 12px);
    display: none;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    text-shadow: 0 0 20px rgba(0, 0, 0, 0.75);
  }
  figure a.control.left {
    left: 5px;
  }
  figure a.control.right {
    right: 5px;
  }
  figure:hover a.control {
    display: block;
  }
  .lingallery_caption {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 4px 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.75);
    font-size: 1em;
  }
  .lingallery_thumbnails {
    overflow-x: auto;
    width: 100%;
  }
  .lingallery_thumbnails_content {
    margin-top: 2px;
    width: auto;
    white-space: nowrap;
  }
  .lingallery_thumbnails .lingallery_thumbnails_content_elem {
    display: inline-block;
  }
  .lingallery_thumbnails .lingallery_thumbnails_content_elem img {
    border: 2px solid #fff;
    cursor: pointer;
  }
  #lingallery_spinner {
    position: absolute;
    left: 50%;
    top: calc(50% - 32px);
  }
  #lingallery_spinner > div {
    z-index: 9999;
    position: relative;
    left: -50%;
  }

  /*
   * Scrollbar styling
   */
  .lingallery_thumbnails::-webkit-scrollbar {
    height: 6px;
  }
  .lingallery_thumbnails::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #eaeaea;
  }

  .lingallery_thumbnails::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #b4b4b4;
  }
  .lingallery_thumbnails::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(100,100,100,0.4);
  }
</style>
