<template>
    <div id="#tab-specimens" class="tab-pane" :class="{active:$store.state.activeTab === 'specimens'}" role="tabpanel">
        <b-row v-if="loading">
            <spinner :show="loading"></spinner><span class="p-2">{{$t('messages.pageLoading')}}</span></b-row>
        <b-row class="m-1 table-responsive" v-if="$parent.isDefinedAndNotEmpty(response.results) && !loading">
            <div class="col-xs-12 pagination-center">
                <b-pagination
                        size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="$store.state.searchParameters.specimens.page" :per-page="$store.state.searchParameters.specimens.paginateBy">
                </b-pagination>
            </div>
            <table class="table table-bordered table-hover mobile-padding-fix" style="font-size: smaller;" id="table-search">
                <thead class="thead-default">
                <tr>
                    <th><sort-field value = "id" name="search.specimen.number"></sort-field></th>
                    <th><sort-field value = "specimen_nr" name="search.specimen.old_specimen_number"></sort-field></th>
                    <th><sort-field value = "specimenidentification__taxon__taxon" name="search.specimen.name_part_element"></sort-field></th>
                    <th><sort-field value = "locality__locality,locality__locality_en" name="search.specimen.locality"></sort-field></th>
                    <th><sort-field value = "depth" name="search.specimen.depth_m"></sort-field></th>
                    <th>
                    <sort-field value = "stratigraphy__stratigraphy,stratigraphy__stratigraphy_en"
                    name="search.specimen.stratigraphy"/>
                    |
                    <em>
                    <sort-field value="lithostratigraphy__stratigraphy,lithostratigraphy__stratigraphy_en" name="search.specimen.lithostratigraphy"/>
                    </em>
                    </th>
                    <th><sort-field value = "agent_collected__agent" name="search.specimen.collector"></sort-field></th>
                    <th><sort-field value = "original_status__value,original_status__value_en" name="search.specimen.status"></sort-field></th>
                    <th>{{ $t('search.specimen.images') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in response.results">
                    <td class="text-nowrap" ><a href="#" @click="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/specimen',object:item.id, width:500,height:500})">
                        {{ item.coll__number | formatSpecimenName}} {{ item.specimen_id }}</a>
                    </td>
                    <td class="text-nowrap">{{item.specimen_nr}}</td>
                    <td>
                        <div>
                            <a :href="'/'+item.specimenidentification__taxon_id">{{item.specimenidentification__taxon__taxon}}</a>
                            <span v-if="$parent.isDefinedAndNotNull(item.specimenidentification__name)
                            && $parent.isDefinedAndNotNull(item.specimenidentification__taxon__taxon)
                            && item.specimenidentification__name != item.specimenidentification__taxon__taxon"> | </span>
                            <span v-if="$parent.isDefinedAndNotNull(item.specimenidentification__name)
                            && item.specimenidentification__name != item.specimenidentification__taxon__taxon"><i>{{item.specimenidentification__name}}</i>
                            </span>
                        </div>
                        <!-- Currently both are links because rock__name is mostly null. -->
                        <div>
                            <a href="#" @click="$parent.openUrl({parent_url:$parent.kividUrl,object:item.specimenidentificationgeologies__rock__id, width:500,height:500})">
                                <span v-translate="{et:item.specimenidentificationgeologies__rock__name,en:item.specimenidentificationgeologies__rock__name_en}"></span></a>
                            <span v-if="$parent.isDefinedAndNotNull(item.specimenidentificationgeologies__rock__name) &&
                            $parent.isDefinedAndNotNull(item.specimenidentificationgeologies__name)"> | </span>
                            <span v-if="($parent.isDefinedAndNotNull(item.specimenidentificationgeologies__name) || $parent.isDefinedAndNotNull(item.specimenidentificationgeologies__name_en))
                            && ((item.rock__name != item.specimenidentificationgeologies__name) || (item.rock__name_en != item.specimenidentificationgeologies__name_en))">
                            <i><span v-translate="{et:item.specimenidentificationgeologies__name,en:item.specimenidentificationgeologies__name_en}"></span></i>
                            </span>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.locality__locality != null && item.locality__locality_en != null">
                            <a href="#"
                                    @click="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/locality',object:item.locality__id, width:500,height:500})">
                                <span v-translate="{et:item.locality__locality,en:item.locality__locality_en}"></span></a>

                            <span v-if="$parent.isDefinedAndNotNull(item.locality_free)"> {{item.locality_free}}</span>
                        </div>
                    </td>
                    <td>{{item.depth}}<span v-if="item.depth_interval != null && item.depth_interval">({{ item.depth_interval }})</span>
                    </td>
                    <td>
                        <a href="#"
                                @click="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/stratigraphy',object:item.stratigraphy_id, width:500,height:500})">
                            <span v-translate="{et:item.stratigraphy__stratigraphy,en:item.stratigraphy__stratigraphy_en}"></span></a>

                        <span v-if="(item.stratigraphy__stratigraphy_en == null && item.stratigraphy__stratigraphy == null)
                                            || (item.lithostratigraphy__stratigraphy_en == null && item.lithostratigraphy__stratigraphy == null)">{{ item.stratigraphy_free }}</span>

                        <span v-if="item.stratigraphy__stratigraphy != null && item.lithostratigraphy__stratigraphy != null">|</span>

                        <em>
                            <a href="#"
                                    @click="$parent.openUrl({parent_url:$parent.geocollectionUrl+'/stratigraphy',object:item.lithostratigraphy_id, width:500,height:500})">
                                <span v-translate="{et:item.lithostratigraphy__stratigraphy,en:item.lithostratigraphy__stratigraphy_en}"></span></a>
                        </em>
                    </td>
                    <td>
                        <div v-if="item.agent_collected__agent != null">
                            {{ item.agent_collected__agent }}
                        </div>

                        <div v-if="item.agent_collected__agent == null">
                            {{ item.agent_collected__forename }} {{ item.agent_collected__surename }}
                        </div>
                    </td>

                    <td>
                        <span v-if="item.original_status__value != null && item.original_status__value_en != null"
                              v-translate="{et:item.original_status__value,en:item.original_status__value_en}"></span>
                    </td>
                    <td>
                        <a data-fancybox="gallery3" :href="$parent.composeImgUrl(item.attachment__filename,true)" :data-caption="item.caption">
                        <img class="img-thumbnail previewImage" :src="$parent.composeImgUrl(item.attachment__filename)"/>
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="col-xs-12 pagination-center">
                <b-pagination
                        size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="response.count" v-model="$store.state.searchParameters.specimens.page" :per-page="$store.state.searchParameters.specimens.paginateBy">
                </b-pagination>
            </div>
        </b-row>
    </div>
</template>

<script>
    import {
        fetchSpecimenCollection
    } from '../../api'
    import Spinner from "../Spinner.vue";
    import SortField from "../SortField.vue";
    export default {
        name: "TabSpecimens",
        components: {SortField, Spinner},
        data() {
            return {
                loading: true,
                response: this.setDefaultResponse()
            }
        },
        computed: {
            taxon () {return this.$parent.taxon}
        },
        filters: {
            formatSpecimenName: function (value) {
                if (!value) return ''
                value = value.toString()
                return value.split(' ')[0]
            }
        },
        mounted () {
            this.getSpecimens();
        },
        methods: {
            getSpecimens() {
                this.loading = true;
                this.setDefaultResponse();
                fetchSpecimenCollection(this.$parent.taxon.taxon,this.$store.state.searchParameters).then((response) => {
                    this.response.count = response.count;
                    this.response.results = response.results;
                    this.loading = false;
                });
            },
            setDefaultResponse() {
                return {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            '$store.state.searchParameters.specimens': {
                handler: function () {
                    this.getSpecimens()
                },
                deep: true
            },
        },
    }
</script>

<style scoped>

    #table-search .btn{
        padding:0;
        margin:0;
    }

</style>