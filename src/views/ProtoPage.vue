<template>
   <div v-if="taxon">
       <proto-header></proto-header>
       <b-container fluid>
           <b-row class="p-5">
               <div class="col-lg-8">
                   <div class="mx-auto row m-3">
                       <div class="col-lg-2">
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
                       <div :class="'col-lg-10'">
                           <span> {{taxonTitle}} </span><br />
                           <div v-if="taxon.fossil_group__id && (taxon.rank__rank_en === 'Species' || taxon.rank__rank_en === 'Genus')"> {{$t('header.f_fossil_group')}}:
                               <router-link v-bind:to="'/'+taxon.fossil_group__id">{{taxon.fossil_group__taxon}}</router-link></div>
                           <span style="font-size: 0.7em;" v-translate="{ et: taxon.rank__rank, en: taxon.rank__rank_en }"></span>
                           <span style="font-size: 18pt"> {{taxon.taxon}}</span>
                           <span style="font-size: 0.7em;"> {{taxon.author_year}}</span>
                           <span class="row p-3" v-if="filteredCommonNames && filteredCommonNames.length > 0">
                                        <span  v-for="item in filteredCommonNames"><strong>{{item.language}}</strong>: {{item.name}}; &ensp;</span>
                                    </span>
                           <span class="row p-3" v-if="filteredCommonNames && filteredCommonNames.length === 0"></span>
                       </div>
                   </div>
                   <b-row class="m-1">
                       <div class="card rounded-0" style="width: 100%">
                           <!--<div class="card-header"></div>-->
                           <div class="card-body">
                               <div>
                                   Taxon ID: <strong>{{taxon.id}}</strong>
                                   <span v-if="taxon.date_added"> | {{taxon.date_added | moment('YYYY-MM-DD')}}</span>
                                   <span v-if="taxon.date_changed">/ {{taxon.date_changed | moment('YYYY-MM-DD')}}</span>
                                   <span v-if="taxon.user_authorized"> | {{taxon.user_authorized | moment('YYYY-MM-DD')}}</span>
                               </div>
                               <div v-if="taxon.id != 29">
                                   {{$t('header.f_belongs_to')}}:
                                   <em><router-link v-bind:to="'/'+parent.id">{{parent.taxon}}</router-link></em>
                                   <div v-if="isDefinedAndNotEmpty(sortedSistersWithoutCurrentTaxon)">{{$t('header.f_sister_taxa')}}:
                                       <span v-for="(item,idx) in sortedSistersWithoutCurrentTaxon">
                                    <em><router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link></em>
                                    <span v-if = 'idx != sortedSistersWithoutCurrentTaxon.length -1'> | </span>
                                </span>
                                   </div>
                                   <div v-if="isDefinedAndNotEmpty(sortedSiblings)">{{$t('header.f_contains')}}:
                                       <span v-if="sortedSiblings" v-for="(sibling, idx) in sortedSiblings">
                                    <router-link v-bind:to="'/'+sibling.id">{{sibling.taxon}}</router-link>
                                    <span v-if = 'idx != sortedSiblings.length -1'> | </span>
                                </span>
                                   </div>
                                   <div v-if="taxon.stratigraphy_base__stratigraphy || taxon.stratigraphy_top__stratigraphy"> {{$t('header.f_stratigraphical_distribution')}}:
                                       <strong>
                                           <button class="btn btn-link" v-if="taxon.stratigraphy_base__stratigraphy"
                                                   @click="openUrl({parent_url:'http://geokogud.info/stratigraphy',object:taxon.stratigraphy_base_id, width:500,height:500})">
                                               {{taxon.stratigraphy_base__stratigraphy}}</button>
                                           <span v-if="taxon.stratigraphy_top__stratigraphy != null && taxon.stratigraphy_base__stratigraphy != null">&ndash;</span>
                                           <button class="btn btn-link" v-if="taxon.stratigraphy_top__stratigraphy
                                            && taxon.stratigraphy_base__stratigraphy != taxon.stratigraphy_top__stratigraphy"
                                                   @click="openUrl({parent_url:'http://geokogud.info/stratigraphy',object:taxon.stratigraphy_top_id, width:500,height:500})">
                                               {{taxon.stratigraphy_top__stratigraphy}}
                                           </button>
                                           <span v-if="taxon.stratigraphy_base__age_base != null">| ~ {{convertToTwoDecimal(taxon.stratigraphy_base__age_base)}}</span>
                                           <span v-if="taxon.stratigraphy_top__age_top != null"> &ndash; {{convertToTwoDecimal(taxon.stratigraphy_top__age_top)}} Ma</span>
                                       </strong>
                                       <br />
                                   </div>
                                   <div v-if="taxon.rank__rank_en != null && taxon.rank__rank_en != 'Species'">
                                       <span v-if="$store.state.mode === 'in_baltoscandia'">{{$t('header.f_baltic_species')}}</span>
                                       <span v-else>{{$t('header.f_global_species')}}</span>
                                       <strong><a href="#tab-species"  v-on:click="setActiveTab('species')">{{numberOfSpecimen}}</a></strong>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if="taxonPage && taxonPage.content" >
                       <div class="card rounded-0" style="width: 100%">
                           <div class="card-header">{{$t('header.f_taxon_intro')}}</div>
                           <div class="card-body">
                               <div id="taxon-details" v-html="taxonPage.content"></div>
                           </div>
                           <div class="card-footer">
                               <i style='font-size: 0.8em;'> {{taxonPage.author_txt}} {{taxonPage.date_txt}}</i>
                           </div>
                       </div>
                   </b-row>
                   <!-- Row contains description-->
                   <b-row class="m-1" v-if = "description && description.description">
                       <div class="col-lg-12">
                           <div>
                               <h3>{{$t('header.f_taxon_description_diagnosis')}} (<button class="btn btn-link"
                                                                                           @click="openUrl({parent_url:'http://geocollections.info/reference',object:description.reference, width:500,height:500})">
                                   <strong>{{description.reference__reference}}</strong>)</button></h3>
                               <div v-html="description.description"></div>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if = "['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en) && (taxonTypeSpecimen)">
                           <div class="card rounded-0" style="width: 100%" >
                               <div class="card-header">{{$t('header.f_species_type_data')}}</div>
                               <div class="card-body">
                                   <ul>
                                       <li v-for="item in taxonTypeSpecimen"> {{item.type_type__value}}:
                                           <button class="btn btn-link" @click="openUrl({parent_url:'http://geokogud.info/specimen',object:item.specimen, width:500,height:500})">
                                               <strong>{{item.specimen_number}}</strong>
                                           </button> ,
                                           <span v-translate="{et:item.locality__locality, en: item.locality__locality_en}"></span>, {{item.specimen__depth}} m
                                       </li>
                                   </ul>
                               </div>
                           </div>
                   </b-row>
                   <b-row class="m-1"  v-if = "['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en) && (taxonTypeSpecimen)">
                       <div class="card  rounded-0" style="width: 100%" >
                           <div class="card-header">{{$t('header.f_species_linked_specimens')}}</div>
                           <div class="card-body">
                               <ul>
                                   <li><strong>
                                       <button class="btn btn-link" @click="openUrl({parent_url:'http://geokogud.info',object:'search.php?taxon_1=1&taxon='+parent.taxon+'&currentTable=specimen', width:500,height:500})">
                                           {{specimenIdentification.length}} {{$t('header.f_genus_identifications_link')}}
                                       </button>
                                   </strong>
                                   </li>
                               </ul>
                           </div>

                       </div>
                   </b-row>

                   <b-row class="m-1" v-if = "['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en) && (taxonOccurrence)">
                           <div class="card rounded-0" style="width:100%;">
                               <div class="card-header">{{$t('header.f_species_distribution_references')}}</div>
                               <div class="card-body">
                                   <ul>
                                       <li v-for=" reference in taxonOccurrence">
                                           <button class="btn btn-link" @click="openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
                                               <strong>{{reference.reference__reference}}</strong>
                                           </button>
                                           <span v-translate="{et:reference.locality__locality,en:reference.locality__locality_en}"></span>
                                           <span v-if="reference.depth || reference.depth_interval">{{reference.depth}} - {{reference.depth_interval}}</span>
                                           <span v-translate="{et:reference.stratigraphy_base__stratigraphy,en:reference.stratigraphy_base__stratigraphy_en}"></span>
                                       </li>
                                   </ul>
                               </div>

                           </div>
                   </b-row>

                   <b-row class="m-1" v-if = "['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en) && (numberOfSpecimen)">
                       <div class="card rounded-0" style="width:100%;">
                           <div class="card-header">{{$t('header.f_taxon_identifications')}}</div>
                           <div class="card-body">
                               <ul>
                                   <li>
                                       <em>{{taxon.taxon}} {{taxon.author_year}}</em> :
                                       <button class="btn btn-link" @click="openUrl({
                                  parent_url:'http://geokogud.info',
                                  object:'search.php?taxon_1=1&taxon='+taxon.taxon+' '+taxon.author_year +'&currentTable=specimen',
                                   width:500,height:500})">
                                           {{numberOfSpecimen}} {{$t('header.f_genus_identifications_link')}}
                                       </button>
                                   </li>
                               </ul>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if="synonyms && synonyms.length > 0">
                       <div class="col-lg-12" style="width: 100%">
                           <div class="card">
                               <div class="card-header">{{$t('header.f_species_synonymy')}}</div>
                               <div class="card-body">
                                   <ul>
                                       <li v-for="synonym in synonyms">
                                           <em>{{synonym.taxon_synonym}}</em>:
                                           {{synonym.author}}, {{synonym.year}}, lk. {{synonym.pages}},
                                           joon. {{synonym.figures}}
                                       </li>
                                   </ul>
                               </div>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if="taxonOccurrence">
                       <div class="card rounded-0" style="width: 100%">
                           <div class="card-header">{{$t('header.f_taxon_references')}}</div>
                           <div class="card-body">
                               <ul>
                                   <li v-for=" reference in taxonOccurrence">
                                       <button class="btn btn-link" @click="openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
                                           <strong>{{reference.reference__reference}}</strong>
                                       </button>
                                       <!--$author, $year. $title. $journal_name: $number or $book, $pages. DOI:$doi.-->
                                       <span>. {{reference.reference__title}}.{{reference.reference__journal__journal_name}}:</span>
                                       <span v-if="reference.reference__book != null">{{reference.reference__book}}</span>
                                       <span v-else>{{reference.reference__number}}</span>, {{reference.reference__pages}}. DOI:
                                       <a v-if="reference.reference__doi" :href="'http://dx.doi.org/'+reference.reference__doi" target="_blank">{{reference.reference__doi}}</a>
                                   </li>
                               </ul></div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if="taxon.rank__rank_en !== 'Species'">
                       <div class="card rounded-0"   style="width: 100%">
                           <div class="card-header">{{$t('header.f_species_list')}}</div>
                           <div class="card-body"  v-if="allSpecies && allSpecies.length > 0">
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
                               <div v-else>Selle rühma all ei ole liike registreeritud</div>
                           </div>
                       </div>
                   </b-row>
                   <b-row>
                       <!--???-->
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
                   </b-row>

               </div>
               <div class="col-lg-4">
                   <b-row class="mt-4">
                       <lingallery v-if="images && images.length > 0 && $router.currentRoute.name === 'Proto' " ref="lingallery" :width="400" :height="350" :items="images "/>
                   </b-row>

                   <b-row>

                   </b-row>
                   <b-row class="mt-3" >
                       <div class="card rounded-0"  style="width: 100%">
                           <div class="card-header">{{$t('header.fossils_classification')}}</div>
                           <div class="card-body">
                               <classification-table :hierarchy ="hierarchy"
                                                     :parent = "parent"
                                                     :taxon = "taxon"
                               ></classification-table>
                           </div>
                       </div>
                    </b-row>
                   <b-row class="mt-1" v-if="isTaxonomicTreeIsLoaded">
                       <div class="card rounded-0" style="width: 100%">
                           <div class="card-header">{{$t('header.fossils_browse_tree')}}</div>
                           <div class="card-body">
                               <taxonomical-tree :taxon_="taxon"
                                                 :parent_="parent"
                                                 :hierarchy_="hierarchy"
                                                 :sortedSistersWithoutCurrentTaxon_="sortedSistersWithoutCurrentTaxon"
                                                 :sortedSisters_ = "sortedSisters"
                                                 :sortedSiblings_ = "sortedSiblings"
                               ></taxonomical-tree>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="mt-1" v-if="isMapLoaded && $store.state.process === 'client'">
                       <div class="card rounded-0">
                           <div class="card-header">{{$t('header.f_distribution_map')}}</div>
                           <div class="card-body">
                               <div>
                                   <map-component></map-component>
                               </div>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="mt-1" v-if="((taxonPage && taxonPage.link_wikipedia != null) || taxon.taxon_id_tol != null|| taxon.taxon_id_eol != null|| taxon.taxon_id_nrm!= null || taxon.taxon_id_plutof!= null || taxon.taxon_id_pbdb != null)">
                       <div class="card rounded-0" style="width: 100%" >
                           <div class="card-header">{{$t('header.f_weblinks')}}</div>
                           <div class="card-body">
                               <see-also></see-also>
                           </div>
                       </div>
                   </b-row>
               </div>
           </b-row>
       </b-container>
   </div>

