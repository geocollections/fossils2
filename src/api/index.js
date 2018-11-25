import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);
const logRequests = !!process.env.DEBUG_API;

const api = {
  url: 'https://api.geocollections.info/'
};

function fetch (child) {
  // logRequests && console.log(`fetching ${child}...`);
    return new Promise((resolve, reject) => {
        Vue.http.get(api.url+child, {}).then(response => {
            resolve(response.body);
            // console.log(response.url)
        }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
            reject(errResponse)
        });
    });
}
function applyMode(mode) {
    let returnVal = "";
    if(mode === 'in_baltoscandia') returnVal = "&in_baltoscandia=1";
    else if (mode === 'in_estonia') returnVal = "&in_estonia=1";
    return returnVal
}

export function fetchStaticPage (id) {
  return fetch(`webpages/${id}`)
}

export function fetchFrontPage (lang) {
    return fetch(`taxon_page/?language=${lang}&on_frontpage=1&order_by=frontpage_order&fields=frontpage,taxon,taxon__taxon`)
}

/* Item page request */
export function fetchTaxon (id) {
    return fetch(`taxon/?id=${id}&fields=id,taxon,parent,parent__taxon,rank__rank,rank__rank_en,fossil_group__id,is_fossil_group,fossil_group__taxon,hierarchy_string,author_year,date_added,date_changed,stratigraphy_base__stratigraphy,stratigraphy_base_id,stratigraphy_top_id,stratigraphy_base__age_base,stratigraphy_top__age_top,stratigraphy_top__stratigraphy,taxon_id_tol,taxon_id_eol,taxon_id_nrm,taxon_id_plutof,taxon_id_pbdb`)
}

export function fetchSisterTaxa (id, mode) {
    let returningFields = "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank";
    let mode_ = applyMode(mode);
    return fetch(`taxon/?parent_id=${id}${mode_}&fields=${returningFields}`)
}

export function fetchSpecies (hierarchy_string,mode,searchParameters) {
    let mode_ = applyMode(mode);
    return fetch(`taxon/?hierarchy_string__istartswith=${hierarchy_string}&rank__rank_en=species${mode_}&order_by=taxon&fields=taxon,author_year,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy&page=${searchParameters.species.page}&paginate_by=${searchParameters.species.paginateBy}`)
}

export function fetchHierarchy (hierarchy_string) {
    return fetch(`taxon?id__in=${hierarchy_string}&fields=id,taxon,rank__rank,rank__rank_en`)
}

export function fetchChildren (id, mode) {
    let returningFields = "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank";
    let mode_ = applyMode(mode);
    return fetch(`taxon/?parent=${id}${mode_}&fields=${returningFields}`)
}
export function fetchSelectedImages (id,searchParameters) {
    return fetch(`taxon/?sql=get_taxon_selected_images&keyword=${id}&page=${searchParameters.selectedImages.page}&paginate_by=${searchParameters.selectedImages.paginateBy}`)
}
export function fetchImages (hierarchy_string,searchParameters) {
    return fetch(`taxon/?sql=get_taxon_images&keyword=${hierarchy_string}&page=${searchParameters.images.page}&paginate_by=${searchParameters.images.paginateBy}`)
}

export function fetchTaxonPages (id,lang) {
    return fetch(`taxon_page/?taxon=${id}&language=${lang}&fields=content,author_txt,date_txt,link_wikipedia,title`)
}

export function fetchTaxonDescription (id) {
    return fetch(`taxon_description/?taxon=${id}&fields=reference,reference__reference,description`)
}

export function fetchTaxonCommonName (id) {
    return fetch(`taxon_common_name/?taxon=${id}&is_preferred=1&fields=language,name,is_preferred`)
}

export function fetchTaxonList (id) {
    return fetch(`taxon_list/?taxon=${id}`)
}

export function fetchTaxonOccurrence (name) {
    // return fetch(`taxon_occurrence/?taxon=${id}`)
    return fetch(`taxon_occurrence/?taxon__taxon__icontains=${name}&fields=reference,reference__reference,locality__locality,locality__locality_en,depth_interval,depth,stratigraphy_base__stratigraphy,stratigraphy_base__stratigraphy_en`)
}
export function fetchReferences (hierarchy_string) {
    return fetch(`taxon_occurrence/?taxon__hierarchy_string__istartswith=${hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi,reference__year&distinct=true`)
}
export function fetchReferences2 (hierarchy_string) {
    return fetch(`specimen_union/?taxon__hierarchy_string__istartswith=${hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__author,reference__year,reference__title,reference__journal__journal_name,reference__book,reference__volume,reference__number,reference__pages,reference__doi,reference__year&distinct=true`)
}
export function fetchSynonims (id) {
    return fetch(`taxon_synonym/?taxon=${id}&order_by=year&format=json`)
}

