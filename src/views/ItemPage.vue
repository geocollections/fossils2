<template>
    <div class="container-fluid">
    <h3>{{$t('header.zero')}}</h3>
    <taxon-title></taxon-title>
    <taxon-tabs></taxon-tabs>
    <div class="tab-content">
      <tab-overview v-on:mounted="preventTwiceMounting"></tab-overview>
      <tab-names></tab-names>
      <tab-gallery></tab-gallery>
      <tab-classification></tab-classification>
      <tab-literature></tab-literature>
      <tab-species v-if="taxon.rank__rank_en !== 'species'"></tab-species>
    </div>
    <!-- content -->
    <div id="content-left">



      <div id="taxon-main">
        <div id="taxon-left">
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
        </div>

      </div>
    </div>
    <!-- content -->
    </div>
</template>

<script>
    import Vue from 'vue'
    import Spinner from '../components/Spinner.vue';
    import TaxonTabs from "../components/TaxonTabs.vue";
    import TaxonTitle from "../components/TaxonTitle.vue";
    import TabOverview from "../components/tabs/TabOverview.vue";
    import TabNames from "../components/tabs/TabNames.vue";
    import TabGallery from "../components/tabs/TabGallery.vue";
    import TabClassification from "../components/tabs/TabClassification.vue";
    import TaxonomicalTree from "../components/TaxonomicalTree.vue";
    import TabLiterature from "../components/tabs/TabLiterature.vue";
    import TabSpecies from "../components/tabs/TabSpecies.vue";
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
            TabSpecies,
            TabLiterature,
            TaxonomicalTree,
            TabClassification,
            TabGallery,
            TabNames,
            TabOverview,
            TaxonTitle,
            TaxonTabs,
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
            taxonList () { return this.$store.state.activeItem['taxonList'] },
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

            commonNamesStrings () {
                return map(this.commonNames, 'name');
            },
            childrenStrings () {
                return map(this.sortedSiblings, 'taxon');
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
            let process = 'client'
            this.$store.commit('SET_PROCESS',{process})
            this.$store.dispatch('FETCH_RANKS');
            Object.assign(this.$data, this.initialData());
            this.loadFullTaxonInfo()
        },

        methods: {
            initialData: function () {
                return {
                    parent: {},
                    images: [],
                    isSpecimen: false,
                    sister_taxa: {},
                    hierarchy: {},
                    numberOfSpecimen: {},
                    requestingData: false,
                    isSisterTaxaLoaded: false,
                    isHierarchyLoaded: false,
                    taxonomicTree: {nodes: []},
                    mouseOverImage: null,
                    isTaxonImagesLoaded: false,
                    imagesLength: 100,
                    allSpecies:[],
                    isMapLoaded: false,
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
                if(['None','Phylum', 'Kingdom', 'None', 'Class', 'Order'].includes(this.taxon.rank__rank_en) ) {
                    fetchImages(this.$route.params.id).then((response) => {
                        this.images = this.composeImageRequest(response.results)
                        this.isTaxonImagesLoaded = true
                    });

                }
                if(['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en) && this.isDefinedAndNotNull(this.taxon.taxon)) {
                    this.isMapLoaded = true
                    fetchAttachment(this.taxon.taxon).then((response) => {
                        this.isSpecimen = true;
                        this.images = this.composeImageRequest(response.results);
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
            //todo: utils
            composeImageRequest : function(taxonImages) {
                if(taxonImages === undefined || taxonImages === {} || taxonImages.length === 0) ;
                if (taxonImages.length > 0) {
                    let taxon = this.taxon
                    let fileUrl = 'http://files.geocollections.info';
                    taxonImages.forEach(function(el) {
                        if (el.uuid_filename && el.uuid_filename != null) {
                            el.thumbnail = fileUrl + '/small/' + el.uuid_filename.substring(0,2)+'/'+ el.uuid_filename.substring(2,4)+'/'+ el.uuid_filename;
                            el.src = fileUrl + '/small/' + el.uuid_filename.substring(0,2)+'/'+ el.uuid_filename.substring(2,4)+'/'+ el.uuid_filename;
                            el.caption = el.database__acronym +' '+ el.specimen__specimen_id + ' '
                                + taxon.taxon+ ' ' + taxon.author_year
                        }
                        else if(el.attachment__uuid_filename && el.attachment__uuid_filename != null) {
                            el.thumbnail = fileUrl + '/small/' + el.attachment__uuid_filename.substring(0,2)+'/'
                                + el.attachment__uuid_filename.substring(2,4)+'/'+ el.attachment__uuid_filename;
                            el.src = fileUrl + '/small/' + el.attachment__uuid_filename.substring(0,2)+'/'
                                + el.attachment__uuid_filename.substring(2,4)+'/'+ el.attachment__uuid_filename;


                            el.caption = el.link__taxon;
                        }
                    });
                    return taxonImages
                }
                return []
            },

            searchSpecies: function () {
                fetchSpecies(this.taxon.hierarchy_string,this.$store.state.mode, this.$store.state.searchParameters).then((response) => {
                    this.allSpecies = response.results;
                    this.numberOfSpecimen = response.count;
                    this.response.count = response.count
                    this.response.results = response.results
                });
            },
            preventTwiceMounting () { this.isMapLoaded = false}
        },

        watch: {
            '$route.params.id': {
                handler: function (newval, oldval) {
                    Object.assign(this.$data, this.initialData())
                    this.loadFullTaxonInfo()
                }
            },

            '$store.state.activeTab': {
                handler : function (newval, oldval) {
                    if(newval === 'species') {
                        Object.assign(this.$data, this.initialData())
                        this.loadFullTaxonInfo()
                    }
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
