<template>
    <div class="m-1">
        <ul class="nav nav-tabs tab-links" role="tablist">
            <li class="nav-item">
                <a href="#tab-overview" v-on:click="setActiveTab('overview')" class="nav-link"  :class="{ active: activeTab === 'overview' }">{{ $t('tabs.overview') }}</a>
            </li>
            <!--<li class="nav-item">-->
                <!--<a href="#tab-names"  v-on:click="setActiveTab('names')" class="nav-link" :class="{ active: activeTab === 'names' }">{{ $t('tabs.names') }}</a>-->
            <!--</li>-->
            <li class="nav-item">
                <a href="#tab-gallery"  v-on:click="setActiveTab('gallery')" class="nav-link"  :class="{ active: activeTab === 'gallery' }">{{ $t('tabs.gallery') }}</a>
            </li>
            <!--<li class="nav-item">-->
                <!--<a href="#tab-classification"  v-on:click="setActiveTab('classification')" class="nav-link" :class="{ active: activeTab === 'classification' }">{{ $t('tabs.classification') }}</a>-->
            <!--</li>-->
            <!--<li class="nav-item">-->
                <!--<a href="#tab-literature"  v-on:click="setActiveTab('literature')" class="nav-link"  :class="{ active: activeTab === 'literature' }">{{ $t('tabs.literature') }}</a>-->
            <!--</li>-->
            <li class="nav-item">
                <a href="#tab-specimens"  v-on:click="setActiveTab('specimens')" class="nav-link"  :class="{ active: activeTab === 'specimens' }">{{ $t('tabs.specimens') }}
                    <span v-if="!!$parent.specimenCollectionCnt" class="badge badge-secondary badge-pill">{{$parent.specimenCollectionCnt}}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    import Spinner from "./Spinner.vue";
    export default {
        name: "TaxonTabs",
        components: {Spinner},
        computed: {
            activeTab() {
                return this.$store.state.activeTab
            }
        },
        methods: {
            setActiveTab: function(tab) {
                this.$store.commit('SET_ACTIVE_TAB', {tab})
                this.$route.meta.isSpecies = true
            }
        }
    }
</script>

<style scoped>

</style>