<template>
  <div id="content">
    <!--<spinner :show="loading"></spinner>-->
    <h3>{{$t('header.zero')}}</h3>
     <!-- Taxon info -->
    <div id="taxon-box" v-if="taxon !== undefined" >
      <div id="taxon-header">
        <div id="fossilgroup-icon">
          <router-link v-bind:to="'/'+taxon.fossil_group__id" v-if="taxon.fossil_group__id != null">
            <img border="0" :src="'/static/fossilgroups/'+taxon.fossil_group__id+'.png'" :alt="taxon.fossil_group__taxon"
                 :title="taxon.fossil_group__taxon" style="height: 80px; margin-top: 0px; padding-right: 0px;" />
            <br />{{ taxon.fossil_group__taxon }}
          </router-link>
          <router-link v-bind:to="'/'+taxon.id" v-else-if="taxon.is_fossil_group == 1">
            <img border="0" :src="'/static/fossilgroups/'+ taxon.id+'.png'" :alt="taxon.taxon"
                 :title="taxon.taxon" style="height: 95px; margin-top: 0; padding-right: 0px;" />
            <br />{{taxon.fossil_group__taxon}}
          </router-link>
        </div>

        <div id="taxon-title">
          <h1 style='color: #333 !important;'>
            <span style="color:#333 !important; font-weight:bold !important;"> {{taxonTitle}} </span><br />

            <div v-if="taxon.fossil_group__id && (taxon.rank__rank_en == 'Species' || taxon.rank__rank_en == 'Genus')"> {{$t('header.f_fossil_group')}}:
              <router-link v-bind:to="'/'+taxon.fossil_group__id">{{taxon.fossil_group__taxon}}</router-link></div>
            <span style="font-size: 0.7em !important;" v-translate="{ et: taxon.rank__rank, en: taxon.rank__rank_en }"></span>
            <span style="font-size: 18pt"> {{taxon.taxon}}</span>
            <span style="font-size: 0.7em;"> {{taxon.author_year}}</span>
          </h1>
          <div class="taxon_names" >
            <span v-if="commonNames.length > 0" v-for="item in filteredCommonNames">
              <strong>{{item.language}}</strong>: {{item.name}};
            </span>
          </div>

        </div>
      </div>
    </div>
    <!-- Taxon info ends -->

    <!-- content left ends and menu begins -->
    <div id="menu" v-show="requestingData == false">
      <div id="species_hierarchy_container" style="position: relative; ">
        <h3>{{$t('header.fossils_classification')}}</h3>
        <classification-table v-if="isClassificationTableLoaded"
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
                          :isHierarchyLoaded_ = "isHierarchyLoaded"
        ></taxonomical-tree>

      </div>
      <br />
      <div v-if="(taxonPage && taxonPage.link_wikipedia != null)
      || taxon.taxon_id_tol != null|| taxon.taxon_id_eol != null|| taxon.taxon_id_nrm!= null || taxon.taxon_id_plutof!= null || taxon.taxon_id_pbdb != null">
        <h3>{{$t('header.f_weblinks')}}</h3>
        <div id="taxon-links">
          <span v-if="taxonPage && taxonPage.link_wikipedia != null" >
            <a :href="'http://'+$store.state.lang+'.wikipedia.org/wiki/'+taxonPage.link_wikipedia">{{$t('header.f_link_wikipedia')}}</a><br/>
          </span>
          <span v-if="taxon.taxon_id_tol != null" >
            <a :href="'http://tolweb.org/'+taxon.taxon_id_tol">{{$t('header.f_link_tolweb')}}</a><br/>
          </span>
          <span v-if="taxon.taxon_id_eol != null" >
            <a :href="'http://www.eol.org/pages/'+taxon.taxon_id_eol">{{$t('header.f_link_eol')}}</a><br/>
          </span>
          <span v-if="taxon.taxon_id_nrm != null" >
            <a v-if="taxon.taxon_id_nrm != null" :href="'http://naturforskaren.se/species/'+taxon.taxon_id_nrm">{{$t('header.f_link_naturforskaren')}}</a><br/>
          </span>
          <span v-if="taxon.taxon_id_plutof != null" >
            <a v-if="taxon.taxon_id_plutof != null" :href="'http://elurikkus.ut.ee/elr_tree.php?id='+taxon.taxon_id_plutof">{{$t('header.f_link_plutof')}}</a><br/>
          </span>
          <span v-if="taxon.taxon_id_pbdb != null" >
            <a v-if="taxon.taxon_id_pbdb != null" :href="'https://paleobiodb.org/cgi-bin/bridge.pl?a=checkTaxonInfo&taxon_no='+taxon.taxon_id_pbdb">Paleobiology Database</a>
          </span>
        </div>
      </div>
    </div >
    <!-- content left ends and menu ends -->

    <!-- content -->
    <div id="content-left" v-show="requestingData === false" >
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
              <span v-if="$store.state.mode === 'in_baltoscandia'">{{$t('header.f_baltic_species')}}</span>
              <span v-else>{{$t('header.f_global_species')}}</span>
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
            | <span v-translate="{et:item.stratigraphy_base__stratigraphy,  en: item.stratigraphy_base__stratigraphy_en}"></span>
            <span v-if="item.stratigraphy_top__stratigraphy !=null"> → </span><span v-translate="{et:item.stratigraphy_top__stratigraphy,  en: item.stratigraphy_top__stratigraphy_en}"></span>
          </div>
          <div class="col-xs-12 col-xs-6 pagination-center">
            <b-pagination
                    size="md" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="$store.state.searchParameters.watched.page" :per-page="$store.state.searchParameters.watched.paginateBy">
            </b-pagination>
          </div>
        </div>
        <h3 v-else>Selle rühma all ei ole liike registreeritud</h3>
      </div>
      <div v-if="taxonPage && taxonPage.content">
        <h3>{{$t('header.f_taxon_intro')}}</h3>
        <i style='font-size: 0.8em;'>
          {{taxonPage.author_txt}} {{taxonPage.date_txt}}
        </i>
        <br />
        <div id="taxon-details" v-html="taxonPage.content"></div>
      </div>
      <!--REFERENCES-->
      <div style="margin:15px auto;" v-if="taxonOccurrence">
        <h3>{{$t('header.f_taxon_references')}}</h3>
        <ul>
          <li v-for=" reference in taxonOccurrence">
            <span class="openwinlink" @click="openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
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

      <div v-if="['None','Phylum', 'Kingdom', 'None', 'Class', 'Order'].includes(taxon.rank__rank_en) && taxonImages !== undefined ">
        <image-gallery :images="taxonImages"></image-gallery>
      </div>


      <div id="taxon-main">
        <div id="taxon-left">
          <map-component v-if="isMapDataLoaded"
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
          <br/>
          <div id="distribution_references" v-if="false">
            <h3>{{$t('header.f_species_distribution_references')}}</h3>
            <ul>
              <li v-for=" reference in taxonOccurrence">
            <span class="openwinlink" @click="openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
              <strong>{{reference.reference__reference}}</strong>
              <!--<span v-translate="{et:reference.sample__locality__locality,en:reference.sample__locality__locality_en}"></span>-->
              <!--{{reference.sample__depth}} - {{reference.sample__depth_interval}}-->
            </span>
              </li>
            </ul>
          </div>
          <div id="distribution_samples" v-if="false">
            <h3>{{$t('header.f_species_distribution_samples')}}</h3>
            <ul>
              <li>
                <!--<a href='http://geokogud.info/locality/{{sample.locality_id}}' target='_blank'>{{sample.locality}}</a>
                            {{sample.depth}}:
                            <a target='_blank' href='http://geokogud.info/search.php?taxon_1=1&taxon={{sample.species_name_original}}&taxon_2=1&locality_1=1&locality={{sample.locality}}&locality_2=1&currentTable=sample'>
                            {{sample.num}} {{strings_fossils.f_species_link_samples}}
                            </a>-->
              </li>
            </ul>
          </div>
          <div id="distribution_conop" v-if="false">
            <h3>{{$t('header.f_species_distribution_samples')}} (CONOP):</h3>
            <ul>
              <li>

              </li>
            </ul>
          </div>
          <br />
          <br />
          <div id="taxon_description" v-if = "description && description.description">
            <h3>{{$t('header.f_taxon_description_diagnosis')}} (<span class="openwinlink" @click="openUrl({parent_url:'http://geocollections.info/reference',object:description.reference, width:500,height:500})">
              <strong>{{description.reference__reference}}</strong>)
          </span></h3>

            <div v-html="description.description"></div>
          </div>
          <br>
        </div>
        <div id="taxon-right" v-if="['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en)">
          <div style="padding: 0 0 0 10px;">
            <h3>{{$t('header.f_taxon_images')}}</h3>
            <image-gallery :images="speciment_attachment" v-if="speciment_attachment" :isSpecimen="true"></image-gallery>
          </div>
        </div>
      </div>
    </div>
    <!-- content -->
  </div>
