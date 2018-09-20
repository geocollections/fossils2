<template>
    <div>
        <span v-if="$parent.taxonPage && $parent.taxonPage.link_wikipedia != null" >
        <a :href="'http://'+$store.state.lang+'.wikipedia.org/wiki/'+$parent.taxonPage.link_wikipedia">{{$t('header.f_link_wikipedia')}}</a><br/>
        </span>
        <span v-if="$parent.taxon.taxon_id_tol != null" >
        <a :href="'http://tolweb.org/'+$parent.taxon.taxon_id_tol">{{$t('header.f_link_tolweb')}}</a><br/>
        </span>
        <span v-if="$parent.taxon.taxon_id_eol != null" >
        <a :href="'http://www.eol.org/pages/'+$parent.taxon.taxon_id_eol">{{$t('header.f_link_eol')}}</a><br/>
        </span>
        <span v-if="$parent.taxon.taxon_id_nrm != null" >
        <a v-if="$parent.taxon.taxon_id_nrm != null" :href="'http://naturforskaren.se/species/'+$parent.$parent.taxon.taxon_id_nrm">{{$t('header.f_link_naturforskaren')}}</a><br/>
        </span>
        <span v-if="$parent.taxon.taxon_id_plutof != null" >
        <a v-if="$parent.taxon.taxon_id_plutof != null" :href="'http://elurikkus.ut.ee/elr_tree.php?id='+$parent.taxon.taxon_id_plutof">{{$t('header.f_link_plutof')}}</a><br/>
        </span>
        <span v-if="$parent.taxon.taxon_id_pbdb != null" >
        <a v-if="$parent.taxon.taxon_id_pbdb != null" :href="'https://paleobiodb.org/cgi-bin/bridge.pl?a=checkTaxonInfo&taxon_no='+$parent.taxon.taxon_id_pbdb">Paleobiology Database</a>
        </span>
    </div>
</template>

<script>
    export default {
        name: "SeeAlso"
    }
</script>

<style scoped>

</style>