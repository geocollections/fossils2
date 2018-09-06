<template>
  <ul id="tree" style="position:relative;left:0;background-color:#fff;z-index:100;padding:0;margin-right: 10px;width:100%;">
    <h3>{{$t('header.fossils_browse_tree')}}</h3>
    <ul v-for="(item,idx) in taxonomicTree.nodes">
      <span v-for="i in convertToNumber(item.i)" >&ensp;</span>
      <router-link v-bind:to="'/'+item.id" v-if="item.id !== taxon.id">{{item.label}}</router-link>
      <span class="node_in_tree_selected" v-if="item.id === taxon.id">{{item.label}}</span>
      <ul v-for="sibling in item.siblings">
        <span v-for="j in convertToNumber(item.i)" >&ensp;</span>
        <router-link v-bind:to="'/'+sibling.id">{{sibling.label}}</router-link>
      </ul>
    </ul>
  </ul>
</template>

<script>
    export default {
      name: "taxonomical-tree",
      data() {
        return {
          hierarchy : {},
          parent : {},
          sortedSistersWithoutCurrentTaxon : {},
          taxon : {},
          taxonomicTree: {nodes: []},
          isSisterTaxaLoaded: false,
          isSiblingsLoaded: false,
          isHierarchyLoaded: false,
          ranks: []
        }
      },
      props: ['hierarchy_','parent_','taxon_','sortedSisters_','sortedSiblings_','sortedSistersWithoutCurrentTaxon_',
      'isSisterTaxaLoaded_','isSiblingsLoaded_','isHierarchyLoaded_'],

      created() {
        this.hierarchy = this.$props.hierarchy_;
        this.sortedSisters = this.$props.sortedSisters_;
        this.sortedSiblings = this.$props.sortedSiblings_;
        this.parent=this.$props.parent_;
        this.taxon = this.$props.taxon_;
        this.isSisterTaxaLoaded=this.$props.isSisterTaxaLoaded_;
        this.isSiblingsLoaded = this.$props.isSiblingsLoaded_;
        this.isHierarchyLoaded = this.$props.isHierarchyLoaded_;
        this.sortedSistersWithoutCurrentTaxon = this.$props.sortedSistersWithoutCurrentTaxon_;
        this.composeTaxonomicTree_()
      },
      methods: {
        addHierarchy: function(filteredList,sisterIds) {
          for(let idx in filteredList) {
            let node = {i: idx, label: filteredList[idx].taxon, id: filteredList[idx].id, siblings: []};
            if(!sisterIds.includes(filteredList[idx].id))
              this.taxonomicTree.nodes.push(node)
          }
        },
        addSisters: function(level) {
          for(let idx in this.sortedSisters) {
            let node = {i: level, label: this.formatName(this.sortedSisters[idx],this.parent), id: this.sortedSisters[idx].id, siblings: []};
            if (this.sortedSisters[idx].id === this.taxon.id) {
              this.addSiblingsIfExists(node)
            }
            this.taxonomicTree.nodes.push(node)
          }
        },
        //reorder hierarchy according to hierarchy string
        reorderHierarchy: function() {
          if(this.$parent.taxon.hierarchy_string === undefined) return;
          let newArr = []
          let hierarchyIds = this.$parent.taxon.hierarchy_string.split('-');
          for (let i in hierarchyIds) {
            for (let idx in this.hierarchy) {
              if(this.convertToNumber(hierarchyIds[i]) === this.hierarchy[idx].id) {
                newArr.push(this.hierarchy[idx])
              }
            }
          }
          return newArr
        },
        composeTaxonomicTree_: function() {
          let hierarchy = this.reorderHierarchy();
          if (hierarchy === undefined) return
          let level = hierarchy.length;
          let sisterIds = Array.from(this.sortedSisters.map(item => item.id));
          this.addHierarchy(hierarchy,sisterIds);
          this.addSisters(level)
        },

        formatName: function(taxon,parent) {
          if(parent.label)
            return _.includes(taxon.taxon, taxon.parent__taxon) ? taxon.taxon.replace(taxon.parent__taxon, "") : taxon.taxon;
          return _.includes(taxon.taxon, parent.taxon) ? taxon.taxon.replace(parent.taxon, "") : taxon.taxon;


        },
        addSiblingsIfExists: function(parent_node) {
          if (this.isDefinedAndNotEmpty(this.sortedSiblings)) {
            for(let idx1 in this.sortedSiblings) {
              if (parent_node.id === this.sortedSiblings[idx1].parent_id) {
                parent_node.siblings.push({j: idx1, label: this.formatName(this.sortedSiblings[idx1],parent_node), id: this.sortedSiblings[idx1].id});
              }
            }
          }
        },

        convertToNumber: function(str) {
          return parseInt(str)
        },

        isDefinedAndNotEmpty(value) {
          return !!value && value.length > 0
        },
      }
    }
</script>
