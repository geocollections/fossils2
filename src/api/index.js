import Vue from 'vue'
import VueResource from 'vue-resource'

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
            console.log(response.url)
        }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
            reject(errResponse)
        });
    });
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
    let returningFields = "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank"
    return mode === 'in_baltoscandia'
        ?  fetch(`taxon/?parent_id=${id}&in_baltoscandia=1&fields=${returningFields}`)
        :  fetch(`taxon/?parent_id=${id}&fields=${returningFields}`)
}

export function fetchSpecies (hierarchy_string,mode,searchParameters) {
    return mode === 'in_baltoscandia'
        ?  fetch(`taxon/?hierarchy_string__istartswith=${hierarchy_string}&rank__rank_en=species&in_baltoscandia=1&fields=taxon,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy&page=${searchParameters.species.page}&paginate_by=${searchParameters.species.paginateBy}`)
        :  fetch(`taxon/?hierarchy_string__istartswith=${hierarchy_string}&rank__rank_en=species&fields=taxon,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy&page=${searchParameters.species.page}&paginate_by=${searchParameters.species.paginateBy}`)
}

export function fetchHierarchy (hierarchy_string) {
    return fetch(`taxon?id__in=${hierarchy_string}&fields=id,taxon,rank__rank,rank__rank_en`)
}

export function fetchChildren (id, mode) {
    let returningFields = "id,taxon,parent__taxon,parent_id,rank__rank_en,rank__rank"
    return mode === 'in_baltoscandia'
        ?  fetch(`taxon/?parent=${id}&in_baltoscandia=1&fields=${returningFields}`)
        :  fetch(`taxon/?parent=${id}&fields=${returningFields}`)
}
export function fetchSelectedImages (id) {
    return fetch(`taxon/?sql=get_taxon_selected_images&keyword=${id}`)
}
export function fetchImages (hierarchy_string) {
    // return fetch(`taxon_image/?taxon=${taxon}&order_by=sort`)
    // return fetch(`taxon_image/?taxon__hierarchy_string__istartswith=${hierarchy_string}&order_by=sort`)
    return fetch(`taxon/?sql=get_taxon_images&keyword=${hierarchy_string}`)
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
    return fetch(`taxon_occurrence/?taxon__hierarchy_string__istartswith=${hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__title,reference__journal__journal_name,reference__book,reference__number,reference__doi,reference__year&distinct=true`)
}
export function fetchReferences2 (hierarchy_string) {
    return fetch(`specimen_union/?taxon__hierarchy_string__istartswith=${hierarchy_string}&reference!=null&order_by=-reference__year&fields=reference,reference__reference,reference__title,reference__journal__journal_name,reference__book,reference__number,reference__doi,reference__year&distinct=true`)
}
export function fetchSynonims (id) {
    return fetch(`taxon_synonym/?taxon=${id}&format=json`)
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

export function fetchAttachment (hierarchy_string) {
    return fetch(`attachment/?specimen__specimenidentification__taxon__hierarchy_string__istartswith=${hierarchy_string}&fields=id,specimen_id,specimen__specimen_id,specimen_image_id,database__acronym,uuid_filename&format=json&distinct=true&order_by=stars`)
}

export function fetchRanks () {
    return fetch(`taxon_rank/?order_by=sort`)
}

export function cntSpecimenCollection(taxon) {
    let returningFields='&fields=id'
    let paginateBy='1'
    return fetch(`specimen/?specimenidentification__taxon__taxon__hierarchy=${taxon}${returningFields}&paginate_by=${paginateBy}`)
}

export function fetchSpecimenCollection(taxon,searchParameters) {
    let orderBy = searchParameters.specimens.order === 'ASCENDING' ? '&order_by='+searchParameters.specimens.sortBy : '&order_by=-' +searchParameters.specimens.sortBy;
    let returningFields='&fields=id,specimenidentification__name,coll__number,specimen_id,specimen_nr,locality__locality,' +
        'locality__locality_en,locality_free,depth_interval,depth,stratigraphy_id,stratigraphy__stratigraphy,stratigraphy__stratigraphy_en,' +
        'lithostratigraphy__stratigraphy_en,lithostratigraphy_id,lithostratigraphy__stratigraphy,specimenidentification__taxon_id,specimenidentification__taxon__taxon,specimenidentificationgeologies__rock__id,' +
        'specimenidentificationgeologies__name,specimenidentificationgeologies__name_en,specimenidentificationgeologies__rock__name,specimenidentificationgeologies__rock__name_en,' +
        'agent_collected__agent,agent_collected__forename,agent_collected__surename,original_status__value,original_status__value_en,attachment__filename&distinct=true'
    return fetch(`specimen/?specimenidentification__taxon__taxon__hierarchy=${taxon}&order_by=-id${returningFields}&page=${searchParameters.specimens.page}&paginate_by=${searchParameters.specimens.paginateBy}${orderBy}`)
}