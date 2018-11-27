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
                        <div class="card rounded-0" style="width: 100%">
                            <div class="card-body">
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.hightaxon')}}:</label></b-col>
                                    <b-col sm="8">
                                        <b-form-input id="input-small" size="sm" type="text" placeholder=""></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.species')}}:</label></b-col>
                                    <b-col sm="8">
                                        <b-form-input id="input-small" size="sm" type="text" placeholder=""></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.locality')}}:</label></b-col>
                                    <b-col sm="8">
                                        <b-form-input id="input-small" size="sm" type="text" placeholder=""></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"><label for="input-small">{{$t('advancedsearch.stratigraphy')}}:</label></b-col>
                                    <b-col sm="8">
                                        <b-form-input id="input-small" size="sm" type="text" placeholder=""></b-form-input>
                                    </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="4"></b-col>
                                    <b-col sm="8">
                                        <button  @click="searchNearMe()" type="button" class="btn btn-primary p-2" style="float: right;font-size: 0.8rem" variant="primary" >{{$t('advancedsearch.btn_show_fossils_near_me')}}</button>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </b-col>
                    <b-col md="6" class="mr-auto" style="padding-left:0.1rem !important;">
                        <div class="card rounded-0" style="width: 100%">
                            <div class="card-body  no-padding">
                                <div id="map" style="height: 300px"></div>
                            </div>
                        </div>
                    </b-col>
                </b-row>

            </div>
        </section>
    </section>
</template>

<script>
import {
    fetchHigherTaxonSearch
} from '../api'
export default {
  name: 'advanced-search-page',
    data() {
        return {
            map: null,
            drawnItems: null,
            layer: null,
            searchResults: [],
            isLoading: false,
        }
    },
    computed: {

    },
    methods: {
        getSpeciesCountInArea: function (params, speciesID) {
            $.getJSON(BC_CONF.biocacheServiceUrl + '/occurrence/facets.json' + params + '&facets=taxon_name&callback=?',
                function(data) {
                    document.getElementById(speciesID).innerHTML = data.length ? data[0].count : 0;
                });
        },
        getOccurrenceCountInArea: function (params, occurrenceID) {
            $.getJSON(BC_CONF.biocacheServiceUrl + '/occurrences/search.json' + params + '&pageSize=0&facet=off&callback=?',
                function(data) {
                    var occurrenceCount = data.totalRecords;

                    document.getElementById(occurrenceID).innerHTML = occurrenceCount;
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
            var baseCountParams = this.getParamsForObject(this.getExistingParams(query), true);
            var baseLinkParams = this.getParamsForObject(this.getExistingParams(query), false);
            var countParams = '?' + baseCountParams + geomParams;
            var linkParams = '?' + baseLinkParams + geomParams;

            if(!latlng) {
                if($.isFunction(layer.getBounds)) {
                    latlng = layer.getBounds().getCenter();
                } else {
                    latlng = layer.getLatLng();
                }
            }
            // CHANGED
            // var recordsLink = BC_CONF.contextPath + '/occurrences/search' + linkParams + '#map';
            var recordsLink = "URL"
            var coordsStr = latlng.lat + '-' + latlng.lng;
            var speciesID = 'speciesCount-' + coordsStr;
            var occurrenceID = 'occurrenceCount-' + coordsStr;

            L.popup()
                .setLatLng(latlng)
                .setContent(
                    this.$t('advancedsearch.js_map_popup_speciescount') + ': ' +
                    '<b id="' + speciesID + '">' + this.$t('advancedsearch.calculating') + '</b>' +
                    '<br />' +
                    this.$t('advancedsearch.js_map_popup_occurrencecount') + ': ' +
                    '<b id="' + occurrenceID + '">' + this.$t('advancedsearch.calculating') + '</b>' +
                    '<br />' +
                    '<a id="showOnlyTheseRecords" href="' + recordsLink + '">' +
                    '<span class="fa fa-search"></span> ' +
                    this.$t('advancedsearch.js_map_popup_linkText') +
                    '</a>'
                )
                .openOn(map);

            // this.getSpeciesCountInArea(countParams, speciesID);
            // getOccurrenceCountInArea(countParams, occurrenceID);
        },
        getParamsForWKT: function(wkt, query) {
            return '&wkt=' + encodeURI(wkt.replace(' ', '+'));
        },

        getParamsForCircle: function (circle, query) {
            var latlng = circle.getLatLng();
            var radius = Math.round((circle.getRadius() / 1000) * 10) / 10; // convert to km (from m) and round to 1 decmial place

            return '&radius=' + radius + '&lat=' + latlng.lat + '&lon=' + latlng.lng;
        },
        getParamsForObject:function(paramsObj, joinValues) {
            // var params = Object.keys(paramsObj).map(function(key) {
            //     var value = paramsObj[key]; // TODO Encode.
            //
            //     if(joinValues && Array.isArray(value)) {
            //         // Join values of a param.
            //         value = '(' + value.map(encodeURI).join('+AND+') + ')';
            //     } else if(Array.isArray(value)) {
            //         // HACK XXX Extend param value to include instances of itself, with different values.
            //         value = value.map(encodeURI).join('&' + key + '=');
            //     } else {
            //         value = encodeURI(value);
            //     }
            //
            //     return key + '=' + value;
            // });
            //
            // return params.join('&');
            return
        },
        getExistingParams:function (query) {
            var paramsObj
                // = $.url(query).param();

            // if(!paramsObj.q) {
            //     paramsObj.q = '*:*';
            // }
            //
            // delete paramsObj.wkt;
            // delete paramsObj.lat;
            // delete paramsObj.lon;
            // delete paramsObj.radius;
            //
            // paramsObj.qc = BC_CONF.queryContext;

            return paramsObj;
        },
        drawWktObj:function (wktString) {
            var wkt = new Wkt.Wkt();
            wkt.read(wktString);
            var wktObject = wkt.toObject({ color: '#bada55' });
            this.generatePopup(wktObject, null, MAP_VAR.query, MAP_VAR.map);
            addClickEventForVector(wktObject, MAP_VAR.query, MAP_VAR.map);
            MAP_VAR.drawnItems.addLayer(wktObject);

            if(wktObject.getBounds !== undefined && typeof wktObject.getBounds === 'function') {
                // For objects that have defined bounds or a way to get them
                MAP_VAR.map.fitBounds(wktObject.getBounds());
            } else {
                if(focus && wktObject.getLatLng !== undefined && typeof wktObject.getLatLng === 'function') {
                    MAP_VAR.map.panTo(wktObject.getLatLng());
                }
            }
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
                    this_.generatePopup(layer, e.latlng, query, map);
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
            return `${item.name}`
        },
        autocompliteSearch(value) {
            if(value.length < 3)  this.searchResults = [];
            if(value.length > 2) {
                this.isLoading = true;
                fetchHigherTaxonSearch(value).then((response) => {
                    this.isLoading = false;
                    this.searchResults = response.results
                });
            }
        },
        searchNearMe() {

        }
    },
    mounted (){
        this.initialiseMap()

    },
    watch: {
    '$store.state.lang': {
      handler: function(newVal,oldVal) {

      }
    }
  },
}
</script>
