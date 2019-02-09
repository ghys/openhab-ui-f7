import Framework7 from 'framework7/framework7.esm.bundle.js'

export default {
  api: {
    get (uri, data) {
      // prepend uri with base if applicable (Cordova)
      const serverUrl = localStorage.getItem('openhab.ui:serverUrl')
      const username = localStorage.getItem('openhab.ui:username')
      const password = localStorage.getItem('openhab.ui:password')

      if (serverUrl) uri = serverUrl + uri
      if (username && password) {
        const authorizationHeader = 'Basic ' + btoa(username + ':' + password)
        Framework7.request.setup({
          headers: {
            Authorization: authorizationHeader
          }
        })
      }

      return Framework7.request.promise.json(uri, data)
    }
  }
}
