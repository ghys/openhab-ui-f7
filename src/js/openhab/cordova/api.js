function prepareRequest (uri) {
  // prepend uri with base if applicable (Cordova)
  const serverUrl = localStorage.getItem('openhab.ui:serverUrl')
  const username = localStorage.getItem('openhab.ui:username')
  const password = localStorage.getItem('openhab.ui:password')

  if (serverUrl) {
    uri = serverUrl + uri
    if (cordova && cordova.plugin.http) {
      if (username && password) {
        cordova.plugin.http.useBasicAuth(username, password)
      }

      return true
    }
  }

  return false
}

export default {
  get (uri, data) {
    if (prepareRequest(uri)) {
      return new Promise((resolve, reject) => {
        cordova.plugin.http.get(uri, (data) ? data.data : null, {},
          function (response) {
            resolve(JSON.parse(response.data))
          }, function (response) {
            reject(response.error)
          })
      })
    }
  },
  post (uri, data) {
    if (prepareRequest(uri)) {
      return new Promise((resolve, reject) => {
        cordova.plugin.http.post(uri, (data) ? data.data : null, {},
          function (response) {
            resolve(JSON.parse(response.data))
          }, function (response) {
            reject(response.error)
          })
      })
    }
  },
  put (uri, data) {
    if (prepareRequest(uri)) {
      return new Promise((resolve, reject) => {
        cordova.plugin.http.put(uri, (data) ? data.data : null, {},
          function (response) {
            resolve(JSON.parse(response.data))
          }, function (response) {
            reject(response.error)
          })
      })
    }
  },
  delete (uri, data) {
    if (prepareRequest(uri)) {
      return new Promise((resolve, reject) => {
        cordova.plugin.http.delete(uri, (data) ? data.data : null, {},
          function (response) {
            resolve(JSON.parse(response.data))
          }, function (response) {
            reject(response.error)
          })
      })
    }
  }
}
