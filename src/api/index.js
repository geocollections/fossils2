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
            // console.log(response)
        }, errResponse => {
            // console.log('ERROR: ' + JSON.stringify(errResponse));
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
    return fetch(`taxon/${id}`)
}

export function fetchSisterTaxa (id, mode) {
    return mode === 'in_baltoscandia'
        ?  fetch(`taxon/?parent_id=${id}&in_baltoscandia=1&fields=taxon,id`)
        :  fetch(`taxon/?parent_id=${id}&fields=taxon,id`)
}

export function fetchSpecies (hierarchy_string,mode,searchParameters) {
    return mode === 'in_baltoscandia'
        ?  fetch(`taxon/?hierarchy_string__istartswith=${hierarchy_string}&rank__rank_en=species&in_baltoscandia=1&fields=taxon,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy&page=${searchParameters.watched.page}&paginate_by=${searchParameters.watched.paginateBy}`)
        :  fetch(`taxon/?hierarchy_string__istartswith=${hierarchy_string}&rank__rank_en=species&fields=taxon,id,stratigraphy_base__stratigraphy_en,stratigraphy_base__stratigraphy,stratigraphy_top__stratigraphy_en,stratigraphy_top__stratigraphy&page=${searchParameters.watched.page}&paginate_by=${searchParameters.watched.paginateBy}`)
}

export function fetchHierarchy (hierarchy_string) {
    return fetch(`taxon?id__in=${hierarchy_string}&fields=id,taxon,rank__rank,rank__rank_en`)
}

export function fetchChildren (id, mode) {
    return mode === 'in_baltoscandia'
        ?  fetch(`taxon/?parent=${id}&in_baltoscandia=1`)
        :  fetch(`taxon/?parent=${id}`)
}

export function fetchImages (id) {
    return fetch(`taxon_image/?taxon=${id}&order_by=sort`)
}

export function fetchTaxonPages (id) {
    return fetch(`taxon_page/?taxon=${id}`)
}

export function fetchTaxonDescription (id) {
    return fetch(`taxon_description/?taxon=${id}`)
}

export function fetchTaxonCommonName (id) {
    return fetch(`taxon_common_name/?taxon=${id}&is_preferred=1`)
}

export function fetchTaxonList (id) {
    return fetch(`taxon_list/?taxon=${id}`)
}

export function fetchTaxonOccurrence (id) {
    return fetch(`taxon_occurrence/?taxon=${id}`)
}

export function fetchSynonims (id) {
    return fetch(`taxon_synonym/?taxon=${id}&format=json`)
}

export function fetchTypeSpecimen (id) {
    return fetch(`taxon_type_specimen/?taxon=${id}`)
}

export function fetchSpecimenIdentification (id) {
    return fetch(`specimen/?specimenidentification__taxon_id=${id}&fields=id,locality_id,locality__locality,locality__locality_en,locality__longitude,locality__latitude&format=json`)
}

export function fetchAttachment (taxon) {
    return fetch(`attachment/?specimen__specimenidentification__taxon__taxon__istartswith=${taxon}&fields=id,specimen_id,specimen__specimen_id,specimen_image_id,database__acronym,uuid_filename&format=json&distinct=true&order_by=stars`)
}

export function fetchRanks () {
    return fetch(`/taxon_rank/?order_by=sort`)
}