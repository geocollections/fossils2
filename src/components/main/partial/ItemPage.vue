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
            <span style="color:#333; font-weight:bold" v-if="taxon_page.frontpage_title">{{taxon_page.title}}</span><br />
            <div style="font-size: 0.7em;" v-if="taxon.fossil_group__id != null">
              <router-link v-bind:to="'/'+taxon.fossil_group__id">{{taxon.fossil_group__taxon}}</router-link>
            </div>
            <div v-translate="{ et: taxon.rank__rank, en: taxon.rank__rank_en }"></div>
            <span style="font-size: 0.7em;" v-test v-bind:et="taxon.rank__rank"></span>
            <!--<em v-if="content.rank_id in content.rank_list">{{taxon.taxon}}</em>-->
            <!--<span v-if="!(content.rank_id in content.rank_list)">{{taxon.taxon}}</span>-->
            <span style="font-size: 0.7em;">{{taxon.author_year}}</span>
          </h1>
          <div class="taxon_names" >
            <span v-if="common_names.length > 0" v-for="item in common_names">
              <strong>{{item.language}}</strong>: {{item.name}};
            </span>
          </div>

        </div>
      </div>
    </div>
    <!-- content left ends and menu begins -->
    <div id="menu">
      <div id="species_hierarchy_container" style="position: relative;">
        <h3>{{$t('header.fossils_classification')}}</h3>
        <table>
          <tbody class="hierarchy_tree" v-for="item in hierarchy">
            <tr v-if="item.id != 29 && item.id != taxon.id">
              <td align="right" style="color: #999;">{{item.rank__rank_en}}</td>
              <td>
                <router-link v-bind:to="'/'+item.id">{{item.taxon}}</router-link>
              </td>
            </tr>
            <tr v-if="item.id == 29 || item.id == taxon.id">
              <td align="right" style="color: #999;">{{item.rank__rank_en}}</td>
              <td><strong>{{item.taxon}}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <h3>{{$t('header.f_weblinks')}}</h3>
      <div id="taxon-links">
        <span>

        </span>
        <!--{% for link in content.seealso_links %}-->
        <!--<a href="{{link.url}}">{{link.name}}</a> {% if forloop.last %}{%else%} <br /> {% endif %}-->
        <!--{% endfor %}-->
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
            <!--<em style='font-weight: normal;'>-->
            ?sister_taxa?
              <!--get_item_siblings-->
            <!--</em>-->
            <br />
            {{$t('header.f_contains')}}:
            <span v-if="siblings" v-for="(sibling, idx) in siblings">
              <router-link v-bind:to="'/'+sibling.id">{{sibling.taxon}}</router-link>
              <span v-if = 'idx != siblings.length -1'> | </span>
            </span>
            <br />
              <!--get_item_children-->

            <div v-if="">
              {{$t('header.f_stratigraphical_distribution')}}:
              <strong v-if="taxon.stratigraphy_base__stratigraphy">
                <span class="openwinlink">
                      <!--:onclick="window.open(-->
                        <!--'http://geokogud.info/stratigraphy/'+taxon.stratigraphy_base_id+'}',-->
                        <!--'',-->
                        <!--'width=500,height=500,scrollbars,resizable')"-->
                {{taxon.stratigraphy_base__stratigraphy}}
                </span>&ndash;
                <span v-if="taxon.stratigraphy_top__stratigraphy
                && taxon.stratigraphy_base__stratigraphy != taxon.stratigraphy_top__stratigraphy" class="openwinlink">
                          <!--:onclick="window.open(-->
                        <!--'http://geokogud.info/stratigraphy/'+content.stratigraphy.top_id,-->
                        <!--'',-->
                        <!--'width=500,height=500,scrollbars, resizable')"-->
                {{taxon.stratigraphy_top__stratigraphy}}  | ~ ?age_base?{{taxon.age_base}}&ndash;?age_top?{{taxon.age_top}} Ma
                </span>
              </strong>
              <br />
            </div>
            <!--number of species-->
            <div>
              {{$t('header.f_baltic_species')}}
              <strong><a :href="'/'+taxon.id+'/species'">?num_species?</a></strong><br />
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
      </div>

      <h3>{{$t('header.f_taxon_intro')}}</h3>
      <i style='font-size: 0.8em;'>
        {{taxon_page.author_txt}} {{taxon_page.date_txt}}
      </i>
      <br />
      <div id="taxon-details" v-html="taxon_page.content"></div>
      <!--REFERENCES-->
      <div style="margin:15px auto;">
        <h3>{{$t('header.f_taxon_references')}}</h3>
        <ul>
          <li v-for=" reference in taxon_occurrence">
            <span class="openwinlink" @click="openUrl({parent_url:'http://geokogud.info/reference',object:reference.reference, width:500,height:500})">
              <strong>{{reference.reference__reference}}</strong>
            </span>. {{reference.reference__title}}
            <a v-if="reference.reference__doi" :href="'http://dx.doi.org/'+reference.reference__doi" target="_blank">[DOI]</a>
          </li>
        </ul>
      </div>
      <div>
        <!--{{taxon}}-->
        <!--{{parent}}-->
        <!--<br>{{description}}<br>-->
        <!--{{taxon_image}}-->
        <!--{{taxon_page}}-->
        <!--{{common_names}}-->
        <!--{{taxon_list}}-->
        <!--{{taxon_occurrence}}-->
        <!--{{children}}-->
        <!--{{siblings}}-->
        <!--{{synonyms}}-->
        <!--{{taxon_type_specimen}}-->
        <!--{{specimen_identification}}-->
        <!--{{speciment_attachment}}-->
        <!--{{hierarchy}}-->
      </div>

    <div v-if="taxon_image">
      <div style="clear: both;"></div>
      <!--<h3>{{tax.images_title}} ({{taxon.taxon}})</h3>-->
      <div class='photogallery' v-if="false">
        <div v-for="image in taxon_image">
          <div style="position:relative;float:left;" :onmouseover="'$(\'#'+image.attachment+'-\').show();'" :onmouseout="'$(\'#'+image.attachment+'-\').hide();'">
            <a :href="'http://geokogud.info/'+image.acro+'/di.php?f=specimen_image/'+image.link+'/'+image.attachment__uuid_filename+'&w=1280'" >
              <img :src="image.images_dir+''+image.preview" :alt="taxon.taxon"
                   :title="image.name+''+image.taxon+': '+image.number+''+image.diagnosis" border="0" /></a>
            <!--<div style="display:none;cursor:pointer;position:absolute;top:0;right:0;" :id="image.attachment+'-'"-->
                 <!--:onclick="$(this).siblings('a').attr('href','http://geokogud.info/'+image.acro+'/di.php?f=specimen_image/'+image.img_to_url+'&w=1280'); $(this).siblings('a').trigger('dblclick'); $(this).siblings('a').attr('href','/{{image.id}}{{image.link_id}}');">-->
              <!--<img src="/static/imgs/zoom_in.png" style="width: 32px;height: 32px;padding:2px 2px 0 0;" />-->
            <!--</div>-->
          </div>
        </div>

        <div style="clear:both;"></div>
      </div>
    </div>
    <div id="taxon-main">
      <div id="taxon-left">
        <h3>{{$t('header.f_distribution_map')}}</h3>
        <div id="map" style="height: 300px;border-radius: 6px;"></div>
      </div>
      <div id="taxon-right">
        <div style="padding: 0 0 0 10px;">
          <!--content.genus.images-->

        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import MyMixin from '../../../mixins/mixin';

  import langchanged from '../../../directives/directive'
  export default {
    mixins: [MyMixin],
    name: 'item-page',
    data() {
      return {
        taxon : {},
        parent : {},
        description : {},
        taxon_image : {},
        taxon_page : {},
        common_names : {},
        taxon_list : {},
        taxon_occurrence : {},
        children : {},
        siblings : {},
        synonyms : {},
        taxon_type_specimen : {},
        specimen_identification : {},
        speciment_attachment : {},
        hierarchy : {}
      }
    },
    methods: {
      getLocationsObject : function(object) {
        let locations = []
        let lang = this.lang
        object.forEach(function(element) {
          if (element.locality != null) {
            locations.push({
              lat : null,
              long: null,
              locality: (lang == 'ee' ? element.locality__locality
                : element.locality__locality_en),
              locid: element.locality
            });
          }
        });
        return locations
      },
      openUrl : function(params) {
        window.open(params.parent_url + '/' + params.object, '', 'width=' + params.width +
          ',height=' + params.height,scrollbars)
      },
      loadFullTaxonInfo : function () {
        this.getRequest(this.apiUrl+'/taxon/'+this.$route.params.id).then((response) => {
          this.taxon = response ? response[0] : {};

          if (this.isDefinedAndNotNull(this.taxon.parent)){
            this.getRequest(this.apiUrl+'/taxon/'+this.taxon.parent).then((response) => {
              this.parent = response ? response[0] : {};
            });
          }

        });

        this.getRequest(this.apiUrl+'/taxon_page/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_page = response ? response[0] : {};
        });

        this.getRequest(this.apiUrl+'/taxon_image/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_image = response;
        });

        this.getRequest(this.apiUrl+'/taxon_description/?taxon='+this.$route.params.id).then((response) => {
          this.description = response;
        });

        this.getRequest(this.apiUrl+'/taxon_common_name/?taxon='+this.$route.params.id).then((response) => {
          this.common_names = response;
        });

        this.getRequest(this.apiUrl+'/taxon_list/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_list = response;
        });

        this.getRequest(this.apiUrl+'/taxon_occurrence/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_occurrence = response;
          //load map
          var locations = this.getLocationsObject(this.taxon_occurrence)
          if (locations.length > 0) {
            initMap(locations)
          }
        });

        this.getRequest(this.apiUrl+'/taxon/?parent='+this.$route.params.id).then((response) => {
          this.children = response;
          this.siblings = response;
        });

        this.getRequest(this.apiUrl+'/taxon_synonym/?taxon='+this.$route.params.id).then((response) => {
          this.synonyms = response;
        });

        this.getRequest(this.apiUrl+'/taxon_type_specimen/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_type_specimen = response;
        });

        this.getRequest(this.apiUrl+'/specimen/?specimenidentification__taxon_id='+this.$route.params.id+'&fields=id&format=json').then((response) => {
          this.specimen_identification = response;
        });

        this.getRequest(this.apiUrl+'/taxon_type_specimen/?taxon='+this.$route.params.id).then((response) => {
          this.taxon_type_specimen = response;
        });

        this.getRequest(this.apiUrl+'/attachment/?specimen__specimenidentification__taxon__id='+this.$route.params.id+'&fields=uuid_filename&format=json').then((response) => {
          this.speciment_attachment = response;
        });

        this.getRequest(this.apiUrl+'/taxon?id__in=1,29,38,60,61,62,259,1081,2104&fields=id,taxon,rank__rank_en').then((response) => {
          this.hierarchy = response;
        });
      },

    },
    watch: {
      '$route.params.id': {
        handler : function (newval, oldval) {
          this.loadFullTaxonInfo()
        }
      }
    },
    created: function(){
      this.loadFullTaxonInfo();
    }

  }
</script>
