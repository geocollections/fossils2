<template>
    <section>
        <section class="container-fluid mt-0">
            <div class="page-container">
                <b-row class="text-center">
                    <b-col>
                        <h1 class="text-center">{{ $t('menu.detail_search')}}</h1>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="6" class="ml-auto"  style="padding-right:0.1rem !important;">
                        <div class="card rounded-0" style="width: 100%;height: 100%">
                            <div class="card-body">
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.hightaxon')}}:</label></b-col>
                                    <b-col sm="8">
                                        <vue-multiselect class="align-middle" v-model="higherTaxa" deselect-label="Can't remove this value"
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
                                        <b-form-input id="input-small" size="sm" type="text" placeholder="" v-model="speciesField"></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.locality')}}:</label></b-col>
                                    <b-col sm="8">
                                        <vue-multiselect class="align-middle"
                                                         ref="localitySearch"
                                                         id="localitySearch"
                                                         v-model="localityField"
                                                         :custom-label="displayLocalityResults"
                                                         :options="searchResults"
                                                         :searchable="true"
                                                         :loading="isLocLoading"
                                                         :max-height="600"
                                                         :show-no-results="false"
                                                         :show-labels="false"
                                                         :open-direction="'bottom'"
                                                         @close="onTouch"
                                                         :block-keys="['Tab', 'Enter']"
                                                         @select="onLocSelect" @search-change="autocompliteLocalitySearch">
                                            <template slot="noResult"><b>NoRes</b></template>
                                            <template slot="clear" slot-scope="props">
                                                <div class="multiselect__clear" @mousedown.prevent.stop="clearAll(props.search)"></div></template>
                                        </vue-multiselect>
                                        <!--<b-form-input id="input-small" size="sm" type="text" placeholder=""disabled v-model="localityField"></b-form-input>-->
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.stratigraphy')}}:</label></b-col>
                                    <b-col sm="8">
                                        <vue-multiselect class="align-middle"
                                                         id="stratigraphySearch"
                                                         v-model="stratigraphyField"
                                                         :custom-label="displayStratigraphyResults" track-by="code"
                                                         :options="searchResults"
                                                         :searchable="true"
                                                         :loading="isStratLoading"
                                                         :max-height="600"
                                                         :show-no-results="false"
                                                         :show-labels="false"
                                                         :open-direction="'bottom'"
                                                         @select="onStratSelect" @search-change="autocompliteStratigraphySearch">
                                            <template slot="noResult"><b>NoRes</b></template>
                                        </vue-multiselect>
                                        <!--<b-form-input id="input-small" size="sm" type="text" placeholder="" disabled v-model="stratigraphyField"></b-form-input>-->
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"></b-col>
                                    <b-col sm="8">
                                        <b-button  @click="applySearch()" type="button" class="btn btn-primary p-2" style="float: right;font-size: 0.8rem" variant="primary" :disabled="isSearchDisabled">Search</b-button>
                                        <b-button  @click="clearSearch()" type="button" class="btn btn-outline-info p-2 mr-2" style="float: right;font-size: 0.8rem" variant="info" :disabled="isSearchDisabled">Clear</b-button>
                                        <!--<button  @click="searchNearMe()" type="button" class="btn btn-primary p-2" style="float: right;font-size: 0.8rem" variant="primary" >{{$t('advancedsearch.btn_show_fossils_near_me')}}</button>-->
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
                    <b-col md="12" v-if="initialMessege && !isLoadingResults">
                        <b-alert show variant="info" v-if="!!initialMessege">Some initial instructions</b-alert>
                    </b-col>

                    <b-col md="12" v-if="!initialMessege">
                        <b-row v-if="isLoadingResults">
                            <spinner  :show="isLoadingResults"></spinner><span class="p-2">{{$t('messages.pageLoading')}}</span>
                        </b-row>
                        <div class="card rounded-0" v-if="!isLoadingResults">
                            <div class="card-body">
                                <h1 id="results" class="pb-4" v-if="results">{{results.length}} Species found:</h1>

                                <span v-for="group in output">
                                    <span><img :src="'/static/fossilgroups/'+group.fossil_group_id+'.png'" style="width: 80px;" />
                                        <h1 style="display: inline;"><a :href="'/'+group.fossil_group_id">{{group.fossil_group}}</a></h1></span>
                                    <b-row v-for="species in group.node" style="padding-left: 7rem" v-bind:key="species.taxon_id">
                                        <b-col sm="4"><em><a :href="'/'+species.id">{{species.taxon}}</a></em> {{species.author_year}}</b-col>
                                        <b-col sm="8"><span v-translate="{ et: species.strat, en: species.strat_en}"></span></b-col>
                                    </b-row>
                                </span>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </section>
    </section>
