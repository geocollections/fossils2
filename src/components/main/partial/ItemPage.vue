<template>
  <div id="content">
    <div id="taxon-box">
      <div id="taxon-header">
        <div id="fossilgroup-icon">
          <router-link v-bind:to="'/'+taxon.fossil_group__id" v-if="taxon.fossil_group__id != null">
            <img border="0" :src="'/static/fossilgroups/'+taxon.fossil_group__id+'.png'" :alt="taxon.fossil_group__taxon"
                 :title="taxon.fossil_group__taxon" style="height: 80px; margin-top: 0px; padding-right: 0px;" />
            <!--<br />{{taxon.fossil_group__taxon}}-->
          </router-link>
          <router-link v-bind:to="'/'+taxon.id" v-else-if="taxon.is_fossil_group == 1">
            <img border="0" :src="'/static/fossilgroups/'+ taxon.id+'.png'" :alt="taxon.taxon"
                 :title="taxon.taxon" style="height: 95px; margin-top: 0; padding-right: 0px;" />
          </router-link>
        </div>

        <div id="taxon-title">
          <h1 style='color: #333;'>
            <!--<span style="color:#333; font-weight:bold" v-if="content.class && content.class != content.taxon">{{content.class}}</span><br />-->
            <!--<div style="font-size: 0.7em;" v-else-if="'fossil_group' in content">-->
              <!--<router-link v-bind:to="'/'+taxon.fossil_group__id">{{taxon.fossil_group__taxon}}</router-link>-->
            <!--</div>-->

            <span style="font-size: 0.7em;">{{taxon.rank__rank}}</span>
            <!--<em v-if="content.rank_id in content.rank_list">{{taxon.taxon}}</em>-->
            <!--<span v-if="!(content.rank_id in content.rank_list)">{{taxon.taxon}}</span>-->
            <span style="font-size: 0.7em;">{{taxon.author_year}}</span>
          </h1>

          <!--<div class="taxon_names" v-if="taxon.taxon_names" v-for="item in content.taxon_names">-->
            <!--<strong>{{item.language}}</strong>: {{item.name}};-->
          <!--</div>-->
        </div>


      </div>

    </div>
    <div id="content-left">

      <div id="taxon-info" style="width:100%;">
        <div>
          <h3></h3>
          <div class="recordeditor">
            Taxon ID: <strong>{{taxon.id}}</strong>
            <span v-if="taxon.date_added"> | {{taxon.date_added | moment('YYYY-MM-DD')}}</span>
            <span v-if="taxon.date_changed">/ {{taxon.date_changed | moment('YYYY-MM-DD')}}</span>
            <span v-if="taxon.user_authorized"> | {{taxon.user_authorized | moment('YYYY-MM-DD')}}</span>
          </div>
          <div v-if="taxon.id != 29">
            {{$t('header.f_belongs_to')}}:
            <em>
              <router-link v-bind:to="'/'+parent.id">{{parent.taxon}}</router-link>
            </em>
            <br />
            {{$t('header.f_sister_taxa')}}:
            <em style='font-weight: normal;'>
              <!--get_item_siblings-->
            </em>
            <br />
            {{$t('header.f_contains')}}:
            <em style='font-weight: normal;'>
              <!--get_item_children-->
            </em>
            <!--number of species-->
          </div>
        </div>
        <div style="clear:both;"></div>
      </div>

      <h3>{{$t('header.f_taxon_intro')}}</h3>
      <!--<i style='font-size: 0.8em;'>-->
        <!--{% if content.author_txt %}{{content.author_txt}}{% endif %}-->
        <!--{% if content.date_txt %}({{content.date_txt}}){% endif %}-->
      <!--</i>-->
      <!--{% if 'author_txt' in content.item %}-->
      <!--{% if 'date_txt' in content.item %}-->
      <br />

      <div id="taxon-details">{{taxon.content|safe}}</div>
    </div>

  </div>
</template>
<script>
  import MyMixin from '../../../mixins/mixin';
  export default {
    mixins: [MyMixin],
    name: 'item-page',
    data() {
      return {
        taxon : '',
        parent : ''
      }
    },
    created: function (){
      this.getRequest(this.apiUrl+'/taxon/'+this.$route.params.id).then((response) => {
        this.taxon = response;

        if (this.isDefinedAndNotNull(this.taxon.parent)){
          this.getRequest(this.apiUrl+'/taxon/'+this.taxon.parent).then((response) => {
            this.parent = response;
          });
        }

      });




    }
  }
</script>
