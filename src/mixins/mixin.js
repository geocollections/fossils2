let MyMixin = {
  data() {
    return {
      apiUrl : 'https://api.geocollections.info',
      fileUrl :  'http://files.geocollections.info',
      lang: 'ee',
      seealso_links : [
        {
          'keyword':'link_wikipedia',
          'url':'http://%(language)s.wikipedia.org/wiki/%(slug)s',
          'name':['f_link_wikipedia']},
        {
          'keyword':'taxon_id_tol',
          'url':'http://tolweb.org/%(slug)s',
          'name':['f_link_tolweb']},
        {
          'keyword':'taxon_id_eol',
          'url':'http://www.eol.org/pages/%(slug)s',
          'name':['f_link_eol']},
        {
          'keyword':'taxon_id_nrm',
          'url':'http://naturforskaren.se/species/%(slug)s',
          'name':['f_link_naturforskaren']},
        {
          'keyword':'taxon_id_plutof',
          'url':'http://elurikkus.ut.ee/elr_tree.php?id=%(slug)s',
          'name':['f_link_plutof']},
        {
          'keyword':'taxon_id_pbdb',
          'url':'https://paleobiodb.org/cgi-bin/bridge.pl?a=checkTaxonInfo&taxon_no=%(slug)s',
          'name':'Paleobiology Database'},
      ]
    }
  },
/*  watch: {
    lang: {
      handler: function(val, oldVal) {
        console.log(this.lang) // call it in the context of your component object
      },
      deep: true
    }
  },*/

  methods:{
    setLangChanged (lang) {
      this.lang = lang
    },
    changeMode: function(mode) {
      this.$localStorage.mode = mode
    },
    isInBaltoscandia: function(mode) {
      return mode === 'in_baltoscandia'
    },
    isDefinedAndNotEmpty(value) {
      return !!value && value.length > 0
    },
    isDefinedAndNotNull(value) {
      return !!value && value !== null
    },
    getRequest(url, isFullResponse = false){
      return new Promise((resolve, reject) => {
        this.$http.get(url,{}).then(response => {
          if (response.status === 200) {
            isFullResponse ? resolve( response.body) : resolve( response.body.results)
          } else {
            //
            this.handleError()
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
          reject(errResponse)
        });
      })
    },
    handleError() {}
  },
  openInNewWindow(params) {
    if (typeof (params.width) === 'undefined') {
      params.width = 500;
    }
    if (typeof (params.height) === 'undefined') {
      params.height = 500;
    }
    window.open(location.origin + '/' + params.object, '', 'width=' + params.width +
      ',height=' + params.height,scrollbars, resizable)
  },
};
export default MyMixin;
