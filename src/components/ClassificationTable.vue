<template>
  <div v-if="filteredHierarchy!== undefined">
    <h3>{{$t('header.zero')}}</h3>
    <table>
      <tbody class="hierarchy_tree" v-for="item in filteredHierarchy">
      <tr>
        <td align="right" style="color: #999;" v-translate="{et:item.rank__rank, en: item.rank__rank_en}"></td>
        <td v-if="item.id == $parent.taxon.id"><strong>{{item.taxon}}</strong></td>
        <td v-else><router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link></td>
      </tr>
      </tbody>
    </table>
  </div>

</template>

<script>

  export default {
      name: "classification-table",
      props: ['hierarchy', 'parent', 'taxon'],
      data() {
        return {
          ranks : []
        }
      },
      computed: {
        filteredHierarchy: function() {
          let classificationItems = [];
          for (let i in this.$store.state.lists.ranks) {
            for (let j in this.$props.hierarchy) {
              if(this.$store.state.lists.ranks[i].rank_en === this.$props.hierarchy[j].rank__rank_en) {
                classificationItems.push(this.$props.hierarchy[j])
              }
            }
          }
          return classificationItems.filter(function(val, i) {
            return '29'.indexOf(val.id); //29 - Biota ID  '29'.indexOf(val.id) && val.id <= this.$props.taxon.fossil_group__id
          }, this);
        }
      }

  }
</script>