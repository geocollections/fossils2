<template>
    <div class="m-1">
        <ul class="nav nav-tabs tab-links" role="tablist">
            <li class="nav-item">
                <a href="#" v-on:click="setActiveTab('overview')" class="nav-link"  :class="{ active: activeTab === 'overview' }">{{ $t('tabs.overview') }}</a>
            </li>
            <li class="nav-item" v-if="$parent.images && $parent.images.length > 0">
                <a href="#"  v-on:click="setActiveTab('gallery')" class="nav-link"  :class="{ active: activeTab === 'gallery' }">{{ $t('tabs.gallery') }}</a>
            </li>
            <li class="nav-item" v-if="!!$parent.specimenCollectionCnt && $parent.specimenCollectionCnt > 0">
                <a href="#"  v-on:click="setActiveTab('specimens')" class="nav-link"  :class="{ active: activeTab === 'specimens' }">{{ $t('tabs.specimens') }}
                    <span class="badge badge-secondary badge-pill">{{$parent.specimenCollectionCnt}}</span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "TaxonTabs",
        computed: {
            activeTab() {
                return this.$store.state.activeTab
            }
        },
        methods: {
            setActiveTab: function(tab) {
                this.$store.commit('SET_ACTIVE_TAB', {tab})
            }
        }
    }
</script>