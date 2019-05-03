import Framework7 from 'framework7/framework7.esm.bundle.js'

export default {
  api: {
    get (uri, data) {
      return Framework7.request.promise.json(uri, data)
    }
  },
  sse: {
    connect (path, topics, callback) {
      let eventSource
      // TODO handle basic auth with polyfill if necessary
      eventSource = new EventSource(path)

      eventSource.onmessage = (event) => {
        let evt = JSON.parse(event.data)
        callback(evt)
      }

      eventSource.onopen = (event) => {
        console.log('SSE connection open: ' + eventSource.url)
      }

      eventSource.onerror = () => {
        if (eventSource.readyState === 2) {
          console.log('%c=!= Event source connection broken...', 'background-color: red; color: white')
        }
      }

      return eventSource
    },
    close (client) {
      console.log('SSE connection closed: ' + client.url)
      client.close()
    }
  },
  media: {
    getIcon: (icon, format) => {
      if (!format) format = 'svg'

      // TODO handle basic auth with blobs and data URIs if necessary
      return Promise.resolve(`/icon/${icon}?format=${format}`)
    }
  }
}
