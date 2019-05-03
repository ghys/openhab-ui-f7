export default {
  getIcon: (icon, format) => {
    if (!format) format = 'svg'

    // prepend uri with base if applicable (Cordova)
    const serverUrl = localStorage.getItem('openhab.ui:serverUrl')
    const username = localStorage.getItem('openhab.ui:username')
    const password = localStorage.getItem('openhab.ui:password')

    if (serverUrl) {
      if (cordova && cordova.plugin.http) {
        if (username && password) {
          cordova.plugin.http.useBasicAuth(username, password)
        }

        return new Promise((resolve, reject) => {
          window.resolveLocalFileSystemURL(`${cordova.file.tempDirectory}/icon_${icon}.${format}`, (entry) => {
            // icon found in cache
            resolve(entry.toURL())
          }, () => {
            // download icon to cache
            cordova.plugin.http.downloadFile(`${serverUrl}/icon/${icon}`, { format: format },
              {}, `${cordova.file.tempDirectory}/icon_${icon}.${format}`, (entry) => {
                resolve(entry.toURL())
              }, (response) => {
                reject(response.error)
              })
          })
        })
      }
    }
  }
}
