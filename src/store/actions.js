import {
    fetchStaticPage,
    fetchFrontPage,
    fetchRanks,
    fetchTaxon,
    fetchTaxonCommonName,
    fetchTaxonPages,
    fetchTypeSpecimen,
    fetchAttachment,
    fetchSpecimenIdentification,
    fetchTaxonOccurrence,
    fetchChildren,
    fetchSynonims,
    fetchTaxonList,
    fetchTaxonDescription,
    fetchDistributionConop,
    fetchSpecies,
    fetchDistributionSamples,
    fetchReferences, fetchReferences2, fetchSpeciesMap, fetchNumberOfSpecimenIdentifications
} from '../api'

export default {

    FETCH_PAGE: ({ commit, state }, { id }) => {
        return state.page[id]
          ? Promise.resolve(state.page[id])
          : fetchStaticPage(id).then(page => commit('SET_PAGE', { id, page }))
    },

    FETCH_FRONT_PAGE: ({ commit, state }, { lang }) => {
      return state.frontPage[lang]
          ? Promise.resolve(state.frontPage[lang])
          : fetchFrontPage(lang).then(frontPage => commit('SET_FRONT_PAGE', { lang, frontPage }))
    },

    FETCH_RANKS: ({ commit, state }) => {
        return state.lists.ranks.length > 0
            ? Promise.resolve(state.lists.ranks)
            : fetchRanks().then(rank => commit('SET_RANK', { rank }))
    },

    FETCH_TAXON: ({ commit, state }, { id }) => {
        return fetchTaxon(id).then(taxon => commit('SET_TAXON', { taxon }))
    },

    FETCH_COMMON_NAMES: ({ commit, state }, { id }) => {
        return fetchTaxonCommonName(id).then(names => commit('SET_COMMON_NAMES', { names }))
    },

    FETCH_SPECIMEN_ATTACHMENT: ({ commit, state }, { id }) => {
        return fetchAttachment(state.activeItem.taxon.hierarchy_string).then(images => commit('SET_SPECIMEN_ATTACHMENT', { images }))
    },

    FETCH_TYPE_SPECIMEN: ({ commit, state }, { id }) => {
        return fetchTypeSpecimen(state.activeItem.taxon.taxon).then(typeSpecimen => commit('SET_TAXON_TYPE_SPECIMEN', { typeSpecimen }))
    },

    FETCH_DISTRIBUTION_SAMPLES: ({ commit, state }, { id }) => {
        return fetchDistributionSamples(state.activeItem.taxon.taxon).then(distributionSamples => commit('SET_DISTRIBUTION_SAMPLES', { distributionSamples }))
    },
    FETCH_DISTRIBUTION_CONOP: ({ commit, state }, { id }) => {
        return fetchDistributionConop(state.activeItem.taxon.taxon).then(distributionConop => commit('SET_DISTRIBUTION_CONOP', { distributionConop }))
    },

    FETCH_TYPE_IDENTIFICATION: ({ commit, state }, { id }) => {
        return fetchSpecimenIdentification(state.activeItem.taxon.taxon).then(specimenIdentification => commit('SET_SPECIMEN_IDENTIFICATION', { specimenIdentification }))
    },
    FETCH_NUMBER_OF_SPECIMEN_IDENTIFICATION: ({ commit, state }, { id }) => {
        return fetchNumberOfSpecimenIdentifications(state.activeItem.taxon.id).then(number => commit('SET_NUMBER_OF_SPECIMEN_IDENTIFICATION', { number }))
    },

    FETCH_TAXON_OCCURRENCE: ({ commit, state }) => {
        return fetchTaxonOccurrence(state.activeItem.taxon.taxon).then(taxonOccurrence => commit('SET_TAXON_OCCURRENCE', { taxonOccurrence }))
    },

    FETCH_REFERENCES: ({ commit, state }) => {
        return fetchReferences(state.activeItem.taxon.hierarchy_string).then(references => commit('SET_REFERENCES', { references }))
    },

    FETCH_REFERENCES2: ({ commit, state }) => {
        return fetchReferences2(state.activeItem.taxon.hierarchy_string).then(references2 => commit('SET_REFERENCES2', { references2 }))
    },

    FETCH_TAXON_PAGE: ({ commit, state }, { id }) => {
        return fetchTaxonPages(id,state.lang).then(page => commit('SET_TAXON_PAGE', { page }))
    },

    FETCH_CHILDREN: ({ commit, state }, { id}) => {
        return fetchChildren(id, state.mode).then(children => commit('SET_CHILDREN', { children }))
    },

    FETCH_SYNONIMS: ({ commit, state }, { id}) => {
        return fetchSynonims(id).then(synonims => commit('SET_SYNONIMS', { synonims }))
    },

    FETCH_TAXON_LIST: ({ commit, state }, { id}) => {
        return fetchTaxonList(id).then(list => commit('SET_TAXON_LIST', { list }))
    },

    FETCH_SPECIES_MAP: ({ commit, state }, { id}) => {
        return fetchSpeciesMap(state.activeItem.taxon.taxon).then(map => commit('SET_SPECIES_MAP', { map }))
    },

    FETCH_DESCRIPTION: ({ commit, state }, { id}) => {
        return fetchTaxonDescription(id).then(description => commit('SET_DESCRIPTION', { description }))
    },
}
