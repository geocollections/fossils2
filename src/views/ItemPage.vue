<template>
   <section>
       <div style="letter-spacing: 3px;" class="m-md-3 text-center"  v-if="!isTaxonExisted">
           <img class="rounded-circle border" style="height: 180px;width: 180px" src="/static/imgs/trilobite_logo_by_ewhauber-d4v4xyh.jpg"/><br/>
           <p>{{$t('main.taxon_do_not_exist')}}</p>
       </div>
       <div class="m-md-3" v-if="isTaxonExisted">
           <b-row class="mt-3" v-show="scroll">
               <span class="ml-auto" >
                   <button  onclick="location.href='#top'" type="button" class="btn btn-primary fixed-bottom m-md-2" variant="primary" ><span style="color:white !important;font-weight: bolder!important;font-size: 2em !important;">&uarr;</span></button>
               </span>
           </b-row>
           <b-row class="ml-0">
               <div>
               <a :href="'/'+taxon.fossil_group__id" v-if="taxon.fossil_group__id != null">
                   <img border="0" :src="'/static/fossilgroups/'+taxon.fossil_group__id+'.png'" :alt="taxon.fossil_group__taxon" :title="taxon.fossil_group__taxon" style="height: 120px; margin: 0 20px 0 0; padding-right: 0px;" /></a>
               <a :href="'/'+taxon.id" v-else-if="taxon.is_fossil_group === 1">
                   <img border="0" :src="'/static/fossilgroups/'+ taxon.id+'.png'" :alt="taxon.taxon" :title="taxon.taxon" style="height: 95px; margin-top: 0; padding-right: 0px;" /></a>
               </div>
               <div>
               <h3><strong>{{taxonTitle}}</strong></h3>
               <div v-if="taxon.fossil_group__id && (taxon.rank__rank_en === 'Species' || taxon.rank__rank_en === 'Genus')">
                   <strong>{{$t('header.f_fossil_group')}}:</strong>
                   <a :href="'/'+taxon.fossil_group__id">{{taxon.fossil_group__taxon}}</a></div>
               <span style="font-size: 0.9em;" v-translate="{ et: taxon.rank__rank, en: taxon.rank__rank_en }"></span>
               <span style="font-size: 28pt"><strong>{{taxon.taxon}}</strong></span>
               <span style="font-size: 0.9em;"> {{taxon.author_year}}</span>
               <span class="row p-3" v-if="filteredCommonNames && filteredCommonNames.length > 0">
                                <span  v-for="item in filteredCommonNames"><strong>{{item.language}}</strong>: {{item.name}}; &ensp;</span>
                            </span>
               <span class="row p-3" v-if="filteredCommonNames && filteredCommonNames.length === 0"></span>
               </div>
           </b-row>
           <taxon-tabs></taxon-tabs>
           <tab-gallery v-if="$store.state.activeTab === 'gallery'"></tab-gallery>
           <tab-specimens v-if="$store.state.activeTab === 'specimens'"></tab-specimens>
           <div v-if="$store.state.activeTab === 'overview'">
           <b-row>
               <div class="col-lg-8">
                   <b-row class="m-1">
                       <div class="card rounded-0" style="width: 100%">
                           <div class="card-body">
                               <div>
                                   Taxon ID: <strong>{{taxon.id}}</strong>
                                   <span v-if="taxon.date_added"> | {{taxon.date_added | moment('YYYY-MM-DD')}}</span>
                                   <span v-if="taxon.date_changed">/ {{taxon.date_changed | moment('YYYY-MM-DD')}}</span>
                               </div>

                               <div v-if="taxon.id != 29">
                                   {{$t('header.f_belongs_to')}}:
                                   <a :class="!isHigherTaxon(parent.rank__rank_en) ? '' : 'font-italic'" :href="'/'+parent.id">{{parent.taxon}}</a>
                                   <div v-if="isDefinedAndNotEmpty(sortedSistersWithoutCurrentTaxon)">{{$t('header.f_sister_taxa')}}:
                                       <span v-for="(item,idx) in sortedSistersWithoutCurrentTaxon">
                                    <a :class="!isHigherTaxon(item.rank__rank_en) ? '' : 'font-italic'" :href="'/'+item.id">{{item.taxon}}</a>
                                    <span v-if = 'idx != sortedSistersWithoutCurrentTaxon.length -1'> | </span>
                                </span>
                                   </div>
                                   <div v-if="isDefinedAndNotEmpty(sortedSiblings)">{{$t('header.f_contains')}}:
                                       <span v-if="sortedSiblings" v-for="(sibling, idx) in sortedSiblings">
                                    <a :href="'/'+sibling.id">{{sibling.taxon}}</a>
                                    <span v-if = 'idx != sortedSiblings.length -1'> | </span>
                                </span>
                                   </div>
                                   <div v-if="taxon.stratigraphy_base__stratigraphy || taxon.stratigraphy_top__stratigraphy"> {{$t('header.f_stratigraphical_distribution')}}:
                                       <strong>
                                           <a href="#" v-if="taxon.stratigraphy_base__stratigraphy"
                                                   @click="openUrl({parent_url: geocollectionUrl + '/stratigraphy',object:taxon.stratigraphy_base_id, width:500,height:500})">
                                               {{taxon.stratigraphy_base__stratigraphy}}</a>
                                           <span v-if="taxon.stratigraphy_top__stratigraphy != null && taxon.stratigraphy_base__stratigraphy != null">&ndash;</span>
                                           <a href="#" v-if="taxon.stratigraphy_top__stratigraphy
                                            && taxon.stratigraphy_base__stratigraphy != taxon.stratigraphy_top__stratigraphy"
                                                   @click="openUrl({parent_url:geocollectionUrl + '/stratigraphy',object:taxon.stratigraphy_top_id, width:500,height:500})">
                                               {{taxon.stratigraphy_top__stratigraphy}}
                                           </a>
                                           <span v-if="taxon.stratigraphy_base__age_base != null">| ~ {{convertToTwoDecimal(taxon.stratigraphy_base__age_base)}}</span>
                                           <span v-if="taxon.stratigraphy_top__age_top != null"> &ndash; {{convertToTwoDecimal(taxon.stratigraphy_top__age_top)}} Ma</span>
                                       </strong>
                                       <br />
                                   </div>
                                   <div v-if="taxon.rank__rank_en != null && taxon.rank__rank_en != 'Species'">
                                       <span v-if="$store.state.mode === 'in_baltoscandia'">{{$t('header.f_baltic_species')}}</span>
                                       <span v-else-if="$store.state.mode === 'in_estonia'">{{$t('header.f_estonian_species')}}</span>
                                       <span v-else>{{$t('header.f_global_species')}}</span>
                                       <strong><a href="#species">{{numberOfSpecimen}}</a></strong>
                                   </div>
                                   <see-also v-if="((taxonPage && taxonPage.link_wikipedia != null) || taxon.taxon_id_tol != null|| taxon.taxon_id_eol != null|| taxon.taxon_id_nrm!= null || taxon.taxon_id_plutof!= null || taxon.taxon_id_pbdb != null)"></see-also>
                               </div>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if="taxonPage && taxonPage.content" >
                       <div class="card rounded-0" style="width: 100%">
                           <div class="card-header">{{$t('header.f_taxon_intro')}}</div>
                           <div class="card-body">
                               <foldable>
                                   <div id="taxon-details" v-html="taxonPage.content"></div>
                               </foldable>
                           </div>
                           <div class="card-footer">
                               <i style='font-size: 0.8em;'> {{taxonPage.author_txt}} {{taxonPage.date_txt}}</i>
                           </div>
                       </div>
                   </b-row>
                   <!-- Row contains description-->
                   <b-row class="m-1" v-if = "description && description.description">
                       <div class="col-lg-12">
                           <foldable>
                               <h3>{{$t('header.f_taxon_description_diagnosis')}}
                                   (<a href="#" @click="openUrl({parent_url:'http://geocollections.info/reference',object:description.reference, width:500,height:500})">
                                   <strong>{{description.reference__reference}}</strong>)</a></h3>
                               <div v-html="description.description"></div>
                           </foldable>
                       </div>
                   </b-row>
                   <!-- TYPE SPECIMEN DATA begins-->
                   <b-row class="m-1" v-if = "taxonTypeSpecimen">
                   <div class="card rounded-0" style="width: 100%" >
                       <div class="card-header">{{$t('header.f_species_type_data')}}</div>
                       <div class="card-body">
                           <div :class="idx === taxonTypeSpecimen.length -1 ? '' : 'border-bottom my-3'" v-for="item,idx in taxonTypeSpecimen">
                               <span v-if="item.type_type__value !== null || item.type_type__value_en !== null">
                                   <span v-translate="{et:item.type_type__value, en: item.type_type__value_en}"></span>:
                               </span>
                               <span v-if="item.specimen === null">{{item.repository}} {{item.specimen_number}}</span>
                               <span v-if="item.specimen !== null"><a href="#" @click="openUrl({parent_url:'http://geocollections.info/specimen',object:item.specimen, width:500,height:500})">{{item.repository}} {{item.specimen_number}}</a></span><!--
                            --><span v-if="isAtLeastOneDefinedAndNotEmpty({common: [item.level,item.attachment__filename,item.remarks],
                               et:[item.stratigraphy__stratigraphy,item.stratigraphy_free,item.locality__locality],
                               en:[item.stratigraphy__stratigraphy_en,item.stratigraphy_free_en,item.locality__locality_en]})">,</span>
                               <a @click="openUrl({parent_url:geocollectionUrl + '/locality',object:item.locality, width:500,height:500})" href="#"
                                  v-if="isDefinedAndNotNull(item.locality)" v-translate="{et:item.locality__locality, en: item.locality__locality_en}"></a>
                               <span v-if="isDifferentName({et:[item.locality__locality,item.locality_free],en:[item.locality__locality_en,item.locality_free_en]})">
                                   (<span v-translate="{et:item.locality_free, en: item.locality_free_en}"></span>)
                               </span>
                               <span v-if="isDefinedAndNotNull(item.level)">{{item.level}},</span>
                               <a @click="openUrl({parent_url:geocollectionUrl + '/stratigraphy',object:item.stratigraphy, width:500,height:500})" href="#"
                                  v-if="isDefinedAndNotNull(item.stratigraphy)" v-translate="{et:item.stratigraphy__stratigraphy, en: item.stratigraphy__stratigraphy_en}"></a>
                               <span v-if="isDifferentName({et:[item.stratigraphy__stratigraphy,item.stratigraphy_free],en:[item.stratigraphy__stratigraphy_en,item.stratigraphy_free_en]})">
                                   (<span v-translate="{et:item.stratigraphy_free, en: item.stratigraphy_free_en}"></span>)
                               </span>
                               <span v-if="isDefinedAndNotNull(item.remarks)">{{item.remarks}}</span>
                               <span class="pl-3" v-if="isDefinedAndNotNull(item.attachment__filename)">
                                   <a @click="openUrl({parent_url:geocollectionUrl + '/file',object:item.attachment, width:500,height:500})" href="#">
                                       <img class="img-thumbnail previewImage" :src="composeImgUrl(item.attachment__filename,false)"/>
                                   </a>
                               </span>
                           </div>
                       </div>
                   </div>
                   </b-row>
                   <!-- TYPE SPECIMEN DATA ends-->
                   <b-row class="m-1" v-if="synonyms && synonyms.length > 0">
                       <div class="card rounded-0" style="width:100%;">
                           <div class="card-header">{{$t('header.f_species_synonymy')}}</div>
                           <div class="card-body">
                               <div :class="idx === synonyms.length -1 ? '' : 'border-bottom my-3'" v-for="synonym,idx in synonyms">
                                   <em>{{synonym.taxon_synonym}}</em>:
                                   {{synonym.author}}, {{synonym.year}}, lk. {{synonym.pages}},
                                   joon. {{synonym.figures}}
                               </div>
                           </div>
                       </div>

                   </b-row>
                   <b-row class="m-1" v-if="references && references.length > 0">
                       <div class="card rounded-0" style="width: 100%">
                           <div class="card-header">{{$t('header.f_taxon_references')}}</div>
                           <div class="card-body">
                               <foldable :elLength = "references.length">
                               <div :class="idx === references.length -1 ? '' : 'border-bottom my-3'" v-for=" reference,idx in references">
                                   <a href="#" @click="openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
                                       <strong>{{reference.reference__reference}}.</strong>
                                   </a>
                                   <!--$author, $year. $title. $journal_name: $number or $book, $pages. DOI:$doi.-->
                                   <span>{{reference.reference__title}}. {{reference.reference__journal__journal_name}}:</span>
                                   <span v-if="reference.reference__book != null">{{reference.reference__book}}</span>
                                   <span v-else>{{reference.reference__number}}</span>
                                   <span v-if="reference.reference__pages != null">, {{reference.reference__pages}}</span>
                                   <span v-if="reference.reference__doi !== null" >. DOI: <a :href="'http://dx.doi.org/'+reference.reference__doi" target="_blank">{{reference.reference__doi}}</a>
                                   </span>
                               </div>
                               </foldable>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if="allSpecies && allSpecies.length > 0" id="species">
                       <div class="card rounded-0"   style="width: 100%">
                           <div class="card-header">{{$t('header.f_species_list')}}</div>
                           <div class="card-body">
                               <div v-if="allSpecies && allSpecies.length > 0">
                                   <div style='font-size: 0.8em;' v-for="(item, idx) in allSpecies">
                                       &ensp;&ensp;&ensp;{{calculateSpeciesIdx(idx)}}. <em><a :href="'/'+item.id">{{item.taxon}}</a></em>
                                       | <span v-translate="{et:item.stratigraphy_base__stratigraphy,  en: item.stratigraphy_base__stratigraphy_en}"></span>
                                       <span v-if="item.stratigraphy_top__stratigraphy !=null"> → </span><span v-translate="{et:item.stratigraphy_top__stratigraphy,  en: item.stratigraphy_top__stratigraphy_en}"></span>
                                   </div>
                                   <div class="col-xs-12 col-xs-6 pagination-center" v-if="numberOfSpecimen > $store.state.searchParameters.species.paginateBy">
                                       <b-pagination
                                               size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="$store.state.searchParameters.species.page" :per-page="$store.state.searchParameters.species.paginateBy">
                                       </b-pagination>
                                   </div>
                               </div>
                               <div v-else>Selle rühma all ei ole liike registreeritud</div>
                           </div>
                       </div>
                   </b-row>
                   <b-row>
                       <div v-if="isDefinedAndNotEmpty(distributionConop)">
                           <h3>{{$t('header.f_species_distribution_samples')}} (CONOP):</h3>
                           <div :class="idx === distributionConop.length -1 ? '' : 'border-bottom my-3'" v-for="conop,idx in distributionConop">
                               <a :href="'http://geocollection.info/locality/'+conop.locality_id"
                                  target='_blank'>{{conop.locality_et}}</a>: {{conop.num}} {{$t('f_species_link_samples')}}
                           </div>
                       </div>
                   </b-row>

               </div>
               <div class="col-lg-4">
                   <b-row class="m-1">
                       <lingallery  style="width: 100%" v-if="images && images.length > 0" ref="lingallery" :width="400" :height="350" :items="images"/>
                   </b-row>

                   <b-row class="m-1" v-if="isTaxonomicTreeIsLoaded">
                       <div class="card rounded-0" style="width: 100%">
                           <div class="card-header">{{$t('header.fossils_classification')}}</div>
                           <div class="card-body" style='font-size: 0.8em;'>
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
                   <b-row class="m-1" v-if="isMapLoaded && $store.state.process === 'client'">
                       <div class="card  rounded-0"  style="width: 100%">
                           <div class="card-header">{{$t('header.f_distribution_map')}}</div>
                           <div class="card-body no-padding">

                                   <map-component></map-component>

                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if = "!isHigherTaxon(taxon.rank__rank_en) && (taxonOccurrence)">
                       <div class="card rounded-0"  style="width: 100%">
                           <div class="card-header">{{$t('header.f_species_distribution_references')}}</div>
                           <div class="card-body" style='font-size: 0.8em;'>
                               <ul>
                                   <li v-for=" reference in taxonOccurrence">
                                       <em>
                                       <a href="#" @click="openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
                                           <strong>{{reference.reference__reference}}</strong>
                                       </a>
                                       <span v-translate="{et:reference.locality__locality,en:reference.locality__locality_en}"></span>
                                       <span v-if="reference.depth || reference.depth_interval">{{reference.depth}} - {{reference.depth_interval}}</span>
                                       <span v-translate="{et:reference.stratigraphy_base__stratigraphy,en:reference.stratigraphy_base__stratigraphy_en}"></span>
                                       </em>
                                   </li>
                               </ul>
                           </div>
                       </div>
                   </b-row>
                   <b-row class="m-1" v-if="isDefinedAndNotEmpty(distributionSamples)">
                       <div class="card rounded-0"   style="width: 100%">
                           <div class="card-header">{{$t('header.f_species_distribution_samples')}}</div>
                           <div class="card-body" style='font-size: 0.8em;'>
                               <div class="my-2" v-for="sample in distributionSamples">
                                   <a :href="'http://geocollections.info/locality/'+sample.locality_id" target='_blank'><i v-translate="{et:sample.locality_et,en:sample.locality_en}"></i></a>
                                   <span>({{sample.depth_min}}  ... {{sample.depth_max}}):</span>
                                   <a target='_blank' :href="geocollectionUrl + '/specimen?taxon_1=1&taxon='+taxon.taxon+'&taxon_2=1&locality_1=1&locality='+sample.locality_en+'&locality_2=1&currentTable=sample&paginateBy=25&sort=id&sortdir=DESC'">
                                       {{sample.num}} {{$t('header.f_species_link_samples')}}
                                   </a>
                               </div>
                           </div>
                       </div>
                   </b-row>
               </div>
           </b-row>

           </div>
       </div>
   </section>