</template>

<script>
    import uniqBy from 'lodash/uniqBy';
    import VueMultiselect from 'vue-multiselect'
import {
    fetchAutocompleteSearch,
    fetchOccurrenceCountInArea,
    fetchAdvancedTaxonSearch,
    fetchTaxonSearchInSelectedArea,
    fetchSpeciesCountInArea
} from '../api'
    import Spinner from "../components/Spinner.vue";
export default {
  name: 'advanced-search-page',
    components:  {
        Spinner,
        VueMultiselect
    },
    data() {
        return {
            initialMessege: true,
            speciesField:null,
            localityField:null,
            freeTextLocality: null,
            stratigraphyField:null,
            higherTaxa:null,
            output: {},
            map: null,
            drawnItems: null,
            layer: null,
            searchResults: [],
            isLoadingResults:false,
            isHigherTaxaLoading: false,
            isLocLoading: false,
            isStratLoading: false,
            results:[],

            value: null,
            options: [
                { name: 'Vue.js', language: 'JavaScript' },
                { name: 'Rails', language: 'Ruby' },
                { name: 'Sinatra', language: 'Ruby' },
                { name: 'Laravel', language: 'PHP', $isDisabled: true },
                { name: 'Phoenix', language: 'Elixir' }
            ]

        }
    },
    computed: {
        isSearchDisabled() {
            if((this.higherTaxa !== null && this.higherTaxa !== '') ||
                (this.speciesField !== null && this.speciesField !== '') ||
                (this.localityField !== null && this.localityField !== '') ||
                (this.stratigraphyField !== null && this.stratigraphyField !== ''))
                return false
            return true;
        }
    },
    methods: {

        getSpeciesCountInArea: function (query,speciesID) {
            fetchSpeciesCountInArea(query).then((response) => {
                document.getElementById(speciesID).innerHTML = response.count ? response.count : 0;
            });
        },
        getOccurrenceCountInArea: function (query, occurrenceID) {
            fetchOccurrenceCountInArea(query).then((response) => {
                document.getElementById(occurrenceID).innerHTML = response.count ? response.count : 0;
            });
        },
        generatePopup: function(layer, latlng, query, map) {
            var geomParams = '';

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
            console.log(geomParams)
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
            var this_ = this
            this_.getSpeciesCountInArea(geomParams, speciesID);
            this_.getOccurrenceCountInArea(geomParams, occurrenceID);
            L.popup()
                .setLatLng(latlng)
                .setContent(
                    this.$t('advancedsearch.js_map_popup_speciescount') + ': ' +
                    '<b id="' + speciesID + '">' + this.$t('advancedsearch.calculating') + '</b>' +
                    '<br />' +
                    this.$t('advancedsearch.js_map_popup_occurrencecount') + ': ' +
                    '<b id="' + occurrenceID + '">' + this.$t('advancedsearch.calculating') + '</b>' +
                    '<br />' +
                    '<a id="showOnlyTheseRecords" href="#results" onclick="return;">' +
                    '<span class="fa fa-search"></span> ' +
                    this.$t('advancedsearch.js_map_popup_linkText') +
                    '</a>'
                )
                .openOn(map);

            $('#showOnlyTheseRecords').on("click", function(event){
                this_.map.closePopup();
                this_.applyMapSearch(geomParams)


            })
        },
        getParamsForWKT: function(wkt) {
            let coordsPairs = wkt.split(',')
            // second and fourth pairs' places changed
            if (coordsPairs.length === 5) {
                let secondPair = coordsPairs[1]
                coordsPairs[1] = coordsPairs[3]
                coordsPairs[3] = secondPair
            }
            let changedWkt = coordsPairs.join(',')
            return `fq=%7B%21field%20f--latlong%7DisWithin(${changedWkt})`
        },

        getParamsForCircle: function (circle) {
            var latlng = circle.getLatLng();
            var radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place
            return `fq=%7B%21geofilt%7D&d=${radius}&pt=${latlng.lat},${latlng.lng}&sfield=latlong`
        },


        // drawWktObj:function (wktString) {
        //     var wkt = new Wkt.Wkt();
        //     wkt.read(wktString);
        //     var wktObject = wkt.toObject({ color: '#bada55' });
        //     this.generatePopup(wktObject, null, MAP_VAR.query, MAP_VAR.map );
        //     addClickEventForVector(wktObject, MAP_VAR.query, MAP_VAR.map);
        //     MAP_VAR.drawnItems.addLayer(wktObject);
        //
        //     if(wktObject.getBounds !== undefined && typeof wktObject.getBounds === 'function') {
        //         // For objects that have defined bounds or a way to get them
        //         MAP_VAR.map.fitBounds(wktObject.getBounds());
        //     } else {
        //         if(focus && wktObject.getLatLng !== undefined && typeof wktObject.getLatLng === 'function') {
        //             MAP_VAR.map.panTo(wktObject.getLatLng());
        //         }
        //     }
        // },
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
                center: [58.5,20.5],
                zoomControl: false,
                zoom: 4,
                minZoom: 1,
                scrollWheelZoom: false
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
            var drawControls = new L.Control.Draw({
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

            MAP_VAR.map.addControl(drawControls);

            /*  Common map (Leaflet) functions */
            function addClickEventForVector(layer, query, map) {
                layer.on('click', function(e) {
                    this_.generatePopup(layer, e.latlng, query, map,this_);
                });
            }

            MAP_VAR.map.on('draw:created', function(e) {
                var layer = e.layer;
                var center = typeof layer.getLatLng === 'function' ? layer.getLatLng() : layer.getBounds().getCenter();

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

        // Higher Taxon search
        displayResults: function (item) {
            return `${item.taxon}`
        },
        // Locality search
        displayLocalityResults: function (item) {
            return this.$store.lang === 'et' ?  `${item.locality}` : `${item.locality_en}`
        },
        // Stratigraphy search
        displayStratigraphyResults: function (item) {
            return this.$store.lang === 'et' ?  `${item.stratigraphy}` : `${item.stratigraphy_en}`
        },
        onHigherTaxaSelect: function(item){this.higherTaxa = item},

        onLocSelect: function(item){
            this.localityField = this.$store.lang === 'et' ? item.locality : item.locality_en
        },
        clearAll:function () {

        },
        onTouch: function(){},
        // clearAll: function(){this.localityField = null},
        onStratSelect: function(item){this.stratigraphyField = item},
        autocompliteLocalitySearch(value) {
            this.freeTextLocality = value;
            this.autocompliteSearch(value, false,true, false, this.isLocLoading)
        },
        autocompliteStratigraphySearch(value) {
            this.autocompliteSearch(value, false, false,true,this.isStratLoading)
        },
        autocompliteHigherTaxaSearch(value) {
            this.autocompliteSearch(value, true, false,false, this.isHigherTaxaLoading)
        },
        autocompliteSearch(value,isHigher, isLoc, isStrat,isLoading) {

            if(value.length < 3)  this.searchResults = [];
            if(value.length > 2) {
                let query = this.getQueryParameters(value,isHigher, isLoc, isStrat, true)
                if(query.length === 0) return
                isLoading = true;
                fetchAutocompleteSearch(query).then((response) => {
                    isLoading = false;
                    this.searchResults = response.results
                });
            }
        },
        getQueryParameters(fieldValue,isHigher = false, isLoc = false, isStrat = false, isAutocompleteSearch = false) {
            let q = ''
            if(this.isDefinedAndNotNull(fieldValue)) {
                let lowerFirstCh = fieldValue.charAt(0).toLowerCase()
                let upperFirstCh = fieldValue.charAt(0).toUpperCase()
                let str = fieldValue.substring(1).toLowerCase()
                if(isHigher === true)  {
                    q += `taxon:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/&fq=rank:[1%20TO%2013]`;
                    if(isAutocompleteSearch === true) q += `&fq=%7B%21collapse%20field--taxon%7D`;
                }
                if(isLoc === true) {
                    q += `locality:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/OR locality_en:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`
                    if(isAutocompleteSearch === true) q += `&fq=%7B%21collapse%20field--locality%7D`;
                } // OR locality_free:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
                if(isStrat === true) {
                    q += `stratigraphy:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/OR stratigraphy_en:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/`;
                    if(isAutocompleteSearch === true) q += `&fq=%7B%21collapse%20field--stratigraphy%7D`;
                }
                if(isHigher=== false && isLoc=== false && isStrat=== false) {
                    q += `taxon:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/%20OR%20author_year:/.*[${upperFirstCh},${lowerFirstCh}]${str}.*/&fq=rank:[14%20TO%2017]`
                    if(isAutocompleteSearch === true) q += `&fq=%7B%21collapse%20field--taxon%7D`;
                }

            }

            return q
        },
        applyMapSearch(geoParams) {
            this.isLoadingResults = true
            fetchTaxonSearchInSelectedArea(geoParams).then((response) => {
                this.results = response.results
                this.resultsHandling_()
            });
        },
        clearSearch() {
            this.speciesField = null;
            this.higherTaxa = null;
            this.localityField = null;
            this.stratigraphyField = null;
        },
        applySearch() {
            let query='';
            if (this.isDefinedAndNotNull(this.speciesField))
                query = this.getQueryParameters(this.speciesField);
            else if (this.higherTaxa && this.isDefinedAndNotNull(this.higherTaxa.taxon_hierarchy))
                query = `taxon_hierarchy:${this.higherTaxa.taxon_hierarchy}*&fq=rank:[1%20TO%2013]`;
            if (this.isDefinedAndNotNull(this.localityField)) {
                let localityField = this.$store.lang === 'et' ? this.localityField.locality : this.localityField.locality_en
                if(query.length !== 0) query += ` AND `
                query += this.getQueryParameters(localityField, false, true, false);
            }

            if (this.stratigraphyField && this.isDefinedAndNotNull(this.stratigraphyField.taxon_hierarchy)) {
                if(query.length !== 0) query += ` AND `
                query += `taxon_hierarchy:${this.stratigraphyField.taxon_hierarchy}*`;
            }

            if(query.length === 0) return
            this.isLoadingResults = true
            fetchAdvancedTaxonSearch(query).then((response) => {
                this.results = response.results
                this.resultsHandling_()
            });
        },
        searchNearMe() {

        },
        resultsHandling_() {
            this.initialMessege = false;
            this.isLoadingResults = false;
            let filteredByUniqueID = this.results
                // uniqBy(this.results,'taxon_id')
            let j = 0,output={},oorder=[],forder={}
            for(j in filteredByUniqueID) {
                let i = filteredByUniqueID[j]
                if (output[i['fossil_group_id']] === undefined) {
                    output[i['fossil_group_id']] = {
                        fossil_group_id: i['fossil_group_id'], fossil_group: i['fossil_group'], node: []
                    };
                    oorder.push(i['fossil_group_id'])
                }
                output[i['fossil_group_id']]['node'].push({
                    taxon: i['taxon'], taxon_id: i['taxon_id'], strat : i['stratigraphy'],strat_en : i['stratigraphy_en']
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
    },
    mounted (){
      this.$refs.localitySearch.style =
      // this.resultsHandling()
      this.initialiseMap()

    },
    watch: {
    '$refs.localitySearch.value': {
      handler: function(newVal,oldVal) {
          console.log(newVal)
      },
        deep: true
    }
  },
}
</script>
