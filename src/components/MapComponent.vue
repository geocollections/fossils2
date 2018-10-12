<template>
    <div id="map" style="height: 300px;border-radius: 6px;"></div>
</template>

<script>
    export default {
        name: "map-component",
        data() {
          return {
            locations : [],
          }
        },

        computed : {
            mapData() {return this.$store.state.activeItem['map']}
        },
        mounted (){
            this.getLocationsObject(this.mapData)
            this.loadMap()
        },
        'mapData': {
            handler: function (newval, oldval) {
                console.log(newval)
            }
        },
        methods: {
          loadMap : function(arr) {
            if (this.locations && this.locations.length > 0) {
              this.$nextTick(() => {
                  initMap(this.locations)
              })

            }
          },
            getLocationsObject : function(object, isImportantLocality = false) {
                if (object === undefined || object === {} || object === false || object.length === 0) return;
                let lang = this.lang;
                let this_ = this
                object.forEach(function(element) {
                    if (element.locality != null || element.locid != null) {
                        this_.locations.push({
                            lat : element.latitude,
                            long: element.longitude,
                            locality: (lang === 'ee' ? element.locality
                                : element.locality_en),
                            locid: element.locality ? element.locality : element.locality_id,
                            isImportantLocality: isImportantLocality
                        });
                    }
                });
            },
        }
    }
</script>
