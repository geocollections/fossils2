<template>
  <ul style="padding-left: 0 !important;">
    <table v-if="isDefinedAndNotEmpty(ranks)">
      <tbody class="hierarchy_tree">
      <tr  v-for="item in taxonomicTree.nodes">
        <td v-if="isHigherRank(item.rank_en) || item.id === taxon.id" align="right" valign="top" style="color: #999;" v-translate="{et:item.rank, en: item.rank_en}"></td>
        <td v-else></td>
        <td>
          <span v-for="i in convertToNumber(item.i)" >&ensp;</span>
          <a :href="'/'+item.id" v-if="item.id !== taxon.id">{{item.label}}</a>
          <span class="node_in_tree_selected" v-if="item.id === taxon.id">{{item.label}}</span>
          <ul v-for="sibling in item.siblings">
            <span v-for="j in convertToNumber(item.i)-2">&ensp;</span>
            <a :href="'/'+sibling.id">{{sibling.label}}</a>
          </ul>
        </td>
      </tr>
      </tbody>
    </table>
    <!--<ul v-for="(item,idx) in taxonomicTree.nodes">-->
    <!--<span v-for="i in convertToNumber(item.i)" >&ensp;</span>-->
    <!--<span style="color: #999;" v-translate="{et:item.rank, en: item.rank_en}"></span>-->
    <!--<a :href="'/'+item.id" v-if="item.id !== taxon.id">{{item.label}}</a>-->
    <!--<span class="node_in_tree_selected" v-if="item.id === taxon.id">{{item.label}}</span>-->
    <!--<ul v-for="sibling in item.siblings">-->
      <!--<span v-for="j in convertToNumber(item.i)-2">&ensp;</span>-->
      <!--<span style="color: #999;" v-translate="{et:sibling.rank, en: sibling.rank_en}"></span>-->
      <!--<a :href="'/'+sibling.id">&ensp;&ensp;{{sibling.label}}</a>-->
    <!--</ul>-->
  <!--</ul>-->
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
          ranks: []
        }
      },
      props: ['hierarchy_','parent_','taxon_','sortedSisters_','sortedSiblings_','sortedSistersWithoutCurrentTaxon_'],

      created() {

        this.hierarchy = this.$props.hierarchy_;
        this.sortedSisters = this.$props.sortedSisters_;
        this.sortedSiblings = this.$props.sortedSiblings_;
        this.parent=this.$props.parent_;
        this.taxon = this.$props.taxon_;
        this.ranks = this.getHigherRanks(this.taxon.rank__rank_en);
        this.sortedSistersWithoutCurrentTaxon = this.$props.sortedSistersWithoutCurrentTaxon_;
        this.composeTaxonomicTree_()
      },
      methods: {
        addHierarchy: function(filteredList,sisterIds) {
          for(let idx in filteredList) {
            let node = {i: idx, rank: filteredList[idx].rank__rank, rank_en: filteredList[idx].rank__rank_en,
                label: filteredList[idx].taxon, id: filteredList[idx].id, siblings: []};
            if(!sisterIds.includes(filteredList[idx].id))
              this.taxonomicTree.nodes.push(node)
          }
        },
        addSisters: function(level) {
          for(let idx in this.sortedSisters) {
            let node = {i: level, rank: this.sortedSisters[idx].rank__rank, rank_en: this.sortedSisters[idx].rank__rank_en,
                label: this.formatName(this.sortedSisters[idx],this.parent), id: this.sortedSisters[idx].id, siblings: []};
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
            return _.includes(taxon.taxon, taxon.parent__taxon) && taxon.taxon.split(' ').length > 1 ? taxon.taxon.replace(taxon.parent__taxon, "") : taxon.taxon;
          return _.includes(taxon.taxon, parent.taxon) && taxon.taxon.split(' ').length > 1 ? taxon.taxon.replace(parent.taxon, "") : taxon.taxon;


        },
        addSiblingsIfExists: function(parent_node) {
          if (this.isDefinedAndNotEmpty(this.sortedSiblings)) {
            for(let idx1 in this.sortedSiblings) {
              if (parent_node.id === this.sortedSiblings[idx1].parent_id) {
                parent_node.siblings.push({j: idx1, rank: this.sortedSiblings[idx1].rank__rank, rank_en: this.sortedSiblings[idx1].rank__rank_en,
                    label: this.formatName(this.sortedSiblings[idx1],parent_node), id: this.sortedSiblings[idx1].id});
              }
            }
          }
        },

        convertToNumber: function(str) { return parseInt(str) },
        isDefinedAndNotEmpty(value) { return !!value && value.length > 0 },
        getHigherRanks(currentTaxonRank) {
            let rank_ = _.find(this.$store.state.lists.ranks, function(o) { return currentTaxonRank === o.rank_en; });
            return _.map(_.filter(this.$store.state.lists.ranks, function(o) { return rank_.sort > o.sort; }),"rank_en");
        },
        isHigherRank(rank) {return this.ranks.includes(rank)}
      }
    }
</script>
