<template>
    <div class="mx-auto row p-3" v-if="taxon !== undefined" >
        <div class="col-lg-2">
            <router-link v-bind:to="'/'+taxon.fossil_group__id" v-if="taxon.fossil_group__id != null">
                <img border="0" :src="'/static/fossilgroups/'+taxon.fossil_group__id+'.png'" :alt="taxon.fossil_group__taxon"
                     :title="taxon.fossil_group__taxon" style="height: 80px; margin-top: 0px; padding-right: 0px;" />
                <br />{{ taxon.fossil_group__taxon }}
            </router-link>
            <router-link v-bind:to="'/'+taxon.id" v-else-if="taxon.is_fossil_group == 1">
                <img border="0" :src="'/static/fossilgroups/'+ taxon.id+'.png'" :alt="taxon.taxon"
                     :title="taxon.taxon" style="height: 95px; margin-top: 0; padding-right: 0px;" />
                <br />{{taxon.fossil_group__taxon}}
            </router-link>
        </div>
        <div :class="$router.currentRoute.name =='Proto' ? 'col-lg-6' : 'col-lg-6'">
            <span> {{taxonTitle}} </span><br />
            <div v-if="taxon.fossil_group__id && (taxon.rank__rank_en === 'Species' || taxon.rank__rank_en === 'Genus')"> {{$t('header.f_fossil_group')}}:
                <router-link v-bind:to="'/'+taxon.fossil_group__id">{{taxon.fossil_group__taxon}}</router-link></div>
            <span style="font-size: 0.7em;" v-translate="{ et: taxon.rank__rank, en: taxon.rank__rank_en }"></span>
            <span style="font-size: 18pt"> {{taxon.taxon}}</span>
            <span style="font-size: 0.7em;"> {{taxon.author_year}}</span>
            <span class="row p-3" v-if="filteredCommonNames && filteredCommonNames.length > 0 && $router.currentRoute.name ==='Proto'">
                                        <span  v-for="item in filteredCommonNames"><strong>{{item.language}}</strong>: {{item.name}}; &ensp;</span>
                                    </span>
        </div>
        <div :class="$router.currentRoute.name =='Proto' ? 'col-lg-4' : 'col-lg-4'">
            <lingallery v-if="images && images.length > 0 && $router.currentRoute.name === 'Proto' " ref="lingallery" :width="400" :height="350" :items="images "/>
        </div>
    </div>
</template>

<script>
    import filter from 'lodash/filter';
    import Lingallery from "./Lingallery.vue";
    export default {
        name: "TaxonTitle",
        components: {Lingallery},
        computed: {
            taxon () { return this.$store.state.activeItem['taxon'] },
            images () { return this.$parent.images},
            taxonTitle: function() {
                let lang = this.$store.state.lang;
                if (this.taxonPage && this.taxonPage.title)
                    return this.taxonPage.title
                let activeCommonName = filter(this.$parent.commonNames, function(o) {
                    return o.language === lang && o.is_preferred === 1});

                if (activeCommonName.length > 0)
                    return activeCommonName[0].name
            },
            filteredCommonNames () {return this.$parent.filteredCommonNames},

        }
    }
</script>

<style scoped>

</style>