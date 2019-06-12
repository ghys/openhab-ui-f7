<template>
  <f7-card>
    <f7-card-content>
      <f7-list media-list>
        <ul>
          <f7-list-item v-for="l in enrichedLinks" :key="l.itemName"
            :title="l.thing.label" :subtitle="l.channel.label" :footer="l.link.channelUID">

          </f7-list-item>
          <f7-list-button color="blue" title="Add Link"></f7-list-button>
        </ul>
      </f7-list>
    </f7-card-content>
  </f7-card>
</template>

<script>
export default {
  props: ['model', 'links'],
  data () {
    return {
      enrichedLinks: []
    }
  },
  methods: {
    load () {
      this.enrichedLinks = []
      const itemLinks = this.links.filter((l) => l.itemName === this.model.item.name)
      const thingNames = itemLinks.map((l) => l.channelUID.substring(0, l.channelUID.lastIndexOf(':')))
      const promises = thingNames.map((t) => this.$oh.api.get('/rest/things/' + t))
      Promise.all(promises).then((things) => {
        itemLinks.forEach((l) => {
          const thing = things.find((t) => t.channels.some((c) => c.uid === l.channelUID))
          if (thing) {
            const channel = thing.channels.find((c) => c.uid === l.channelUID)
            this.enrichedLinks.push({
              link: l,
              thing: thing,
              channel: channel
            })
          }
        })
      })
    }
  },
  watch: {
    model () {
      this.load()
    }
  }
}
</script>
