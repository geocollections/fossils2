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
        props: ['taxonOccurrence','taxonTypeSpecimen','specimenIdentification'],

        mounted (){
          this.getLocationsObject(this.$props.taxonOccurrence);
          this.getLocationsObject(this.$props.taxonTypeSpecimen, true);
          this.getLocationsObject(this.uniqueLocations(this.$props.specimenIdentification));
          this.loadMap()
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
            if (object === undefined) return;
            let lang = this.lang;
            let this_ = this
            object.forEach(function(element) {
              if (element.locality != null || element.locality_id != null) {

                this_.locations.push({
                  lat : element.locality__latitude,
                  long: element.locality__longitude,
                  locality: (lang === 'ee' ? element.locality__locality
                    : element.locality__locality_en),
                  locid: element.locality ? element.locality : element.locality_id,
                  isImportantLocality: isImportantLocality
                });
              }
            });
          },
          uniqueLocations : function(locs) {
            if (locs === undefined) return
            return locs.filter((s1, pos, arr) => arr.findIndex((s2)=>s2.locality_id === s1.locality_id) === pos)
          }
        }
    }
</script>
