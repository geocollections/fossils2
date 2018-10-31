<template>
    <div id="map" style="height: 300px"></div>
</template>

<script>
    export default {
        name: "map-component",
        data() {
          return {
              map: null,
              tileLayer: null,
              layers: [
                  {
                      id: 0,
                      name: 'Restaurants',
                      active: true,
                      features: [],
                  },
              ],
            locations : [],
          }
        },

        computed : {
            mapData() {return this.$store.state.activeItem['map']}
        },
        mounted (){
            this.getLocationsObject(this.mapData)
            if (this.locations && this.locations.length > 0) {
                this.layers[0].features = this.locations
                this.loadMap()
                this.initLayers()
                this.layerChanged(0, true)
            }
        },
        'mapData': {
            handler: function (newval, oldval) {
                console.log(newval)
            }
        },
        methods: {
            layerChanged(layerId, active) {
                /* Show or hide the features in the layer */
                const layer = this.layers.find(layer => layer.id === layerId);
                layer.features.forEach((feature) => {
                    /* Show or hide the feature depending on the active argument */
                    if (active) {
                        feature.leafletObject.addTo(this.map);
                    } else {
                        feature.leafletObject.removeFrom(this.map);
                    }
                });


            },
          initLayers : function() {
              this.layers.forEach((layer) => {
                  const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                  markerFeatures.forEach((feature) => {
                      feature.leafletObject = L.circleMarker(feature.coords,{radius: 2},{ fillColor: 'rgba(236, 102, 37,0.7)', opacity: 0.9 })
                          .bindPopup('<a target="_blank" href="http://geocollections.info/locality/'+feature.locid+'">'+feature.name+'</a>');
                  });
              });


          },
          loadMap : function(arr) {

            document.getElementById('map').style.cursor = 'default'
            this.map = L.map('map',{
                fullscreenControl: true,
            }).setView([58.5,20.5], 4);
            this.tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w',
                {
                    minZoom: 4,
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }
            );
            this.tileLayer.addTo(this.map);

          },

            getLocationsObject : function(object, isImportantLocality = false) {
                if (object === undefined || object === {} || object === false || object.length === 0) return;
                let lang = this.lang;
                let this_ = this
                object.forEach(function(element,index) {
                    if (element.locality != null || element.locid != null) {
                        this_.locations.push({
                            id:index,
                            coords : [element.latitude,element.longitude],
                            type: 'marker',
                            name: (lang === 'ee' ? element.locality
                                : element.locality_en),
                            locid: element.locid,
                            isImportantLocality: isImportantLocality
                        });
                    }
                });
            },
            // getLocationsObject : function(object, isImportantLocality = false) {
            //     if (object === undefined || object === {} || object === false || object.length === 0) return;
            //     let lang = this.lang;
            //     let this_ = this
            //     object.forEach(function(element) {
            //         if (element.locality != null || element.locid != null) {
            //             this_.locations.push({
            //                 lat : element.latitude,
            //                 long: element.longitude,
            //                 locality: (lang === 'ee' ? element.locality
            //                     : element.locality_en),
            //                 locid: element.locality ? element.locality : element.locality_id,
            //                 isImportantLocality: isImportantLocality
            //             });
            //         }
            //     });
            // },
        }
    }
</script>