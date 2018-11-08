<template>
    <div v-if="mapData" id="map" style="height: 300px"></div>
</template>

<script>
    export default {
        name: "map-component",
        data() {
          return {
              map: null,
              tileLayer: null,
              layers: [
                  {id: 0, name: 'Specimen', active: true, features: []},
                  {id: 1, name: 'Taxon_occurrence', active: true, features: []},
                  {id: 2, name: 'sample + conop_distribution', active: true, features: []},
              ]
          }
        },
        computed : {
            mapData() {return this.$store.state.activeItem['map']}
        },
        mounted (){
            if(this.getLocationsObject(this.mapData)) {
                this.loadMap()
                this.initLayers()
                this.checkAllLayers()
            }
        },
        methods: {

            checkAllLayers() {
                this.layers.sort((a, b) => a.id - b.id);
                console.log(this.layers.sort((a, b) => a.id - b.id).reverse())
                for(let i = 0; i < this.layers.length; i++){
                    if(this.layers[i].active)
                        this.map.addLayer(this.layers[i].leaflatObjects)
                }
            },
            initLayers : function() {
              this.layers.forEach((layer) => {
                  let leaflatObjects = []
                  // const markerFeatures = layer.features.filter(feature => feature.type === 'circle');
                  layer.features.forEach((feature) => {
                      function setCustomSettings(type) {
                          let setting;
                          switch (type) {
                              case '1': setting = {color: 'rgba(240, 95, 37,0.7)', opacity: 0.7 ,weight:6, zIndexOffset: 1}; break;
                              case '2': setting = {color: 'rgba(240, 85, 199,0.7)', opacity: 0.7 ,weight:6, zIndexOffset: 2};break;
                              case '3': setting = {color: 'rgba(245, 134, 0,0.7)', opacity: 0.5 ,weight:6, zIndexOffset: 3};break;
                              default: break;
                          }
                          return setting
                      }
                      feature.leafletObject = L.circle(feature.coords,setCustomSettings(feature.type))
                          .bindPopup(feature.locid === null ? feature.name : '<a target="_blank" href="http://geocollections.info/locality/'+feature.locid+'">'+feature.name+'</a>',
                              {className: "custom-popup-text"})
                      // if(layer.active)feature.leafletObject.addTo(this.map)

                      leaflatObjects.push(feature.leafletObject)
                  });
                  layer.leaflatObjects = L.layerGroup(leaflatObjects)
              });

                let overlays = {
                    'Specimen':this.layers[0].leaflatObjects,
                    'Taxon_occurrence':this.layers[1].leaflatObjects,
                    'Sample + conop_distribution':this.layers[2].leaflatObjects
                };

                L.control.layers(null, overlays,{'autoZIndex':true,'collapsed':false,'sortLayers':true}).addTo(this.map);
            },

            loadMap : function() {
                document.getElementById('map').style.cursor = 'default';
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

                this.map.on('click', function() {
                    $(".layers input[type='checkbox']:checked").each(function() {
                        console.info(this.id, 'is checked');
                    });
                });

            },

            getLocationsObject : function(object) {
                if (object === undefined || object === {} || object === false || object.length === 0) return;
                let this_ = this;
                object.forEach(function(element,index) {
                    if (element.locality != null || element.locid != null) {
                        this_.layers[element['1']-1].features.push({
                            id: index,
                            coords: [element.latitude, element.longitude],
                            type: element['1'],
                            name: (this_.$store.state.lang === 'ee' ? element.locality : element.locality_en),
                            locid: element.locid
                        });
                    }
                });
                return true;
            },
        }
    }
</script>
<style>
    .custom-popup-text a{
        color:#F05F40;
        font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
        font-size: 10pt;
        text-align: left;
        font-weight: 700;
    }
</style>