<template>
    <section>
        <section class="container-fluid mt-0" style="margin-top: 0; padding-top: 0;">
            <div class="page-container" style="max-width: 1280px; margin-left: auto; margin-right: auto;">
                <b-row class="text-center">
                    <b-col>
                        <h1 style="padding: 5px 0 20px 0;">{{ $t('menu.detail_search')}}</h1>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="6" class="ml-auto"  style="padding-right:0.1rem !important;">
                        <div class="card rounded-0" style="width: 100%;height: 100%">
                            <div class="card-body">
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.hightaxon')}}:</label></b-col>
                                    <b-col sm="8">
                                        <vue-multiselect class="align-middle" v-model="searchParams.higherTaxa" deselect-label="Can't remove this value"
                                                         select-label="" track-by="taxan_id" label="taxon"
                                                         :options="searchResults" :searchable="true" @search-change="autocompliteHigherTaxaSearch"
                                                         :allow-empty="true"  :show-no-results="false" :loading="isHigherTaxaLoading" :max-height="600"
                                                         :open-direction="'bottom'">
                                            <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.taxon }}</strong> </template>
                                            <template slot="noResult"><b>NoRes</b></template>
                                            <template slot="clear" slot-scope="props">
                                                <div class="multiselect__clear" v-if="true" @mousedown.prevent.stop="clearAll(props.search)"></div></template>
                                        </vue-multiselect>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.species')}}:</label></b-col>
                                    <b-col sm="8">
                                        <b-form-input id="input-small" size="sm" type="text" placeholder="" v-model="searchParams.speciesField"></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.author')}}:</label></b-col>
                                    <b-col sm="8">
                                        <b-form-input id="input-small" size="sm" type="text" placeholder="" v-model="searchParams.authorField"></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.locality')}}:</label></b-col>
                                    <b-col sm="8">
                                        <b-form-input id="input-small" size="sm" type="text" placeholder="" v-model="searchParams.localityField"></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.stratigraphy')}}:</label></b-col>
                                    <b-col sm="8">
                                        <vue-multiselect class="align-middle" v-model="searchParams.stratigraphyField" deselect-label="Can't remove this value"
                                                         select-label=""
                                                         :custom-label="displayStratigraphyResults" track-by="taxan_id"
                                                         :options="searchResults" :searchable="true" @search-change="autocompliteStratigraphySearch"
                                                         :allow-empty="true"  :show-no-results="false" :loading="isStratLoading" :max-height="600"
                                                         :open-direction="'bottom'">
                                            <template slot="singleLabel" slot-scope="{ option }"><strong>{{ $store.state.lang=== 'et' ? option.stratigraphy :option.stratigraphy_en }}</strong> </template>
                                            <template slot="noResult"><b>NoRes</b></template>
                                            <template slot="clear" slot-scope="props">
                                                <div class="multiselect__clear" v-if="true" @mousedown.prevent.stop="clearAll(props.search)"></div></template>
                                        </vue-multiselect>
                                        </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="12">
                                        <b-form-checkbox id="subsurfaceCheckbox" v-model="searchParams.isSubsurface">{{$t('advancedsearch.subsurfaceField')}}</b-form-checkbox>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4">
                                        <b-form-checkbox id="nearMeSearchCheckbox" v-model="searchParams.isNearMeSearch">{{$t('advancedsearch.showNearMeField')}}</b-form-checkbox>
                                        </b-col>
                                    <b-col sm="8" class="pt-2">
                                        <vue-slider ref="slider" :min="0" :max="20" v-model="searchParams.radius" v-if="searchParams.isNearMeSearch === true"></vue-slider>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"></b-col>
                                    <b-col sm="8">
                                        <b-button  @click="applySearch()" type="button" class="btn btn-primary p-2" style="float: right;font-size: 0.8rem" variant="primary">Search</b-button>
                                        <b-button  @click="clearSearch()" type="button" class="btn btn-outline-info p-2 mr-2" style="float: right;font-size: 0.8rem" variant="info">Clear</b-button>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </b-col>
                    <b-col md="6" class="mr-auto" style="padding-left:0.1rem !important;">
                        <div class="card rounded-0" style="width: 100%;height: 100%">
                            <div class="card-body  no-padding">
                                <div id="map" style="height: 300px"></div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
                <b-row class="pt-3">
                    <b-col md="12" v-if="errorMessege !== null">
                        <b-alert show variant="warning">{{errorMessege}}</b-alert>
                    </b-col>

                    <b-col md="12" v-if="initialMessege && !isLoadingResults">
                        <b-alert show variant="info" v-if="!!initialMessege">Please specify some search criteria to show list of species and genera.</b-alert>
                    </b-col>

                    <b-col md="12" v-if="!initialMessege">
                        <b-row v-if="isLoadingResults">
                            <spinner  :show="isLoadingResults"></spinner><span class="p-2">{{$t('messages.pageLoading')}}</span>
                        </b-row>
                        <div class="card rounded-0">
                            <div class="card-body">
                                <h1 id="results" class="pb-4" v-if="results">{{$t('advancedsearch.results')}}: {{numberOfResutls}} {{$t('advancedsearch.results_species')}}</h1>
                                <div class="col-xs-12 pagination-center">
                                    <b-pagination v-if="numberOfResutls>$store.state.searchParameters.advancedSearch.paginateBy" 
                                            size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="numberOfResutls" v-model="$store.state.searchParameters.advancedSearch.page" :per-page="$store.state.searchParameters.advancedSearch.paginateBy">
                                    </b-pagination>
                                </div>
                                <div v-for="group in output" style="padding: 5px 0 20px 0; border-top: dotted 2px #ccc;">
                                    <span><img onerror="this.style.display='none'" :src="'/static/fossilgroups/'+group.fossil_group_id+'.png'" style="width: 70px;" />
                                        <h2 style="display: inline;"><a v-if="group.fossil_group_id" :href="'/'+group.fossil_group_id">{{group.fossil_group}}</a>
                                            <span v-else>{{group.fossil_group}}</span></h2></span>
                                    <b-row v-for="species in group.node" style="padding-left: 1rem" v-bind:key="species.taxon_id">
                                        <b-col sm="6"><a :href="'/'+species.taxon_id"><em>{{species.taxon}}</em> {{species.author_year}}</a></b-col>
                                        <b-col v-if="species.fad && species.lad && species.fad!==species.lad" sm="6"><span v-translate="{ et: species.fad, en: species.fad_en}"></span> &rarr; <span v-translate="{ et: species.lad, en: species.lad_en}"></span></b-col>
                                        <b-col v-else-if="species.fad===species.lad" sm="6"><span v-translate="{ et: species.fad, en: species.fad_en}"></span></b-col>
                                        <b-col v-else-if="species.fad" sm="6"><span v-translate="{ et: species.fad, en: species.fad_en}"></span></b-col>
                                    </b-row>
                                </div>
                                <div class="col-xs-12 pagination-center">
                                    <b-pagination  v-if="numberOfResutls>$store.state.searchParameters.advancedSearch.paginateBy" 
                                            size="sm" align="right" :limit="5" :hide-ellipsis="true" :total-rows="numberOfResutls" v-model="$store.state.searchParameters.advancedSearch.page" :per-page="$store.state.searchParameters.advancedSearch.paginateBy">
                                    </b-pagination>
                                </div>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </section>
    </section>