export function fetchTypeSpecimen (id) {
    // return fetch(`taxon_type_specimen/?taxon__taxon__icontains=${name}`)
    return fetch(`taxon_type_specimen/?taxon=${id}`)
}

export function fetchDistributionSamples (name) {
    return fetch(`taxon/?sql=get_species_distribution_sample&keyword=${name}`)
}
export function fetchDistributionConop (name) {
    return fetch(`taxon/?sql=get_species_distribution_conop&keyword=${name}`)
}

export function fetchSpeciesMap (name) {
    return fetch(`taxon/?sql=get_species_map&keyword=${name}`)
}


export function fetchSpecimenIdentification (taxon) {
    return fetch(`specimen/?specimenidentification__name__icontains=${taxon}&fields=id,locality_id,locality__locality,locality__locality_en,locality__longitude,locality__latitude&format=json`)
}

export function fetchNumberOfSpecimenIdentifications (id) {
    return fetch(`specimen_identification/?taxon_id=${id}&fields=id`)
}

export function fetchAttachment (hierarchy_string,searchParameters) {
    let applyPaging = searchParameters.images.allowPaging ? '&page='+searchParameters.images.page+'&paginate_by='+searchParameters.images.paginateBy : ''
    return fetch(`attachment/?specimen__specimenidentification__taxon__hierarchy_string__istartswith=${hierarchy_string}&fields=id,specimen_id,specimen__specimen_id,specimen_image_id,database__acronym,uuid_filename,specimen__specimenidentification__taxon__id&format=json&distinct=true&order_by=stars${applyPaging}`)
}

export function fetchRanks () {
    return fetch(`taxon_rank/?order_by=sort`)
}

export function cntSpecimenCollection(hierarchy_string) {
    let returningFields='&fields=id'
    let paginateBy='1'
    // return fetch(`specimen/?specimenidentification__taxon__taxon__hierarchy=${taxon}${returningFields}&paginate_by=${paginateBy}`)
    return fetch(`solr/specimen/?q=hierarchy_string:(${hierarchy_string}*)&rows=1`)
}

export function fetchSpecimenCollection(hierarchy_string,searchParameters) {
    // let orderBy = searchParameters.specimens.order === 'ASCENDING' ? '&order_by='+searchParameters.specimens.sortBy : '&order_by=-' +searchParameters.specimens.sortBy;
    // let returningFields='&fields=id,specimenidentification__name,coll__number,specimen_id,specimen_nr,locality__id,locality__locality,' +
    //     'locality__locality_en,locality_free,depth_interval,depth,stratigraphy_id,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,' +
    //     'lithostratigraphy__stratigraphy_en,lithostratigraphy_id,lithostratigraphy__stratigraphy,specimenidentification__taxon_id,specimenidentification__taxon__taxon,specimenidentificationgeologies__rock__id,' +
    //     'specimenidentificationgeologies__name,specimenidentificationgeologies__name_en,specimenidentificationgeologies__rock__name,specimenidentificationgeologies__rock__name_en,' +
    //     'agent_collected__agent,agent_collected__forename,agent_collected__surename,original_status__value,original_status__value_en,attachment__filename&distinct=true'
    // return fetch(`specimen/?specimenidentification__taxon__taxon__hierarchy=${taxon}&order_by=-id${returningFields}&page=${searchParameters.specimens.page}&paginate_by=${searchParameters.specimens.paginateBy}${orderBy}`)
    let start = searchParameters.specimens.paginateBy*(searchParameters.specimens.page-1);
    let orderBy = searchParameters.specimens.order === 'ASCENDING' ? searchParameters.specimens.sortBy + ' asc': searchParameters.specimens.sortBy + ' desc';
    return fetch(`solr/specimen/?q=hierarchy_string:(${hierarchy_string}*)&rows=${searchParameters.specimens.paginateBy}&start=${start}&sort=${orderBy}`)
}

export function fetchSimpleTaxonSearch (value) {
    // return fetch(`solr/fossils_search/?q=name:*${value}*`)
    return fetch(`taxon/?sql=simple_taxon_search&keyword=${value}`)
    // return 'https://api.geocollections.info/taxon/?paginate_by=10&fields=id,taxon,common_name__name,rank__rank_short&multi_search=value:' + value + ';fields:taxon,common_name__name;lookuptype:icontains'
    //   // return 'https://api.geocollections.info/taxon/?paginate_by=30&format=json&fields=id,taxon,rank__rank_en&multi_search=value:' + value + ';fields:taxon;lookuptype:icontains'
}
