let MyMixin = {
  data() {
    return {
      apiUrl : 'https://api.geocollections.info'
    }
  },
  methods:{
    isDefinedAndNotNull(value) {
      return !!value && value !== null
    },
    getRequest(url){
      return new Promise((resolve, reject) => {
        this.$http.get(url).then(response => {
          if (response.status === 200) {
            resolve( response.body.results)
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
    handleError() {

    }
  }
};
export default MyMixin;
