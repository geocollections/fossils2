<template>
    <div id="#tab-overview" class="tab-pane" :class="{active: $store.state.process === 'server' ||
    ($store.state.process === 'client' && $store.state.activeTab === 'overview')}" role="tabpanel">
        <div class="row p-3"><h2 v-show="$store.state.process === 'server'">Overview</h2></div>
        <div class="row  p-3">
            <div class="col-lg-4" v-if="images && images.length > 0">
                <lingallery ref="lingallery" :width="400" :height="250" :items="images"/>
            </div>
            <div v-bind:class="images && images.length > 0 ? 'col-lg-8' : 'col-lg-12'">
                <div class="card">
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
                            <div v-if="$parent.isDefinedAndNotEmpty(sortedSistersWithoutCurrentTaxon)">{{$t('header.f_sister_taxa')}}:
                                <span v-for="(item,idx) in sortedSistersWithoutCurrentTaxon">
                                    <em><router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link></em>
                                    <span v-if = 'idx != sortedSistersWithoutCurrentTaxon.length -1'> | </span>
                                </span>
                            </div>
                            <div v-if="$parent.isDefinedAndNotEmpty(sortedSiblings)">{{$t('header.f_contains')}}:
                                <span v-if="sortedSiblings" v-for="(sibling, idx) in sortedSiblings">
                                    <router-link v-bind:to="'/'+sibling.id">{{sibling.taxon}}</router-link>
                                    <span v-if = 'idx != sortedSiblings.length -1'> | </span>
                                </span>
                            </div>
                            <div v-if="taxon.stratigraphy_base__stratigraphy || taxon.stratigraphy_top__stratigraphy"> {{$t('header.f_stratigraphical_distribution')}}:
                                <strong>
                                    <button class="btn btn-link" v-if="taxon.stratigraphy_base__stratigraphy"
                                            @click="$parent.openUrl({parent_url:'http://geokogud.info/stratigraphy',object:taxon.stratigraphy_base_id, width:500,height:500})">
                                            {{taxon.stratigraphy_base__stratigraphy}}</button>
                                            <span v-if="taxon.stratigraphy_top__stratigraphy != null && taxon.stratigraphy_base__stratigraphy != null">&ndash;</span>
                                            <button class="btn btn-link" v-if="taxon.stratigraphy_top__stratigraphy
                                            && taxon.stratigraphy_base__stratigraphy != taxon.stratigraphy_top__stratigraphy"
                                                                      @click="$parent.openUrl({parent_url:'http://geokogud.info/stratigraphy',object:taxon.stratigraphy_top_id, width:500,height:500})">
                                              {{taxon.stratigraphy_top__stratigraphy}}
                                            </button>
                                        <span v-if="taxon.stratigraphy_base__age_base != null">| ~ {{$parent.convertToTwoDecimal(taxon.stratigraphy_base__age_base)}}</span>
                                        <span v-if="taxon.stratigraphy_top__age_top != null"> &ndash; {{$parent.convertToTwoDecimal(taxon.stratigraphy_top__age_top)}} Ma</span>
                                </strong>
                                <br />
                            </div>
                            <div v-if="taxon.rank__rank_en != null && taxon.rank__rank_en != 'species'">
                                <span v-if="$store.state.mode === 'in_baltoscandia'">{{$t('header.f_baltic_species')}}</span>
                                <span v-else>{{$t('header.f_global_species')}}</span>
                                <strong><a href="#tab-species"  v-on:click="setActiveTab('species')">{{numberOfSpecimen}}</a></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--<div class="row  p-3">-->
            <!--<div class="col-lg-4" >-->
                <!--<div class="card">-->
                    <!--<div class="card-header">{{$t('header.f_distribution_map')}}</div>-->
                    <!--<div class="card-body">-->
                        <!--<div v-if="isMapLoaded === true">-->
                            <!--<map-component></map-component>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="col-lg-8">-->

            <!--</div>-->

        <!--</div>-->

        <!-- Row contains Overview and also links-->
        <div class="row  p-3">
            <div class="col-lg-8" v-if="taxonPage && taxonPage.content">
                <div class="card">
                    <div class="card-header">
                        <h3>{{$t('header.f_taxon_intro')}}</h3>
                    </div>
                    <div class="card-body">
                        <div id="taxon-details" v-html="taxonPage.content"></div>
                    </div>
                    <div class="card-footer">
                        <i style='font-size: 0.8em;'> {{taxonPage.author_txt}} {{taxonPage.date_txt}}</i>
                    </div>
                </div>
            </div>
            <div class="col-lg-4"  v-if="((taxonPage && taxonPage.link_wikipedia != null) || taxon.taxon_id_tol != null|| taxon.taxon_id_eol != null|| taxon.taxon_id_nrm!= null || taxon.taxon_id_plutof!= null || taxon.taxon_id_pbdb != null)">
                <div class="card">
                    <div class="card-header">
                        <h3>{{$t('header.f_weblinks')}}</h3>
                    </div>
                    <div class="card-body">
                        <see-also></see-also>
                    </div>
                </div>
            </div>
        </div>
        <!-- Row contains description-->
        <div class="row p-3" v-if = "description && description.description">
            <div class="col-lg-12">
                <div>
                    <h3>{{$t('header.f_taxon_description_diagnosis')}} (<button class="btn btn-link"
                    @click="openUrl({parent_url:'http://geocollections.info/reference',object:description.reference, width:500,height:500})">
                        <strong>{{description.reference__reference}}</strong>)</button></h3>
                    <div v-html="description.description"></div>
                </div>
            </div>
        </div>

        <!-- Row contains Type specimen data-->
        <div class="row p-3" v-if = "taxon.rank__rank_en === 'Species' && (taxonTypeSpecimen || specimenIdentification)">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">{{$t('header.f_species_type_data')}}</div>
                    <div class="card-body">
                        <ul>
                            <li v-for="item in taxonTypeSpecimen"> {{item.type_type__value}}:
                                <button class="btn btn-link" @click="$parent.openUrl({parent_url:'http://geokogud.info/specimen',object:item.specimen, width:500,height:500})">
                                    <strong>{{item.specimen_number}}</strong>
                                </button> ,
                                <span v-translate="{et:item.locality__locality, en: item.locality__locality_en}"></span>, {{item.specimen__depth}} m
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">{{$t('header.f_species_linked_specimens')}}</div>
                    <div class="card-body">
                        <ul>
                            <li><strong>
                                    <button class="btn btn-link" @click="$parent.openUrl({parent_url:'http://geokogud.info',object:'search.php?taxon_1=1&taxon='+parent.taxon+'&currentTable=specimen', width:500,height:500})">
                                       {{specimenIdentification.length}} {{$t('header.f_genus_identifications_link')}}
                                    </button>
                            </strong>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

        <!-- Row contains Type specimen data-->
        <div class="row p-3" v-if = "taxon.rank__rank_en === 'Species' && (numberOfSpecimen || taxonOccurrence)">
            <div class="col-lg-6" v-if="taxonOccurrence">
                <div class="card">
                    <div class="card-header">{{$t('header.f_species_distribution_references')}}</div>
                    <div class="card-body">
                        <ul>
                            <li v-for=" reference in taxonOccurrence">
                                <button class="btn btn-link" @click="$parent.openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
                                  <strong>{{reference.reference__reference}}</strong>
                                </button>
                                <span v-translate="{et:reference.locality__locality,en:reference.locality__locality_en}"></span>
                                <span v-if="reference.depth || reference.depth_interval">{{reference.depth}} - {{reference.depth_interval}}</span>
                                <span v-translate="{et:reference.stratigraphy_base__stratigraphy,en:reference.stratigraphy_base__stratigraphy_en}"></span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">{{$t('header.f_taxon_identifications')}}</div>
                    <div class="card-body">
                        <ul>
                            <li>
                                <em>{{taxon.taxon}} {{taxon.author_year}}</em> :
                                <button class="btn btn-link" @click="$parent.openUrl({
                              parent_url:'http://geokogud.info',
                              object:'search.php?taxon_1=1&taxon='+taxon.taxon+' '+taxon.author_year +'&currentTable=specimen',
                               width:500,height:500})">
                                   {{numberOfSpecimen}} {{$t('header.f_genus_identifications_link')}}
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import SeeAlso from "../SeeAlso.vue";
    import MapComponent from "../MapComponent.vue";
    import Lingallery from "../Lingallery.vue";
    export default {
        name: "TabOverview",
        components:{
            Lingallery,
            SeeAlso,
            MapComponent
        },
        data () {
            return { isMapLoaded : true }
        },

        computed: {
            taxon () { return this.$store.state.activeItem['taxon'] },
            images () { return this.$parent.images.slice(1, 5) },
            parent () { return this.$parent.parent },
            description () { return this.$store.state.activeItem['description'] },
            taxonPage () {return this.$parent.taxonPage},
            sortedSistersWithoutCurrentTaxon () {return this.$parent.sortedSistersWithoutCurrentTaxon},
            sortedSiblings () {return this.$parent.sortedSiblings},
            numberOfSpecimen () {return this.$parent.numberOfSpecimen},
            taxonTypeSpecimen () {return this.$store.state.activeItem['taxonTypeSpecimen']},
            specimenIdentification () {return this.$store.state.activeItem['specimenIdentification']},
            taxonOccurrence () {return this.$store.state.activeItem['taxonOccurrence']},

        },
        methods:{
            setActiveTab: function(tab) {
                this.$store.commit('SET_ACTIVE_TAB', {tab})
                this.$route.meta.isSpecies = true
            }
        }
    }
</script>

<style scoped>

</style>