</template>

<script>
    import Vue from 'vue'
    import Spinner from '../components/Spinner.vue';
    import TaxonTabs from "../components/TaxonTabs.vue";
    import TaxonomicalTree from "../components/TaxonomicalTree.vue";
    import filter from 'lodash/filter';
    import orderBy from 'lodash/orderBy';
    import uniqBy from 'lodash/uniqBy';
    import map from 'lodash/map';
    import {
        fetchTaxon,
        fetchSisterTaxa,
        fetchSpecies,
        fetchHierarchy,
        fetchImages,
        fetchAttachment,
        fetchSelectedImages,
        fetchSpecimenCollection, cntSpecimenCollection
    } from '../api'
    import MapComponent from "../components/MapComponent.vue";
    import ProtoHeader from "../components/AppHeader.vue";
    import Lingallery from "../components/Lingallery.vue";
    import SeeAlso from "../components/SeeAlso.vue";
    import TabSpecimens from "../components/tabs/TabSpecimens.vue";
    import TabGallery from "../components/tabs/TabGallery.vue";
    import VueFoldable from "../components/VueFoldable.vue";
    Vue.component('foldable', VueFoldable)

    export default {
        name: 'item-page',
        components: {
            TabGallery,
            TabSpecimens,
            SeeAlso,
            Lingallery,
            ProtoHeader,
            MapComponent,
            TaxonomicalTree,
            TaxonTabs,
            Spinner,

        },
        data() {
            return this.initialData()
        },
        computed: {
            taxon () { return this.$store.state.activeItem['taxon'] },
            isTaxonExisted () {return this.taxon && this.taxon.hasOwnProperty('id')},
            taxonTitle: function() {
                let lang = this.$store.state.lang;
                if (this.taxonPage && this.taxonPage.title)
                    return this.taxonPage.title
                let activeCommonName = filter(this.commonNames, function(o) {
                    return o.language === lang && o.is_preferred === 1});

                if (activeCommonName.length > 0)
                    return activeCommonName[0].name
            },
            description () { return this.$store.state.activeItem['description'] },
            commonNames () { return this.$store.state.activeItem['commonNames'] },
            taxonTypeSpecimen () { return this.$store.state.activeItem['typeSpecimen'] },
            distributionSamples () { return this.$store.state.activeItem['distributionSamples'] },
            distributionConop () { return this.$store.state.activeItem['distributionConop'] },
            specimenIdentification () { return this.$store.state.activeItem['specimenIdentification'] },
            cntSpecimenIdentification () { return this.$store.state.activeItem['cntSpecimenIdentification'] },
            taxonOccurrence () { return this.$store.state.activeItem['taxonOccurrence'] },
            references () {
                if((this.$store.state.activeItem['references'] === [] && this.$store.state.activeItem['references2'] === []) ||
                    this.$store.state.activeItem['references'] === false || this.references2 === false
                    || this.$store.state.activeItem['references'] === undefined
                    || this.$store.state.activeItem['references2'] === undefined) return {}
                let refs = this.$store.state.activeItem['references'].concat(this.$store.state.activeItem['references2']);
                let uniqueRefs = uniqBy(refs,'reference')
                if (uniqueRefs.length < 4) this.accordion.showAccordionReferences = true
                return orderBy(uniqueRefs,'reference__year',['desc'])
            },
            siblings () {
                return this.$store.state.activeItem['children'] },
            synonyms () { return this.$store.state.activeItem['synonims'] },
            //is not actually used
            taxonList () { return this.$store.state.activeItem['taxonList'] },
            taxonPage: function() {
                let taxonPages = this.$store.state.activeItem['taxonPage'];
                if (taxonPages === undefined || taxonPages.length === 0) return {}
                return taxonPages[0];
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
            map_ () { return this.$store.state.activeItem['map'] },
            isMapLoaded() {
                return !!( this.map_
                    && ['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(this.taxon.rank__rank_en) && this.isDefinedAndNotNull(this.taxon.taxon))
            },
            mode () {
                return this.$store.state.mode
            },
        },

         asyncData ({ store, route : {params: { id }}}) {
            let queries = [
                store.dispatch('FETCH_COMMON_NAMES', { id }),
                store.dispatch('FETCH_TAXON_PAGE', { id }),
                store.dispatch('FETCH_TAXON_OCCURRENCE'),
                store.dispatch('FETCH_REFERENCES'),
                store.dispatch('FETCH_REFERENCES2'),
                store.dispatch('FETCH_CHILDREN', { id }),
                // store.dispatch('FETCH_TAXON_LIST', { id }),
                store.dispatch('FETCH_DESCRIPTION', { id }),
            ];
            if (['Species','Subspecies'].includes(store.state.activeItem.taxon.rank__rank_en)) {
                queries = Array.prototype.concat.apply([
                    store.dispatch('FETCH_SYNONIMS', { id }),
                    store.dispatch('FETCH_TYPE_SPECIMEN', { id }),
                    store.dispatch('FETCH_DISTRIBUTION_SAMPLES', { id }),
                    store.dispatch('FETCH_DISTRIBUTION_CONOP', { id }),
                ], queries)
            }
            if (['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(store.state.activeItem.taxon.rank__rank_en)){
                queries = Array.prototype.concat.apply([
                    store.dispatch('FETCH_TYPE_IDENTIFICATION', { id }),
                    store.dispatch('FETCH_NUMBER_OF_SPECIMEN_IDENTIFICATION', { id }),
                    //map and images
                    store.dispatch('FETCH_SPECIES_MAP', { id }),
                ],queries)
            }
            return Promise.all(queries)

        },
        beforeMount() {
            window.addEventListener('scroll', this.handleScroll);
        },
        beforeDestroy () {
            window.addEventListener('scroll', this.handleScroll);
        },

        mounted () {
            if (this.taxon && this.taxon.hasOwnProperty('id')) {
                let process = 'client'
                this.$store.commit('SET_PROCESS', {process})
                this.$store.dispatch('FETCH_RANKS');
                Object.assign(this.$data, this.initialData());
                this.loadFullTaxonInfo()
            }
        },

        methods: {
            initialData: function () {
                return {
                    geocollectionUrl: "http://geocollections.info",
                    fossilsUrl: "https://fossiilid.geokogud.info",
                    kividUrl: "http://www.kivid.info",
                    fileUrl:'https://files.geocollections.info',
                    isReferencesCollapsed: true,
                    scroll: false,
                    parent: {},
                    images: [],
                    activeSection: 'overview',
                    specimenCollectionCnt: false,
                    loaders : {
                        isSpecimenCollectionLoaded : false
                    },
                    accordion: {
                        showAccordionReferences: false
                    },
                    toggle: '',
                    mapDataLoaded: false,
                    sister_taxa: {},
                    hierarchy: {},
                    numberOfSpecimen: {},
                    requestingData: false,
                    isSisterTaxaLoaded: false,
                    isHierarchyLoaded: false,
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
                    });

                    fetchSisterTaxa(this.taxon.parent, this.$store.state.mode).then((response) => {
                        this.sister_taxa = response.results;
                        this.isSisterTaxaLoaded = true;
                    });

                }

                if (this.taxon.rank__rank_en !== 'Species') {
                    this.searchSpecies()
                }

                fetchHierarchy(this.formatHierarchyString(this.taxon.hierarchy_string)).then((response) => {
                    this.hierarchy = response.results;
                    this.isHierarchyLoaded = true;
                });

                this.getImages();

                cntSpecimenCollection(this.taxon.hierarchy_string).then((response) => {
                    this.specimenCollectionCnt = response.count;

                });
            },
            getImages() {
                this.imagesLoading = true;

                if(this.isHigherTaxon(this.taxon.rank__rank_en)) {
                    fetchSelectedImages(this.taxon.id,this.$store.state.searchParameters).then((response) => {
                        if(response.results.length === 0) {
                            fetchImages(this.taxon.hierarchy_string,this.$store.state.searchParameters).then((response) => {
                                this.$store.state.searchParameters.images.allowPaging = this.isAllowedMorePaging(
                                    this.$store.state.searchParameters.images.page,response,
                                    this.$store.state.searchParameters.images.paginateBy)
                                // this.$store.state.searchParameters.images.page = this.$store.state.searchParameters.images.page + 1
                                this.images = this.composeImageRequest(response.results)
                                this.imagesLoading = false;
                            });
                        } else {
                            this.images = this.composeImageRequest(response.results)
                            this.imagesLoading = false;
                        }
                    });
                } else {
                    fetchAttachment(this.taxon.hierarchy_string,this.$store.state.searchParameters).then((response) => {
                        // this.$store.state.searchParameters.images.page = this.$store.state.searchParameters.images.page + 1
                        this.$store.state.searchParameters.images.allowPaging = this.isAllowedMorePaging(
                            this.$store.state.searchParameters.images.page,response,
                            this.$store.state.searchParameters.images.paginateBy)
                        this.images = this.composeImageRequest(response.results);
                        this.imagesLoading = false;
                    });
                }
            },

            isDifferentName(obj) {
                let localizedName = this.$store.state.lang === 'et' ? obj['et'] : obj['en'];
                return localizedName[0] !== localizedName[1] && localizedName[1] !== ""
            },
            isAllowedMorePaging(page, response, paginateBy) {
                let isAllowed = !(response.page === undefined || (parseInt(response.count) / page < paginateBy))
                if(isAllowed) page += 1;
                return isAllowed
            },
            //todo: utils
            composeImgUrl(uuid_filename,isFull) {
                if (uuid_filename && uuid_filename != null) {
                    return isFull ? this.fileUrl + '/large/' + uuid_filename.substring(0,2)+'/'+ uuid_filename.substring(2,4)+'/'+ uuid_filename
                        : this.fileUrl + '/small/' + uuid_filename.substring(0,2)+'/'+ uuid_filename.substring(2,4)+'/'+ uuid_filename;
                }
            },
            //todo: utils
            isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },

            //todo: utils
            isDefinedAndNotNull(value) { return !!value && value !== null },
            arrayHasNonNullElement(arr) {
                let this_ = this, found = false;
                arr.forEach(function(el) {
                    found = this_.isDefinedAndNotNull(el)
                });
                return found;
            },
            isAtLeastOneDefinedAndNotEmpty(arr) {
                let found = this.arrayHasNonNullElement(arr['common']);
                if (found) return found;

                let localizedArr = this.$store.state.lang === 'et' ? arr['et'] : arr ['en']
                found = this.arrayHasNonNullElement(localizedArr);
                return found;
            },
            isHigherTaxon(rank) { return !['Species','Subspecies','Genus','Supergenus','Subgenus'].includes(rank) },
            calculateSpeciesIdx: function (idx) {
                return (idx + 1) + this.$store.state.searchParameters.species.paginateBy * this.$store.state.searchParameters.species.page - this.$store.state.searchParameters.species.paginateBy
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
            setFancyBoxCaption: function(el, this_, isSpecimen) {
                let text="", imageName = el.taxon, infoId = el.specimen_id, imageId = el.attachment_id, navigateId = el.taxon_id;
                if(isSpecimen === undefined) {
                    imageName = el.number + ' ' + el.name;
                    infoId = el.id;
                    imageId = el.specimen_image_id
                    navigateId = el.link
                } else if(isSpecimen) {
                    imageName = el.link__taxon;
                    infoId = el.specimen_id;
                    imageId = el.id
                    navigateId = el.link
                }
                if(this.isHigherTaxon(this.taxon.rank__rank_en)) {
                    text += "<div><button type=\"button\" class=\"btn btn-xs  btn-primary\" onclick=\"window.open('"+this.fossilsUrl+"/"+navigateId+"?mode=in_baltoscandia&lang=en')\">Read more</button></div>" ;
                }

                text += "<div class='mt-3'><span>"+imageName+"</span>&ensp;&ensp;" ;
                text +=
                    "<button type=\"button\" class=\"btn btn-sm  btn-info\" onclick=\"window.open('"+this.geocollectionUrl+"/specimen/"+infoId+"')\">INFO</button>" +
                    " <button type=\"button\" class=\"btn btn-sm btn-secondary\" onclick=\"window.open('"+this.geocollectionUrl+"/file/"+imageId+"')\">IMAGE</button>"

                text += "</div>";
                return text
            },
            //todo: utils
            composeImageRequest : function(taxonImages) {
                if(taxonImages === undefined || taxonImages === {} || taxonImages.length === 0) return ;
                if (taxonImages.length > 0) {
                    let this_ = this
                    taxonImages.forEach(function(el) {
                        if (el.uuid_filename && el.uuid_filename != null) {
                            el.thumbnail = this_.fileUrl + '/small/' + el.uuid_filename.substring(0,2)+'/'+ el.uuid_filename.substring(2,4)+'/'+ el.uuid_filename;
                            el.src = this_.fileUrl + '/large/' + el.uuid_filename.substring(0,2)+'/'+ el.uuid_filename.substring(2,4)+'/'+ el.uuid_filename;
                            el.caption = this_.setFancyBoxCaption(el, this_, false)
                        }
                        else if(el.attachment__uuid_filename && el.attachment__uuid_filename != null) {
                            el.thumbnail = this_.fileUrl + '/small/' + el.attachment__uuid_filename.substring(0,2)+'/'
                                + el.attachment__uuid_filename.substring(2,4)+'/'+ el.attachment__uuid_filename;
                            el.src = this_.fileUrl + '/large/' + el.attachment__uuid_filename.substring(0,2)+'/'
                                + el.attachment__uuid_filename.substring(2,4)+'/'+ el.attachment__uuid_filename;
                            el.caption = this_.setFancyBoxCaption(el, this_, true)
                        }
                        else if(this_.isDefinedAndNotNull(el.filename)) {
                            el.thumbnail = this_.fileUrl + '/small/' + el.filename.substring(0,2)+'/'+ el.filename.substring(2,4)+'/'+ el.filename;
                            el.src = this_.fileUrl + '/large/' + el.filename.substring(0,2)+'/'+ el.filename.substring(2,4)+'/'+ el.filename;
                            el.caption = this_.setFancyBoxCaption(el, this_, false)
                        }
                        else if(el.preview !== null) {
                            el.thumbnail = this_.fileUrl + el.preview;
                            el.src = this_.fileUrl + el.img_to_url;
                            el.caption = this_.setFancyBoxCaption(el, this_)
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

            handleScroll (e) {
                this.scroll =  window.scrollY > 150;
            }
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

            '$store.state.searchParameters.species': {
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
                    { vmid: 'description', name: 'description', content: 'description'}]
            }
        },
    }
</script>
<style>

</style>
