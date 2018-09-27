<template>
    <!--REFERENCES-->
    <div v-if="taxonOccurrence" id="#tab-literature" class="tab-pane p-3" :class="{active: $store.state.process === 'server' ||
    ($store.state.activeTab === 'literature')}" role="tabpanel">
        <div class="row p-3"><h2 v-show="$store.state.process === 'server'">Literature</h2></div>
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">{{$t('header.f_taxon_references')}}</div>
                    <div class="card-body">
                        <ul>
                        <li v-for=" reference in taxonOccurrence">
                            <button class="btn btn-link" @click="$parent.openUrl({parent_url:'http://geocollections.info/reference',object:reference.reference, width:500,height:500})">
                              <strong>{{reference.reference__reference}}</strong>
                            </button>
                            <!--$author, $year. $title. $journal_name: $number or $book, $pages. DOI:$doi.-->
                            <span>. {{reference.reference__title}}.{{reference.reference__journal__journal_name}}:</span>
                            <span v-if="reference.reference__book != null">{{reference.reference__book}}</span>
                            <span v-else>{{reference.reference__number}}</span>, {{reference.reference__pages}}. DOI:
                            <a v-if="reference.reference__doi" :href="'http://dx.doi.org/'+reference.reference__doi" target="_blank">{{reference.reference__doi}}</a>
                        </li>
                    </ul></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TabLiterature",
        computed: {
            taxonOccurrence () { return this.$parent.taxonOccurrence}
        }
    }
</script>

<style scoped>

</style>