</template>

<script>
    import VueMultiselect from 'vue-multiselect'

import {
    fetchAutocompleteSearch,
    fetchAutocompleteSearchStratigraphy,
    fetchOccurrenceCountInArea,
    fetchAdvancedTaxonSearch,
    fetchTaxonSearchInSelectedArea,
    fetchSpeciesCountInArea
} from '../api'
    import Spinner from "../components/Spinner.vue";
    import vueSlider from '../components/vue2-slider.vue';
export default {
  name: 'advanced-search-page',
    components:  {
        Spinner,
        VueMultiselect,
        vueSlider
    },
    data() {
        return {
            query:'',
            searchParams : this.setSearchParams(),
            initialMessege: true,
            errorMessege: null,
            output: {},
            map: null,
            circle:null,
            drawControls: null,
            drawnItems: null,
            layer: null,
            searchResults: [],
            isLoadingResults:false,
            isHigherTaxaLoading: false,
            isLocLoading: false,
            isStratLoading: false,
            results:[],
            numberOfResutls: 0,
            isPopQueryTriggered:false
        }
    },
    // computed: {
    //     isSearchDisabled() {
    //         if((this.higherTaxa !== null && this.higherTaxa !== '') ||
    //             (this.speciesField !== null && this.speciesField !== '') ||
    //             (this.localityField !== null && this.localityField !== '') ||
    //             (this.stratigraphyField !== null && this.stratigraphyField !== ''))
    //             return false
    //         return true;
    //     }
    // },
    methods: {

        getSpeciesCountInArea: function (geomParams,speciesID) {
            let this_=this
            fetchSpeciesCountInArea(this.getQueryParameters(geomParams)+'fq=%7B%21collapse%20field--locality%7D&').then((response) => {
                if(document.getElementById(speciesID) !== null)
                    document.getElementById(speciesID).innerHTML = response.count ? response.count : 0;
                this_.isPopQueryTriggered = false;
            });
        },
        getOccurrenceCountInArea: function (geomParams, occurrenceID) {
            fetchSpeciesCountInArea(this.getQueryParameters(geomParams)+'fq=%7B%21collapse%20field--taxon%7D&').then((response) => {
                if(document.getElementById(occurrenceID) !== null)
                    document.getElementById(occurrenceID).innerHTML = response.count ? response.count : 0;
            });
        },

        generatePopup: function(layer, latlng, query, map) {
            var geomParams = '', this_ = this

            if($.isFunction(layer.getRadius)) {
                // circle
                geomParams = this.getParamsForCircle(layer, query);
            } else {
                var wkt = new Wkt.Wkt();
                var geojson = layer.toGeoJSON();
                var geostr = JSON.stringify(geojson);

                wkt.read(geostr);

                geomParams = this.getParamsForWKT(wkt.write(), query);
            }
            console.log(latlng)
            if(!latlng) {
                if($.isFunction(layer.getBounds)) {
                    latlng = layer.getBounds().getCenter();
                } else {
                    latlng = layer.getLatLng();
                }
            }

            var coordsStr = latlng.lat + '-' + latlng.lng;
            var speciesID = 'speciesCount-' + coordsStr;
            var occurrenceID = 'occurrenceCount-' + coordsStr;

            this_.getSpeciesCountInArea(geomParams, speciesID);
            this_.getOccurrenceCountInArea(geomParams, occurrenceID);

            L.popup()
                .setLatLng(latlng)
                .setContent(
                    this.$t('advancedsearch.js_map_popup_localitycount') + ': ' +
                    '<b id="' + speciesID + '">' + this.$t('advancedsearch.calculating') + '</b>' +
                    '<br />' +
                    this.$t('advancedsearch.js_map_popup_speciescount') + ': ' +
                    '<b id="' + occurrenceID + '">' + this.$t('advancedsearch.calculating') + '</b>' +
                    '<br />' +
                    '<a id="showOnlyTheseRecords" href="#" onclick="return;">' +
                    '<span class="fa fa-search"></span> ' +
                    this.$t('advancedsearch.js_map_popup_linkText') +
                    '</a>'
                )
                .openOn(map);

            $('#showOnlyTheseRecords').on("click", function(event){
                this_.map.closePopup();
                this_.resetDrawnItemsColor()
                layer.setStyle({color: '#ff2a12'});
                this_.searchParams.geoparams = geomParams
            })
        },
        resetDrawnItemsColor: function(){
            this.map.eachLayer(function (layer) {
                if(layer.options.hasOwnProperty('color')) {
                    layer.setStyle({color: '#bada55' });
                }
            });
        },
        getParamsForWKT: function(wkt) {
            let coordsPairs = wkt.split(','),reversedPairs = [];
            // second and fourth pairs' places are changed because solr getting error
            let firstLatCoord = coordsPairs[0].replace('POLYGON((',''). split(' ')[0];
            let secondLatCoord = coordsPairs[1].split(' ')[0];

            if(parseFloat(firstLatCoord) <= parseFloat(secondLatCoord)) {
                let coordsPairs_ = coordsPairs.slice(1,coordsPairs.length - 1);
                reversedPairs.push(coordsPairs[0]);
                reversedPairs = reversedPairs.concat(coordsPairs_.reverse());
                reversedPairs.push(coordsPairs[coordsPairs.length - 1]);
            }

            let changedWkt = reversedPairs.length > 0 ? reversedPairs.join(',') : coordsPairs.join(',');
            return `fq=%7B%21field%20f--latlong%7DisWithin(${changedWkt})`
        },

        getParamsForCircle: function (circle) {
            var latlng = circle.getLatLng();
            var radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
            return `fq=%7B%21geofilt%7D&d=${radius}&pt=${latlng.lat},${latlng.lng}&sfield=latlong`
        },

        getBaseLayers: function () {
            // Google map layers
            var minimalBaseLayer =
                L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, imagery &copy; <a href="https://carto.com/attribution">CartoDB</a>',
                subdomains: 'abcd',
                mapid: '',
                token: ''
            });
            //     L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
            //     {
            //         minZoom: 4,
            //         maxZoom: 18,
            //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            //     }
            // );
            //     L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
            //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, imagery &copy; <a href="https://carto.com/attribution">CartoDB</a>',
            //     subdomains: 'abcd',
            //     mapid: '',
            //     token: ''
            // });
            // var roadLayer = L.gridLayer.googleMutant({ type: 'roadmap' });
            // var terrainLayer = L.gridLayer.googleMutant({ type: 'terrain' });
            // var hybridLayer = L.gridLayer.googleMutant({ type: 'satellite' });
            // var blackWhiteLayer = new L.StamenTileLayer('toner');

            var baseLayers = {};
            baseLayers[this.$t('advancedsearch.js_map_layers_Minimal')] = minimalBaseLayer;
            // baseLayers[this.$t('advancedsearch.js.map.layers.Road')] = roadLayer;
            // baseLayers[this.$t('advancedsearch.js.map.layers.Terrain')] = terrainLayer;
            // baseLayers[this.$t('advancedsearch.js.map.layers.Satellite')] = hybridLayer;
            // baseLayers[this.$t('advancedsearch.js.map.layers.BlackWhite')] = blackWhiteLayer;

            return baseLayers;
        },

        getStoredMapLayer: function () {
            var storedLayerName;
            try {
                storedLayerName = localStorage.getItem('defaultMapLayer');
            } catch(e) {
                // localStorage not available
                storedLayerName = this.$t('advancedsearch.js_map_layers_Minimal');
            }
            return storedLayerName;
        },
        initialiseMap : function() {
            let this_=this

            document.getElementById('map').style.cursor = 'default';
            let MAP_VAR = this
            // initialise map
            MAP_VAR.map = L.map('map', {
                // fullscreenControl: true,
                // fullscreenControlOptions: {
                //     position: 'topleft'
                // },
                center: [58.3,25],
                zoomControl: false,
                zoom: 6,
                minZoom: 1,
                scrollWheelZoom: true
            });
            this.drawI18N();
            L.control.zoom({
                position: 'topleft',
                zoomInTitle: this.$t('advancedsearch.js_map_zoomin'),
                zoomOutTitle: this.$t('advancedsearch.js_map_zoomout')
            }).addTo(MAP_VAR.map);

            // add edit drawing toolbar
            // Initialise the FeatureGroup to store editable layers
            MAP_VAR.drawnItems = new L.FeatureGroup();
            MAP_VAR.map.addLayer(MAP_VAR.drawnItems);

            // Initialise the draw control and pass it the FeatureGroup of editable layers
            this.drawControls = new L.Control.Draw({
                edit: {
                    featureGroup: MAP_VAR.drawnItems
                },
                draw: {
                    circlemarker: false,
                    marker: false,
                    polyline: false,
                    rectangle: {
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    polygon: {
                        allowIntersection: false, // Restricts shapes to simple polygons
                        drawError: {
                            color: '#e1e100', // Color the shape will turn when intersects
                            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    }
                }
            });

            MAP_VAR.map.addControl(this.drawControls);

            /*  Common map (Leaflet) functions */
            function addClickEventForVector(layer, query, map) {
                layer.on('click', function(e) {
                    this_.generatePopup(layer, e.latlng, query, map,this_);
                });
            }

            MAP_VAR.map.on('draw:created', function(e) {
                console.log(e)
                var layer = e.layer;
                var center = typeof layer.getLatLng === 'function' ? layer.getLatLng() : layer.getBounds().getCenter();
                console.log(MAP_VAR.query)
                addClickEventForVector(layer, MAP_VAR.query, MAP_VAR.map);
                MAP_VAR.drawnItems.addLayer(layer);

                // "run next" - trigger the popup a bit later for maxiumum browser compatibility
                setTimeout(function() {
                    layer.fireEvent('click');
                }, 100);
            });

            MAP_VAR.map.on('draw:edited', function(e) {
                var layers = e.layers;

                layers.eachLayer(function(layer) {
                    this_.generatePopup(layer, layer._latlng, MAP_VAR.query, MAP_VAR.map);
                });
            });

            var baseLayers = this.getBaseLayers();

            // add the default base layer
            var storedLayerName = this.getStoredMapLayer();

            var defaultLayerName;
            if(storedLayerName in baseLayers) {
                defaultLayerName = storedLayerName;
            } else {
                defaultLayerName = this.$t('advancedsearch.js_map_layers_Minimal');
            }

            var defaultBaseLayer = baseLayers[defaultLayerName];
            MAP_VAR.map.addLayer(defaultBaseLayer);

            L.control.coordinates({ position: 'bottomright', useLatLngOrder: true }).addTo(MAP_VAR.map); // coordinate plugin
            //Layers menu
            // L.control.layers(baseLayers, {}, { collapsed: true, position: 'bottomleft' }).addTo(MAP_VAR.map);

            L.Util.requestAnimFrame(MAP_VAR.map.invalidateSize, MAP_VAR.map, !1, MAP_VAR.map._container);

            // MAP_VAR.map.on('baselayerchange', onBaseLayerChange);
        },
        /**
         Translations for leaflet-draw library
         */
        drawI18N:function () {
            L.Control.Fullscreen.title = this.$t('advancedsearch.draw_actions_title');
            L.drawLocal.draw.toolbar.actions.title = this.$t('advancedsearch.draw_actions_title');
            L.drawLocal.draw.toolbar.actions.text = this.$t('advancedsearch.draw_actions_text');
            L.drawLocal.draw.toolbar.finish.title = this.$t('advancedsearch.draw_finish_title');
            L.drawLocal.draw.toolbar.finish.text = this.$t('advancedsearch.draw_finish_text');
            L.drawLocal.draw.toolbar.undo.title = this.$t('advancedsearch.draw_undo_title');
            L.drawLocal.draw.toolbar.undo.text = this.$t('advancedsearch.draw_undo_text');
            L.drawLocal.draw.toolbar.buttons.polygon = this.$t('advancedsearch.draw_buttons_polygon');
            L.drawLocal.draw.toolbar.buttons.rectangle = this.$t('advancedsearch.draw_buttons_rectangle');
            L.drawLocal.draw.toolbar.buttons.circle = this.$t('advancedsearch.draw_buttons_circle');
            L.drawLocal.draw.handlers.polygon.tooltip.start = this.$t('advancedsearch.draw_polygon_tooltip_start');
            L.drawLocal.draw.handlers.polygon.tooltip.cont = this.$t('advancedsearch.draw_polygon_tooltip_cont');
            L.drawLocal.draw.handlers.polygon.tooltip.end = this.$t('advancedsearch.draw_polygon_tooltip_end');
            L.drawLocal.draw.handlers.rectangle.tooltip.start = this.$t('advancedsearch.draw_rectangle_tooltip_start');
            L.drawLocal.draw.handlers.simpleshape.tooltip.end = this.$t('advancedsearch.draw_simpleshape_tooltip_end');
            L.drawLocal.draw.handlers.circle.tooltip.start = this.$t('advancedsearch.draw_circle_tooltip_start');
            L.drawLocal.draw.handlers.circle.radius = this.$t('advancedsearch.draw_circle_radius');
            L.drawLocal.edit.toolbar.buttons.edit = this.$t('advancedsearch.draw_edit_toolbar_buttons_edit');
            L.drawLocal.edit.toolbar.actions.save.text = this.$t('advancedsearch.draw_edit_toolbar_actions_save_text');
            L.drawLocal.edit.toolbar.actions.save.title = this.$t('advancedsearch.draw_edit_toolbar_actions_save_title');
            L.drawLocal.edit.toolbar.actions.cancel.title = this.$t('advancedsearch.draw_edit_toolbar_actions_cancel_title');
            L.drawLocal.edit.toolbar.actions.cancel.text = this.$t('advancedsearch.draw_edit_toolbar_actions_cancel_text');
            L.drawLocal.edit.handlers.edit.tooltip.text = this.$t('advancedsearch.draw_edit_handlers_edit_tooltip_text');
            L.drawLocal.edit.handlers.edit.tooltip.subtext = this.$t('advancedsearch.draw_edit_handlers_edit_tooltip_subtext');
            // L.drawLocal.edit.toolbar.buttons.remove.remove = this.$t('advancedsearch.draw_edit_toolbar_buttons_remove_remove');
            L.drawLocal.edit.toolbar.actions.clearAll.text = this.$t('advancedsearch.draw_edit_toolbar_actions_clearAll_text');
            L.drawLocal.edit.toolbar.actions.clearAll.title = this.$t('advancedsearch.draw_edit_toolbar_actions_clearAll_title');
            L.drawLocal.edit.handlers.remove.tooltip.text = this.$t('advancedsearch.draw_edit_handlers_remove_tooltip_text');
        },

        // Stratigraphy search
        displayStratigraphyResults: function (item) {
            return this.$store.state.lang === 'et' ?  `${item.stratigraphy}` : `${item.stratigraphy_en}`
        },
        autocompliteStratigraphySearch(value) {
            this.autocompliteSearch(value, false, true,this.isStratLoading)
        },
        autocompliteHigherTaxaSearch(value) {
            this.autocompliteSearch(value, true, false, this.isHigherTaxaLoading)
        },
        autocompliteSearch(value,isHigher, isStrat,isLoading) {
            if(value.length < 3)  this.searchResults = [];
            if(value.length > 2) {
                let query = this.getAutocompleteQueryParameters(value,isHigher, isStrat)
                if(query.length === 0) return
                isLoading = true;
                if(isHigher === true){
                    fetchAutocompleteSearch(query).then((response) => {
                        isLoading = false;
                        this.searchResults = response.results
                    });
                } else {
                    fetchAutocompleteSearchStratigraphy(query).then((response) => {
                        isLoading = false;
                        this.searchResults = response.results
                    });
                }
            }
        },
        getAutocompleteQueryParameters(fieldValue,isHigher = false, isStrat = false) {
            let lowerFirstCh = fieldValue.charAt(0).toLowerCase()
            let upperFirstCh = fieldValue.charAt(0).toUpperCase()
            let str = fieldValue.substring(1).toLowerCase()
            if(isHigher === true)  {
                return `taxon:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/&fq=%7B%21collapse%20field--taxon%7D&fq=rank:[1%20TO%2013]`;
            }
            if(isStrat === true) {
                return `stratigraphy:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/OR stratigraphy_en:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/&fq=%7B%21collapse%20field--stratigraphy%7D`;
            }
        },
        setSearchParams() {
            return {
                higherTaxa:null,
                speciesField:null,
                authorField:null,
                localityField:null,
                freeTextLocality: null,
                stratigraphyField:null,
                isSubsurface: false,
                isNearMeSearch: false,
                geoparams:null,
                nearMeArea: null,
                radius:20,
                latlng:null
            }
        },
        clearSearch() {
            this.searchParams = this.setSearchParams();
            this.resetDrawnItemsColor();
            this.initialMessege = true;
            this.output = {};
            this.results = null;
        },
        getQueryParameters(geoparams = null) {
            function addFreeTextQueryParam(value, field){
                let lowerFirstCh = value.charAt(0).toLowerCase();
                let upperFirstCh = value.charAt(0).toUpperCase();
                let str = value.substring(1).toLowerCase();
                if(field === 'speciesField') return `taxon:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
                if(field === 'authorField') return `author_year:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
                if(field === 'localityField') return `(locality:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/OR locality_en:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/)`;
                return ''
            }
            let params = this.searchParams
            let query = ''
            Object.getOwnPropertyNames(params).slice(0,8).forEach(function (el) {
                if(params[el] === true) {
                    if(['isSubsurface'].includes(el)) query += `-locality:*puurauk AND `;
                } else if (!['isSubsurface','isNearMeSearch'].includes(el) && params[el] !== null && params[el] !== '') {
                    if(['higherTaxa'].includes(el)) query += `taxon_hierarchy:${params[el].hierarchy_string}* AND `;
                    else if(['stratigraphyField'].includes(el)) query += `(stratigraphy_hierarchy:${params[el].hierarchy_string}* OR global_stratigraphy_hierarchy:${params[el].hierarchy_string}*) AND `;
                    else if(el !== 'geoparams') query += `${addFreeTextQueryParam(params[el],el)} AND `;
                }
            });
            //remove last AND
            if(query.length > 0) query = `fq=${query.substring(0,query.length - 5)}&`;
            if(geoparams !== null) query += `${geoparams}&`;
            else if(params['geoparams'] !== null) query += `${params['geoparams']}&`;
            else if(params['isNearMeSearch'] === true && params['nearMeArea'] !== null) query += `${params['nearMeArea']}&`;
            return query
        },
        applySearch() {
            let query=this.getQueryParameters();
            if(query.length === 0) {
                this.clearSearch();
                return;
            }
            this.isLoadingResults = true;
            fetchAdvancedTaxonSearch(query, this.$store.state.searchParameters).then((response) => {
                this.results = response.results
                this.numberOfResutls = response.count
                this.resultsHandling()
            });
        },
        searchNearMe() {

        },
        resultsHandling() {
            this.initialMessege = false;
            this.isLoadingResults = false;
            let filteredByUniqueID = this.results
                // uniqBy(this.results,'taxon_id')
            let j = 0,output={},oorder=[],forder={}
            for(j in filteredByUniqueID) {
                let i = filteredByUniqueID[j]
                if(i['fossil_group_id'] === undefined) i['fossil_group'] = this.$store.state.lang='et'?'Määramata':'None';
                if (output[i['fossil_group_id']] === undefined) {
                    output[i['fossil_group_id']] = {
                        fossil_group_id: i['fossil_group_id'], fossil_group: i['fossil_group'], node: []
                    };
                    oorder.push(i['fossil_group_id'])
                }
                output[i['fossil_group_id']]['node'].push({
                    taxon: i['taxon'], taxon_id: i['taxon_id'], author_year: i['author_year'], fad : i['fad'], fad_en : i['fad_en'], lad : i['lad'], lad_en : i['lad_en']
                });
            }

            let output_=[], i = 0;
            for (i in oorder) {
                if(oorder[i] === output[oorder[i]]['fossil_group_id'])
                    output_.push(output[oorder[i]])
            }
            this.output = output_
        },
        isDefinedAndNotNull(value) { return !!value && value !== null },
        getLocation() {
            let this_ = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let geoparams = {getRadius() {return this_.searchParams.radius*1000}, getLatLng() { return {lat : position.coords.latitude, lng: position.coords.longitude}}}
                    this_.searchParams.latlng = {lat:position.coords.latitude,lng:position.coords.longitude}
                    this_.searchParams.nearMeArea = this_.getParamsForCircle(geoparams)
                    this_.drawAreaNearMe()
                },function (error) {
                    if (error.code == error.PERMISSION_DENIED)
                        this_.errorMessege = "Geolocation is not supported by this browser.";
                });
            }
        },
        drawAreaNearMe() {
            this.circle = this.circle === null ?
                new L.Circle(this.searchParams.latlng, this.searchParams.radius*1000, this.drawControls.options.draw.circle.shapeOptions):
                this.circle.setRadius(this.searchParams.radius*1000);
            this._map=this.map;
            this.isPopQueryTriggered = true;
            let this_=this;
            setTimeout(function() {
                this_._map=this_.map
                L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this_, this_.circle);
            }, 200);

        }
    },
    mounted (){
      this.initialiseMap()

    },
    watch: {
        '$store.state.searchParameters.advancedSearch': {
            handler: function (newVal, oldVal) {
                this.applySearch()
            }
        },
        'searchParams.isNearMeSearch': {
            handler: function (newVal, oldVal) {
                this.getLocation()
            }
        },
        'searchParams.radius': {
            handler: function (newVal, oldVal) {
                if(this.isPopQueryTriggered === true) return;
                this.drawAreaNearMe();
            },
            deep: true
        }
    }
}
</script>
