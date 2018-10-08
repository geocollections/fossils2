<template>
    <div class="container-fluid p-5">
        <div id='fossilgroups_box'>
            <div class='fossilgroup_box'  v-for = "item in content">
                <router-link v-bind:to="'/'+item.taxon" :title="item.taxon__taxon" >
                        <img :src="'/static/fossilgroups/'+item.taxon+'.png'" :alt="item.frontpage+' ('+item.taxon__taxon+')'">{{item.frontpage}}
                </router-link>
            </div>
        </div>
        <!--<div class="row" v-if="content">-->
            <!--<div class="col-lg-1"></div>-->
            <!--<div class="col-lg-10">-->
                <!--<div class="card border-0 rounded-0">-->
                    <!--<div class="row m-3" v-for = "col in groupedImgs">-->
                        <!--<div class="col-lg-2" v-for="item in col">-->
                            <!--<router-link v-bind:to="'/'+item.taxon" :title="item.taxon__taxon" >-->
                                <!--<div class="card bg-light text-white  rounded-0">-->
                                    <!--<img class="card-img" :src="'/static/fossilgroups/'+item.taxon+'.png'" :alt="item.frontpage+' ('+item.taxon__taxon+')'">-->
                                    <!--<div class="card-img-overlay d-flex flex-column justify-content-end">-->
                                        <!--<div class="bg-dark card-title" style="background-color:rgba(0, 0, 0, 0.4) !important;">{{item.frontpage}}</div>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</router-link>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="col-lg-1"></div>-->
        <!--</div>-->
    </div>
</template>

<script>
export default {
  name: 'front-page',
  computed: {
    content : function() {
        return this.$store.state.lang === 'et' ? this.$store.state.frontPage.et : this.$store.state.frontPage.en
    },
    groupedImgs : function () {
        if (this.content.length === 0) return
        let arr = this.content
        let imgs = [];
        let numberOfImgsInRow = 6
        let row = []
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i]
            row.push(item)
            if (i !== 0  && i % (numberOfImgsInRow) === 5 || i === arr.length-1) {
                imgs.push(row);
                row = [];
            }
        }

        return imgs
    }
  },
  methods: {
      isRowCreated: function (index) {
          return [3,7, 11, 15].includes(parseInt(index))
      }
  },
  watch: {
    '$store.state.lang': {
      handler: function(newVal,oldVal) {
        let lang = this.$store.state.lang;
        this.$store.dispatch('FETCH_FRONT_PAGE', { lang })
      }
    }
  },
  asyncData ({ store}) {
    let lang = store.state.lang
    return store.dispatch('FETCH_FRONT_PAGE', { lang })
  }
}
</script>
<style scoped>

</style>