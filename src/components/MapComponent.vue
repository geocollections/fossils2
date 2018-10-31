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
                      active: true,
                      features: [],
                  },
              ]
          }
        },
        computed : {
            mapData() {return this.$store.state.activeItem['map']}
        },
        mounted (){
            this.getLocationsObject(this.mapData)
            if (this.layers[0].features && this.layers[0].features.length > 0) {
                this.loadMap()
                this.initLayers()
            }
        },
        methods: {
          initLayers : function() {
              this.layers.forEach((layer) => {
                  const markerFeatures = layer.features.filter(feature => feature.type === 'circle');
                  markerFeatures.forEach((feature) => {
                      feature.leafletObject = L.circle(feature.coords,{color:'rgba(236, 102, 37,0.7)', opacity: 0.7,weight:6})
                          .bindPopup('<a target="_blank" href="http://geocollections.info/locality/'+feature.locid+'">'+feature.name+'</a>',
                              {className: "custom-popup-text"})
                          .addTo(this.map)
                  });
              });
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

          },

            getLocationsObject : function(object, isImportantLocality = false) {
                if (object === undefined || object === {} || object === false || object.length === 0) return;
                let lang = this.$store.state.lang;
                let this_ = this;
                object.forEach(function(element,index) {
                    if (element.locality != null || element.locid != null) {
                        this_.layers[0].features.push({
                            id:index,
                            coords : [element.latitude,element.longitude],
                            type: 'circle',
                            name: (lang === 'ee' ? element.locality : element.locality_en),
                            locid: element.locid,
                            isImportantLocality: isImportantLocality
                        });
                    }
                });
            },
        }
    }
</script>
<style>
    .leaflet-popup-content a {

    }
    .custom-popup-text a{
        color:#F05F40;
        font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
        font-size: 10pt;
        text-align: left;
        font-weight: bold;
    }
</style>