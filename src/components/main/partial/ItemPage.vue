<template>
  <div id="content">
    <h3>{{$t('header.zero')}}</h3>
    <spinner v-show="requestingData" class="loading-overlay" size="massive" :message="$t('messages.overlay')"></spinner>

    <div id="taxon-box" v-show="requestingData == false" >
      <div id="taxon-header">
        <div id="fossilgroup-icon">
          <router-link v-bind:to="'/'+taxon.fossil_group__id" v-if="taxon.fossil_group__id != null">
            <img border="0" :src="'/static/fossilgroups/'+taxon.fossil_group__id+'.png'" :alt="taxon.fossil_group__taxon"
                 :title="taxon.fossil_group__taxon" style="height: 80px; margin-top: 0px; padding-right: 0px;" />
            <!--<br />{{taxon.fossil_group__taxon}}-->
          </router-link>
          <router-link v-bind:to="'/'+taxon.id" v-else-if="taxon.is_fossil_group == 1">
            <img border="0" :src="'/static/fossilgroups/'+ taxon.id+'.png'" :alt="taxon.taxon"
                 :title="taxon.taxon" style="height: 95px; margin-top: 0; padding-right: 0px;" />
          </router-link>
        </div>

        <div id="taxon-title">
          <h1 style='color: #333;'>
            <span style="color:#333; font-weight:bold" v-if="taxon_page && taxon_page.frontpage_title">{{taxon_page.title}}</span><br />

            <div v-if="taxon.rank__rank_en == 'Species' || taxon.rank__rank_en == 'Genus'">{{$t('header.f_fossil_group')}}:
              <router-link v-bind:to="'/'+taxon.fossil_group__id">{{taxon.fossil_group__taxon}}</router-link></div>
            <span style="font-size: 0.7em;" v-translate="{ et: taxon.rank__rank, en: taxon.rank__rank_en }"></span>
            <span style="font-size: 0.7em;">{{taxon.taxon}} {{taxon.author_year}}</span>
          </h1>
          <div class="taxon_names" >
            <span v-if="common_names.length > 0" v-for="item in common_names">
              <strong>{{item.language}}</strong>: {{item.name}};
            </span>
          </div>

        </div>
      </div>
    </div>
    <!-- content left ends and menu begins -->
    <div id="menu" v-show="requestingData == false">
      <div id="species_hierarchy_container" style="position: relative; ">
        <h3>{{$t('header.fossils_classification')}}</h3>
        <classification-table v-if="isHierarchyLoaded"
          :hierarchy ="hierarchy"
          :parent = "parent"
          :taxon = "taxon"
        ></classification-table>
        <br />
        <span onclick="$('#tree').slideToggle();" style="cursor:pointer;font-size: 0.9em; color: #ccc; text-transform:uppercase;">{{$t('header.button_show')}}</span>
        <taxonomical-tree v-if="isTaxonomicTreeIsLoaded"
          :taxon_="taxon"
          :parent_="parent"
          :hierarchy_="hierarchy"
          :sortedSistersWithoutCurrentTaxon_="sortedSistersWithoutCurrentTaxon"
          :sortedSisters_ = "sortedSisters"
          :sortedSiblings_ = "sortedSiblings"
          :isSisterTaxaLoaded_ = "isSisterTaxaLoaded"
          :isSiblingsLoaded_ = "isSiblingsLoaded"
          :isHierarchyLoaded_ = "isHierarchyLoaded"
        ></taxonomical-tree>

      </div>
      <br />
      <div>
        <h3>{{$t('header.f_weblinks')}}</h3>
        <div id="taxon-links">
        <span>

        </span>
          <!--{% for link in content.seealso_links %}-->
          <!--<a href="{{link.url}}">{{link.name}}</a> {% if forloop.last %}{%else%} <br /> {% endif %}-->
          <!--{% endfor %}-->
        </div>
      </div>
    </div >
    <div id="content-left" v-show="requestingData == false" >
      <div id="taxon-info" style="width:100%;">
        <div>
          <div class="recordeditor n">
            Taxon ID: <strong>{{taxon.id}}</strong>
            <span v-if="taxon.date_added"> | {{taxon.date_added | moment('YYYY-MM-DD')}}</span>
            <span v-if="taxon.date_changed">/ {{taxon.date_changed | moment('YYYY-MM-DD')}}</span>
            <span v-if="taxon.user_authorized"> | {{taxon.user_authorized | moment('YYYY-MM-DD')}}</span>
          </div>
          <div v-if="taxon.id != 29">
            {{$t('header.f_belongs_to')}}:
            <em>
              <router-link v-bind:to="'/'+parent.id">{{parent.taxon}}</router-link>
            </em>
            <br />
            <div v-if="isDefinedAndNotEmpty(sortedSistersWithoutCurrentTaxon)">
              {{$t('header.f_sister_taxa')}}:
              <span v-for="(item,idx) in sortedSistersWithoutCurrentTaxon">
                <em style='font-weight: normal;'><router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link></em>
                <span v-if = 'idx != sortedSistersWithoutCurrentTaxon.length -1'> | </span>
              </span>
              <br />
            </div>
            <div v-if="isDefinedAndNotEmpty(sortedSiblings)">
              {{$t('header.f_contains')}}:
              <span v-if="siblings" v-for="(sibling, idx) in sortedSiblings">
              <router-link v-bind:to="'/'+sibling.id">{{sibling.taxon}}</router-link>
              <span v-if = 'idx != siblings.length -1'> | </span>
            </span>
              <br />
            </div>
            <div v-if="taxon.stratigraphy_base__stratigraphy || taxon.stratigraphy_top__stratigraphy">
              {{$t('header.f_stratigraphical_distribution')}}:
              <strong>
                <span v-if="taxon.stratigraphy_base__stratigraphy" class="openwinlink"
                      @click="openUrl({parent_url:'http://geokogud.info/stratigraphy',object:taxon.stratigraphy_base_id, width:500,height:500})">
                {{taxon.stratigraphy_base__stratigraphy}}
                </span>
                <span v-if="taxon.stratigraphy_top__stratigraphy != null && taxon.stratigraphy_base__stratigraphy != null">&ndash;</span>
                <span v-if="taxon.stratigraphy_top__stratigraphy
                && taxon.stratigraphy_base__stratigraphy != taxon.stratigraphy_top__stratigraphy" class="openwinlink"
                      @click="openUrl({parent_url:'http://geokogud.info/stratigraphy',object:taxon.stratigraphy_top_id, width:500,height:500})">
                  {{taxon.stratigraphy_top__stratigraphy}}
                </span>
                <span v-if="taxon.stratigraphy_base__age_base != null">| ~ {{convertToTwoDecimal(taxon.stratigraphy_base__age_base)}}</span>
                <span v-if="taxon.stratigraphy_top__age_top != null"> &ndash; {{convertToTwoDecimal(taxon.stratigraphy_top__age_top)}} Ma</span>
              </strong>
              <br />
            </div>
            <div v-if="taxon.rank__rank_en != null && taxon.rank__rank_en != 'species'">
              {{$t('header.f_baltic_species')}}
              <strong><router-link v-bind:to="'/'+taxon.id+'/species'">{{numberOfSpecimen}}</router-link></strong><br />
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
      </div>
      <div v-if="isSpecies">
        <h3>{{$t('header.f_species_list')}}</h3>
        <div v-if="isDefinedAndNotEmpty(specimenIdentification)">
          <div style='font-size: 0.8em;' v-for="(item, idx) in allSpecies">
            &ensp;&ensp;&ensp;{{calculateSpeciesIdx(idx)}}. <em><router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link></em>
          </div>
          <div class="col-xs-12 col-xs-6 pagination-center">
            <b-pagination
              size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="searchParameters.watched.page" :per-page="searchParameters.watched.paginateBy">
            </b-pagination>
          </div>
        </div>
        <h3 v-else>Selle rühma all ei ole liike registreeritud</h3>
      </div>
      <div v-if="taxon_page && taxon_page.content">
        <h3>{{$t('header.f_taxon_intro')}}</h3>
        <i style='font-size: 0.8em;'>
          {{taxon_page.author_txt}} {{taxon_page.date_txt}}
        </i>
        <br />
        <div id="taxon-details" v-html="taxon_page.content"></div>
      </div>
      <!--REFERENCES-->
      <div style="margin:15px auto;" v-if="taxonOccurrence">
        <h3>{{$t('header.f_taxon_references')}}</h3>
        <ul>
          <li v-for=" reference in taxonOccurrence">
            <span class="openwinlink" @click="openUrl({parent_url:'http://geokogud.info/reference',object:reference.reference, width:500,height:500})">
              <strong>{{reference.reference__reference}}</strong>
            </span>. {{reference.reference__title}}.
            <!--$author, $year. $title. $journal_name: $number or $book, $pages. DOI:$doi.-->
            {{reference.reference__journal__journal_name}}:
            <span v-if="reference.reference__book != null">{{reference.reference__book}}</span>
            <span v-else>{{reference.reference__number}}</span>, {{reference.reference__pages}}. DOI:
            <a v-if="reference.reference__doi" :href="'http://dx.doi.org/'+reference.reference__doi" target="_blank">{{reference.reference__doi}}</a>
          </li>
        </ul>
      </div>
      <div>
        <!--{{taxon}}-->
        <!--{{parent}}-->
        <!--<br>{{description}}<br>-->
        <!--{{taxon_images}}-->
        <!--{{taxon_page}}-->
        <!--{{common_names}}-->
        <!--{{taxon_list}}-->
        <!--{{taxonOccurrence}}-->
        <!--{{children}}-->
        <!--{{siblings}}-->
        <!--{{synonyms}}-->
        <!--{{taxonTypeSpecimen}}-->
        <!--{{specimenIdentification}}-->
        <!--{{speciment_attachment}}-->
        <!--{{hierarchy}}-->
      </div>
      <image-gallery :images="taxon_images" v-if="taxon_images" ></image-gallery>

    <div id="taxon-main">
      <div id="taxon-left">
        <map-component  v-if="isMapDataLoaded"
                        :taxonOccurrence="taxonOccurrence"
                        :taxonTypeSpecimen="taxonTypeSpecimen"
                        :specimenIdentification="specimenIdentification"
        ></map-component>


        <div id="synonymy_list" v-if="synonyms && synonyms.length > 0">
          <h3>{{$t('header.f_species_synonymy')}}</h3>
          <ul>
            <li v-for="synonym in synonyms">
              <em>{{synonym.taxon_synonym}}</em>:
              {{synonym.author}}, {{synonym.year}}, lk. {{synonym.pages}},
              joon. {{synonym.figures}}
            </li>
          </ul>
        </div>
        <br />
        <div id="species_type_data_list" v-if = "taxonTypeSpecimen">
          <h3>{{$t('header.f_species_type_data')}}</h3>
          <ul>
            <li v-for="item in taxonTypeSpecimen">
              {{item.type_type__value}}:
              <span class="openwinlink" @click="openUrl({parent_url:'http://geokogud.info/specimen',object:item.specimen, width:500,height:500})">
                <strong>{{item.specimen_number}}</strong>
              </span> ,
              <span v-translate="{et:item.locality__locality, en: item.locality__locality_en}"></span>, {{item.specimen__depth}} m
            </li>
          </ul>
        </div>
        <br />
        <div id="linked_specimens_list" v-if="specimenIdentification">
          <h3>{{$t('header.f_species_linked_specimens')}}</h3>
          <ul>
            <li>
              <strong>
                <span class="openwinlink" @click="openUrl({parent_url:'http://geokogud.info',object:'search.php?taxon_1=1&taxon='+parent.taxon+'&currentTable=specimen', width:500,height:500})">
                   {{specimenIdentification.length}} {{$t('header.f_genus_identifications_link')}}
                </span>
              </strong><br />
            </li>
          </ul>
        </div>
        <br>
        <div id="identifications_list" v-if="hierarchy">
          <h3>{{$t('header.f_taxon_identifications')}}</h3>
          <ul>
            <li>
              <em>{{taxon.taxon}} {{taxon.author_year}}</em> :
              <span class="openwinlink" @click="openUrl({
              parent_url:'http://geokogud.info',
              object:'search.php?taxon_1=1&taxon='+taxon.taxon+' '+taxon.author_year +'&currentTable=specimen',
               width:500,height:500})">
                   {{numberOfSpecimen}} {{$t('header.f_genus_identifications_link')}}
                </span>
            </li>
          </ul>
        </div>
        <br>
      </div>
      <div id="taxon-right" >
        <div style="padding: 0 0 0 10px;">
          <h3>{{$t('header.f_taxon_images')}}</h3>
          <div class="photogallery">
            <div style="float: left; position: relative;" class="image_highlight"  v-for="(image,idx) in speciment_attachment"
                 @mouseover="showImageInfo('speciment_attachment_'+idx)" @mouseout="hideImageInfo('speciment_attachment_'+idx)">
              <a :href="image.path"  style="cursor:default" class="swipebox" >
                <img style="vertical-align: top;" :src="image.path"
                     :alt="image.name+','+ image.number" :title="image.name+','+ image.number" border="0"/></a>
              <div v-show="mouseOverImage === 'speciment_attachment_'+idx" class="image_label" >
                <div style="padding: 3px;">
                  <strong> {{image.number}} {{image.name}} <br />
                    <span  @click="openUrl({parent_url:'http://geokogud.info/specimen',object:image.id, width:500,height:500})"
                           class="openwinlink">
                        INFO</span>
                    |
                    <span @click="openUrl({parent_url:'http://geokogud.info/specimen_image',object:image.id, width:500,height:500})"
                          class="openwinlink">
                        IMAGE</span></strong></div>
              </div>
              <div style="cursor:pointer;position:absolute;top:0;right:0;z-index:1000;" v-show="mouseOverImage === 'speciment_attachment_'+idx"
                   onclick="$(this).siblings('a').trigger('dblclick');">
                <img src="/static/imgs/zoom_in.png" style="width: 32px;height: 32px;padding:2px 2px 0 0;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import MyMixin from '../../../mixins/mixin';
  import Spinner from 'vue-simple-spinner';
  import ImageGallery from "./ImageGallery";
  import TaxonomicalTree from "./TaxonomicalTree";
  import ClassificationTable from "./ClassificationTable";
  import MapComponent from "./MapComponent";

  export default {
    mixins: [MyMixin],
    name: 'item-page',
    components: {
      MapComponent,
      ClassificationTable,
      TaxonomicalTree,
      ImageGallery,
      Spinner
    },
    data () {
      return this.initialData()
    },
    computed: {

      sortedSiblings: function() {
        return _.orderBy(this.siblings,'taxon');
      },
      sortedSisters: function() {
        return _.orderBy(this.sister_taxa,'taxon');
      },
      sortedSistersWithoutCurrentTaxon: function() {
        return this.excludeCurrentTaxon(this.sortedSisters, this.$route.params.id);
      },

      taxon_page: function() {
        if (this.taxonPages ===undefined || this.taxonPages.length === 0) return {}
        if (this.lang_ ==='ee') return this.taxonPages[0];
        else if (this.lang_ ==='en') return this.taxonPages[1];
        else if (this.lang_ ==='fi') return this.taxonPages[2];
        else if (this.lang_ ==='se') return this.taxonPages[3];
      },
      mode () {
        return this.$localStorage.mode === 'in_baltoscandia'
      },
      isTaxonomicTreeIsLoaded: function() {
        return this.isSisterTaxaLoaded && this.isSiblingsLoaded && this.isHierarchyLoaded
      },

      isMapDataLoaded:function() {
        return this.isTaxonTypeSpecimenLoaded && this.isTaxonOccurrenceLoaded && this.isSpecimenIdentificationLoaded
      }

    },
    methods: {
      initialData : function() {
        return {
          taxon : {},
          parent : {},
          description : {},
          taxon_images : [],
          sister_taxa : {},
          taxonPages : [],
          common_names : {},
          taxon_list : {},
          taxonOccurrence : {},
          isTaxonOccurrenceLoaded: false,
          isTaxonTypeSpecimenLoaded: false,
          isSpecimenIdentificationLoaded:false,
          children : {},
          siblings : {},
          synonyms : {},
          taxonTypeSpecimen : null,
          specimenIdentification : {},
          speciment_attachment : {},
          hierarchy : {},
          isMapLoaded : false,
          lang_ : this.$localStorage.fossilsLang,
          numberOfSpecimen: {},
          requestingData: false,
          isSisterTaxaLoaded: false,
          isSiblingsLoaded: false,
          isHierarchyLoaded: false,
          taxonomicTree: {nodes: []},
          isSpecies: false,
          mouseOverImage: null,
          isTaxonImagesLoaded:false,
          imagesLength: 100,
          searchParameters: {
            watched: {
              page: 1,
              paginateBy: 10
            },
          },
          response: {
            count: 0,
            results: []
          }
        }
      },

      showImageInfo: function(imageIdx){
        this.mouseOverImage = imageIdx
      },
      hideImageInfo: function(imageIdx){
        this.mouseOverImage = null
      },

      calculateSpeciesIdx: function(idx) {
        return (idx+1) + this.searchParameters.watched.paginateBy * this.searchParameters.watched.page - this.searchParameters.watched.paginateBy
      },
      composeImageRequest : function(taxonImages) {
        if(taxonImages === undefined) return;
        let self = this;
        taxonImages.forEach(function(element) {
          if (element.uuid_filename && element.uuid_filename != null) {
            element.path = self.fileUrl + '/' + element.uuid_filename.substring(0,2)+'/'+ element.uuid_filename.substring(2,4)+'/'+ element.uuid_filename;
          }
          else if(element.attachment__uuid_filename && element.attachment__uuid_filename != null) {
            element.path = self.fileUrl + '/' + element.attachment__uuid_filename.substring(0,2)+'/'
              + element.attachment__uuid_filename.substring(2,4)+'/'+ element.attachment__uuid_filename;

          }

        });
        return taxonImages
      },

      openUrl : function(params) {
        window.open(params.parent_url + '/' + params.object, '', 'width=' + params.width +
          ',height=' + params.height,scrollbars)
      },
      excludeCurrentTaxon : function(list, itemID) {
        return list.filter(function(val, i) {
          return itemID.indexOf(val.id) === -1;
        }, this);
      },
      convertToTwoDecimal: function (value) {
        return value.toFixed(1)
      },
      /**************************
       *** REQUEST DATA START ***
       **************************/
      loadFullTaxonInfo: function () {
        this.requestingData = true;

        this.getRequest(this.apiUrl+'/taxon/'+this.$route.params.id).then((response) => {
          this.taxon = response ? response[0] : {};
          this.requestingData = false;

          if (this.isDefinedAndNotNull(this.taxon.parent)){
            this.getRequest(this.apiUrl+'/taxon/'+this.taxon.parent).then((response) => {
              this.parent = response ? response[0] : {};
              // Sister taxa
              this.getRequest(this.apiUrl+'/taxon/?parent_id='+this.taxon.parent+'&in_baltoscandia='+this.isInBaltoscandia(this.$localStorage.mode)+'&fields=taxon,id').then((response) => {
                this.sister_taxa = response;
                this.isSisterTaxaLoaded = true;
              });
            });
          }

          if(this.taxon.rank__rank_en !== 'species'){
            this.searchSpecies(this.searchParameters)
          }
        });

        this.getRequest(this.apiUrl+'/taxon/?parent='+this.$route.params.id+'&in_baltoscandia='+this.isInBaltoscandia(this.$localStorage.mode)).then((response) => {
          this.children = response;
          this.siblings = response;
          this.isSiblingsLoaded = true;
        });

        this.getRequest(this.apiUrl+'/taxon?id__in=1,29,38,60,61,62,259,1081,2104&fields=id,taxon,rank__rank,rank__rank_en').then((response) => {
          this.hierarchy = response;
          this.isHierarchyLoaded = true;
        });
        this.getRequest(this.apiUrl+'/taxon_image/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_images = this.composeImageRequest(response);
          this.isTaxonImagesLoaded = true

        });
        this.getRequest(this.apiUrl+'/taxon_page/?taxon='+this.$route.params.id).then((response) => {
          this.taxonPages = response;
        });

        this.getRequest(this.apiUrl+'/taxon_description/?taxon='+this.$route.params.id).then((response) => {
          this.description = response;
        });

        this.getRequest(this.apiUrl+'/taxon_common_name/?taxon='+this.$route.params.id).then((response) => {
          this.common_names = response;
        });

        this.getRequest(this.apiUrl+'/taxon_list/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_list = response;
        });

        this.getRequest(this.apiUrl+'/taxon_occurrence/?taxon='+this.$route.params.id).then((response) => {
          this.taxonOccurrence = response;
          this.isTaxonOccurrenceLoaded = true;
        });

        this.getRequest(this.apiUrl+'/taxon_synonym/?taxon='+this.$route.params.id).then((response) => {
          this.synonyms = response;
        });

        this.getRequest(this.apiUrl+'/taxon_type_specimen/?taxon='+this.$route.params.id).then((response) => {
          this.taxonTypeSpecimen = response;
          this.isTaxonTypeSpecimenLoaded = true;
        });

        this.getRequest(this.apiUrl+'/specimen/?specimenidentification__taxon_id='+this.$route.params.id+
          '&fields=id,locality_id,locality__locality,locality__locality_en,locality__longitude,locality__latitude&format=json').then((response) => {
          this.specimenIdentification = response;
          this.isSpecimenIdentificationLoaded = true;
        });

        this.getRequest(this.apiUrl+'/attachment/?specimen__specimenidentification__taxon__id='+this.$route.params.id+
          '&fields=id,specimen__specimen_id,database__acronym,uuid_filename&format=json').then((response) => {
          this.speciment_attachment = this.composeImageRequest(response);
        });

        /**************************
         *** REQUEST DATA END ***
         **************************/
      },

      searchSpecies: function(searchParameters) {
        let isInBaltoscandia = this.taxon.in_baltoscandia === true ? 1 : 0;
        this.getRequest(this.apiUrl+'/taxon/?hierarchy_string__istartswith='+this.taxon.hierarchy_string+'&rank__rank_en=species&in_baltoscandia='+isInBaltoscandia+'&fields=taxon,id&page='+searchParameters.watched.page+'&paginate_by='+searchParameters.watched.paginateBy, true).then((response) => {
          this.isSpecies = this.$route.meta.isSpecies;
          this.allSpecies = response.results;
          this.numberOfSpecimen = response.count;
          this.response.count = response.count
          this.response.results = response.results
        });
      },

      reloadPage: function() {
        Object.assign(this.$data, this.initialData());
        this.loadFullTaxonInfo();
      }
    },

    watch: {
      '$route.params.id': {
        handler : function (newval, oldval) {
          Object.assign(this.$data, this.initialData())
          this.loadFullTaxonInfo()
        }
      },
      '$route.meta.isSpecies': {
        handler : function (newval, oldval) {
          Object.assign(this.$data, this.initialData())
          this.loadFullTaxonInfo()
        }
      },
      '$route.meta.mode': {
        handler : function (newval, oldval) {
          if (newval === 'inBaltoscania')
            this.inBaltoscania = true;
          Object.assign(this.$data, this.initialData())
          this.loadFullTaxonInfo()
        }
      },

      'searchParameters.watched': {
        handler: function () {
          this.searchSpecies(this.searchParameters)
        },
        deep: true
      },
      '$localStorage.mode': {
        handler: function () {
          this.reloadPage()
        },
        deep: true
      }
    },
    updated: function() {
      this.lang_ = this.$localStorage.fossilsLang
    },
    created(){
      Object.assign(this.$data, this.initialData());
      this.loadFullTaxonInfo();
    },
  }
</script>