</template>

<script>
    import Vue from 'vue'
    import Spinner from '../components/Spinner.vue';
    import TaxonTabs from "../components/TaxonTabs.vue";
    import TaxonTitle from "../components/TaxonTitle.vue";
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
    import MapComponent from "../components/MapComponent.vue";
    import ProtoHeader from "../components/ProtoHeader.vue";
    import TabOverviewProto from "../components/tabs/TabOverviewProto.vue";
    import Lingallery from "../components/Lingallery.vue";
    import ClassificationTable from "../components/ClassificationTable.vue";
    import SeeAlso from "../components/SeeAlso.vue";


    export default {
        name: 'item-page',
        components: {
            SeeAlso,
            ClassificationTable,
            Lingallery,
            TabOverviewProto,
            ProtoHeader,
            MapComponent,
            TabSpecies,
            TabLiterature,
            TaxonomicalTree,
            TabClassification,
            TabGallery,
            TabNames,
            TaxonTitle,
            TaxonTabs,
            Spinner
        },
        data() {
            return this.initialData()
        },

        computed: {
            taxon () { return this.$store.state.activeItem['taxon'] },
            taxonTitle: function() {
                let lang = this.$store.state.lang;
                if (this.taxonPage && this.taxonPage.title)
                    return this.taxonPage.title
                let activeCommonName = filter(this.$parent.commonNames, function(o) {
                    return o.language === lang && o.is_preferred === 1});

                if (activeCommonName.length > 0)
                    return activeCommonName[0].name
            },
            description () { return this.$store.state.activeItem['description'] },
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
            },
            isMapLoaded() {
                return !!((this.mapDataLoaded)
                    && ['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en) && this.isDefinedAndNotNull(this.taxon.taxon))
            }

        },

         asyncData ({ store, route : {params: { id }}}) {
            return Promise.all([
                store.dispatch('FETCH_TAXON', { id }),
                store.dispatch('FETCH_COMMON_NAMES', { id }),
                store.dispatch('FETCH_TAXON_PAGE', { id }),
                store.dispatch('FETCH_TYPE_SPECIMEN', { id }),
                store.dispatch('FETCH_TYPE_IDENTIFICATION', { id }),
                store.dispatch('FETCH_TAXON_OCCURRENCE'),
                store.dispatch('FETCH_CHILDREN', { id }),
                store.dispatch('FETCH_SYNONIMS', { id }),
                store.dispatch('FETCH_TAXON_LIST', { id }),
                store.dispatch('FETCH_DESCRIPTION', { id })
            ])

        },

        mounted () {
            console.log(this.$router.currentRoute.name)
            let process = 'client'
            this.$store.commit('SET_PROCESS',{process})
            this.$store.dispatch('FETCH_RANKS');
            Object.assign(this.$data, this.initialData());
            this.loadFullTaxonInfo()
            this.mapDataLoaded = !!((this.isDefinedAndNotNull(this.taxonOccurrence) && this.taxonOccurrence.length > 0)
                || (this.isDefinedAndNotNull(this.specimenIdentification) && this.specimenIdentification.length > 0)
                || (this.isDefinedAndNotNull(this.taxonTypeSpecimen) && this.taxonTypeSpecimen.length > 0))
        },

        methods: {
            initialData: function () {
                return {
                    parent: {},
                    images: [],
                    activeSection: 'overview',
                    mapDataLoaded: false,
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

                // if (this.taxon.rank__rank_en !== 'Species') {
                //
                // }
                this.searchSpecies()

                fetchHierarchy(this.formatHierarchyString(this.taxon.hierarchy_string)).then((response) => {
                    this.hierarchy = response.results;
                    this.isHierarchyLoaded = true;
                });
                if(['None','Phylum', 'Kingdom', 'None', 'Class', 'Order'].includes(this.taxon.rank__rank_en) ) {
                    fetchImages(this.taxon.taxon).then((response) => {
                        this.images = this.composeImageRequest(response.results)
                        this.isTaxonImagesLoaded = true
                    });

                }
                if(['Species', 'Genus', 'Subgenus', 'SubSpecies'].includes(this.taxon.rank__rank_en) && this.isDefinedAndNotNull(this.taxon.taxon)) {
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
                if(taxonImages === undefined || taxonImages === {} || taxonImages.length === 0) return ;
                if (taxonImages.length > 0) {
                    let taxon = this.taxon
                    let fileUrl = 'http://files.geocollections.info';
                    taxonImages.forEach(function(el) {
                        if (el.uuid_filename && el.uuid_filename != null) {
                            el.thumbnail = fileUrl + '/small/' + el.uuid_filename.substring(0,2)+'/'+ el.uuid_filename.substring(2,4)+'/'+ el.uuid_filename;
                            el.src = fileUrl + '/large/' + el.uuid_filename.substring(0,2)+'/'+ el.uuid_filename.substring(2,4)+'/'+ el.uuid_filename;
                            el.caption = el.database__acronym +' '+ el.specimen__specimen_id + ' '
                                + taxon.taxon+ ' ' + taxon.author_year
                        }
                        else if(el.attachment__uuid_filename && el.attachment__uuid_filename != null) {
                            el.thumbnail = fileUrl + '/small/' + el.attachment__uuid_filename.substring(0,2)+'/'
                                + el.attachment__uuid_filename.substring(2,4)+'/'+ el.attachment__uuid_filename;
                            el.src = fileUrl + '/large/' + el.attachment__uuid_filename.substring(0,2)+'/'
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

                // scrollIntoView (evt) {
                //     evt.preventDefault()
                //     console.log(this.$router.currentRoute)
                //     const href = evt.target.getAttribute('href')
                //     const el = href ? document.querySelector(href) : null
                //     if (el) {
                //         this.$refs.content.scrollTop = el.offsetTop
                //     }
                // }
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
