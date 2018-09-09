<template>
  <div>
    <h3>{{$t('header.zero')}}</h3>
    <div class='photogallery'>
      <h3 v-if="!$props.isSpecimen">{{$t('header.f_higher_taxon_images_title_visualtool')}} ({{$parent.taxon.taxon}})</h3>
      <!--<h3 v-else>{{$t('header.f_higher_taxon_images_title_gallery')}}</h3>-->
      <div v-for="idx in imagesLength" style="position:relative;float:left;" @mouseover="showImageInfo(imageName+'_'+idx)" v-bind:class="$props.isSpecimen === true ? 'image_highlight' : ''" @mouseout="hideImageInfo(imageName+'_'+idx)">
        <a :rel="$props.isSpecimen === true ? 'gallery-1' : 'gallery-2'" :href="getImage(idx, true)" ref="link" onclick="return false;" class="swipebox" title="">
          <img style="vertical-align: top;" :src="getImage(idx, false)" :alt="imageTitle(idx)" :title="imageTitle(idx)" border="0" /></a>
        <div v-show="$props.isSpecimen === true && mouseOverImage === imageName+'_'+idx" class="image_label" >
          <div style="padding: 3px;">
            <strong>{{imageTitle(idx)}} <br />
              <span  @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen',object:getImageId(idx), width:500,height:500})"
                     class="openwinlink">
                      INFO</span>
              |
              <span @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen_image',object:getSpecimenImageId(idx), width:500,height:500})"
                    class="openwinlink">
                      IMAGE</span></strong></div>
        </div>
        <div :id = "imageName+'_'+idx" class="zoomIcon" style="display:block;cursor:pointer;position:absolute;top:0;right:0;" v-show="mouseOverImage === imageName+ '_'+idx">
          <img src="/static/imgs/zoom_in.png" style="width: 32px;height: 32px;padding:2px 2px 0 0;" />
        </div>
      </div>
    </div>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
  export default {
    name: "image-gallery",
    props: ['images','isSpecimen'],
    data () {
      return {
        taxonImages: [],
        imagesLength: 100, // workaround of a problem!!!
                          // there is problem with rendering native js function of swipebox. in foreach loop it does not work
        mouseOverImage: null
      }
    },

    computed: {
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
      '$props.isSpecimen':{
        handler: function (newval) {
          if(newval && newval.length > 0) {

          }
        },
        deep: true
      }
      ,'nonEmptyImages':{
        handler: function (newval) {
          // console.log(newval)
        },
        deep: true
      }
    },
    methods: {

      getImage(idx, isFull) {
        if(this.taxonImages[idx-1] === undefined) return;
        return this.taxonImages[idx-1].path
      },

      getImageId(idx) {
        if(this.taxonImages[idx-1] === undefined) return;
        return this.taxonImages[idx-1].specimen_id
      },

      getSpecimenImageId(idx) {
        if(this.taxonImages[idx-1] === undefined) return;
        return this.taxonImages[idx-1].specimen_image_id
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
            element.fullPath = self.fileUrl + '/' + element.uuid_filename.substring(0,2)+'/'+ element.uuid_filename.substring(2,4)+'/'+ element.uuid_filename;
          }
          else if(element.attachment__uuid_filename && element.attachment__uuid_filename != null) {
            element.path = fileUrl + '/small/' + element.attachment__uuid_filename.substring(0,2)+'/'
              + element.attachment__uuid_filename.substring(2,4)+'/'+ element.attachment__uuid_filename;
            element.fullpath = fileUrl + '/' + element.attachment__uuid_filename.substring(0,2)+'/'
              + element.attachment__uuid_filename.substring(2,4)+'/'+ element.attachment__uuid_filename;
          }

        });
        return taxonImages
      },
    },
  }
</script>

<style scoped>

</style>