</template>

<script>
    import Vue from 'vue'
    import Spinner from '../components/Spinner.vue'
    import TaxonomicalTree from "../components/TaxonomicalTree.vue";
    import ClassificationTable from "../components/ClassificationTable.vue";
    import ImageGallery from "../components/ImageGallery.vue";
    import MapComponent from "../components/MapComponent.vue";
    import filter from 'lodash/filter';
    import orderBy from 'lodash/orderBy';
    import map from 'lodash/map';
    import {
        fetchTaxon,
        fetchSisterTaxa,
        fetchSpecies,
        fetchHierarchy,
        fetchImages,
        fetchAttachment
    } from '../api'

    export default {
        name: 'item-page',
        components: {
            TaxonomicalTree,
            ClassificationTable,
            ImageGallery,
            MapComponent,
            Spinner
        },
        data() {
            return this.initialData()
        },

        computed: {
            taxon () { return this.$store.state.activeItem['taxon'] },
            commonNames () { return this.$store.state.activeItem['commonNames'] },
            taxonPages () { return this.$store.state.activeItem['taxonPage'] },
            taxonTypeSpecimen () { return this.$store.state.activeItem['typeSpecimen'] },
            specimenIdentification () { return this.$store.state.activeItem['specimenIdentification'] },
            taxonOccurrence () { return this.$store.state.activeItem['taxonOccurrence'] },
            siblings () {
                return this.$store.state.activeItem['children'] },
            synonyms () { return this.$store.state.activeItem['synonims'] },
            description () { return this.$store.state.activeItem['description'] },
            taxonList () { return this.$store.state.activeItem['taxonList'] },
            taxonTitle: function() {
                let lang = this.$store.state.lang;
                if (this.taxonPage && this.taxonPage.title)
                    return this.taxonPage.title
                let activeCommonName = filter(this.commonNames, function(o) {
                    return o.language === lang && o.is_preferred === 1});

                if (activeCommonName.length > 0)
                    return activeCommonName[0].name
            },
            taxonPage: function() {
                if (this.taxonPages === undefined || this.taxonPages.length === 0) return {}
                let lang = this.$store.state.lang;
                if (lang ==='et') return this.taxonPages[0];
                else if (lang ==='en') return this.taxonPages[1];
                else if (lang ==='fi') return this.taxonPages[2];
                else if (lang ==='se') return this.taxonPages[3];
            },
            filteredCommonNames: function() {
                let lang = this.$store.state.lang;
                return filter(this.commonNames, function(o) {
                    return o.language !== lang});
            },

            sortedSiblings: function() {
                return orderBy(this.siblings,'taxon');
            },
            sortedSisters: function() {
                return orderBy(this.sister_taxa,'taxon');
            },
            sortedSistersWithoutCurrentTaxon: function() {
                return this.excludeCurrentTaxon(this.sortedSisters, this.$route.params.id);
            },

            isTaxonomicTreeIsLoaded: function() {
                return this.isSisterTaxaLoaded && this.isHierarchyLoaded
            },

            isMapDataLoaded:function() {
                return ['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en)
                    && this.isTaxonOccurrenceLoaded
            },
            commonNamesStrings () {
                return map(this.commonNames, 'name');
            },
            childrenStrings () {
                return map(this.sortedSiblings, 'taxon');
            },
            isClassificationTableLoaded: function () {
                return this.isHierarchyLoaded && this.$store.state.lists.ranks.length > 0
            },
            meta () {
                return [this.taxon.parent__taxon, this.taxon.taxon, this.taxon.fossil_group__taxon,
                    this.commonNamesStrings, this.childrenStrings].join(", ")
            }

        },

         asyncData ({ store, route : {params: { id }}}) {
            return Promise.all([
                store.dispatch('FETCH_TAXON', { id }),
                store.dispatch('FETCH_COMMON_NAMES', { id }),
                store.dispatch('FETCH_TAXON_PAGE', { id }),
                store.dispatch('FETCH_TYPE_SPECIMEN', { id }),
                store.dispatch('FETCH_TYPE_IDENTIFICATION', { id }),
                store.dispatch('FETCH_TAXON_OCCURRENCE', { id }),
                store.dispatch('FETCH_CHILDREN', { id }),
                store.dispatch('FETCH_SYNONIMS', { id }),
                store.dispatch('FETCH_TAXON_LIST', { id }),
                store.dispatch('FETCH_DESCRIPTION', { id })
            ])

        },

        mounted () {
            this.$store.dispatch('FETCH_RANKS');
            Object.assign(this.$data, this.initialData());
            this.loadFullTaxonInfo()
        },

        methods: {
            initialData: function () {
                return {
                    loading: true,
                    parent: {},
                    taxonImages: [],
                    sister_taxa: {},
                    speciment_attachment: {},
                    hierarchy: {},
                    isMapLoaded: false,
                    numberOfSpecimen: {},
                    requestingData: false,
                    isSisterTaxaLoaded: false,
                    isHierarchyLoaded: false,
                    taxonomicTree: {nodes: []},
                    isSpecies: false,
                    mouseOverImage: null,
                    isTaxonImagesLoaded: false,
                    imagesLength: 100,
                    response: {
                        count: 0,
                        results: []
                    }
                }
            },
            loadFullTaxonInfo: function(){
                if (this.isDefinedAndNotNull(this.taxon.parent)) {
                    fetchTaxon(this.taxon.parent).then((response) => {
                        this.parent = response.results ? response.results[0] : {};
                        // Sister taxa
                    });

                    fetchSisterTaxa(this.taxon.parent, this.$store.state.mode).then((response) => {
                        this.sister_taxa = response.results;
                        this.isSisterTaxaLoaded = true;
                    });

                }

                if (this.taxon.rank__rank_en !== 'species') {
                    this.searchSpecies()
                }

                fetchHierarchy(this.formatHierarchyString(this.taxon.hierarchy_string)).then((response) => {
                    this.hierarchy = response.results;
                    this.isHierarchyLoaded = true;
                });

                fetchImages(this.$route.params.id).then((response) => {
                    this.taxonImages = response.results;
                    this.isTaxonImagesLoaded = true
                });
                if (this.isDefinedAndNotNull(this.taxon.taxon)) {
                    fetchAttachment(this.taxon.taxon).then((response) => {
                        this.speciment_attachment = response.results;
                    });
                }

            },
            //todo: utils
            isDefinedAndNotEmpty(value) {
                return !!value && value.length > 0
            },

            //todo: utils
            isDefinedAndNotNull(value) {
                return !!value && value !== null
            },
            calculateSpeciesIdx: function (idx) {
                return (idx + 1) + this.$store.state.searchParameters.watched.paginateBy * this.$store.state.searchParameters.watched.page - this.$store.state.searchParameters.watched.paginateBy
            },
            //todo: utils
            openUrl: function (params) {
                window.open(params.parent_url + '/' + params.object, '', 'width=' + params.width +
                    ',height=' + params.height, scrollbars)
            },
            excludeCurrentTaxon: function (list, itemID) {
                return list.filter(function (val, i) {
                    return itemID.indexOf(val.id) === -1;
                }, this);
            },
            //todo: utils
            convertToTwoDecimal: function (value) {
                return value.toFixed(1)
            },
            //todo: utils
            formatHierarchyString: function(value) {
                return value.replace(/-/g, ',');
            },

            searchSpecies: function () {
                fetchSpecies(this.taxon.hierarchy_string,this.$store.state.mode, this.$store.state.searchParameters).then((response) => {
                    this.isSpecies = this.$route.meta.isSpecies;
                    this.allSpecies = response.results;
                    this.numberOfSpecimen = response.count;
                    this.response.count = response.count
                    this.response.results = response.results
                });
            }
        },

        watch: {
            '$route.params.id': {
                handler: function (newval, oldval) {
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

            '$store.state.searchParameters.watched': {
                handler: function () {
                    this.searchSpecies()
                },
                deep: true
            },
            '$store.state.mode': {
                handler: function () {
                    this.searchSpecies()
                },
                deep: true
            }

        },

        metaInfo () {
            return {
                title: this.taxon.taxon,
                meta:  [{ vmid: 'keywords', name: 'keywords', content: this.meta},
                    { vmid: 'description', name: 'description', content: ''}]
            }
        },
    }
</script>
