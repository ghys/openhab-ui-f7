<template>
  <f7-card v-if="item.type !== 'Group'">
    <f7-card-content>
      <f7-list media-list>
        <ul>
          <f7-list-item v-for="l in enrichedLinks" :key="l.itemName"
            :title="l.thing.label" :subtitle="l.channel.label" :footer="l.link.channelUID">

          </f7-list-item>
          <f7-list-button color="blue" title="Add Link" @click="addLink"></f7-list-button>
        </ul>
      </f7-list>
    </f7-card-content>
  </f7-card>
</template>

<script>
import AddLinkPage from '@/pages/settings/things/link/link-add.vue'

export default {
  props: ['item', 'links'],
  data () {
    return {
      enrichedLinks: []
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.enrichedLinks = []
      const itemLinks = this.links.filter((l) => l.itemName === this.item.name)
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
    },
    addLink () {
      const self = this
      this.$f7router.navigate({
        url: 'links/new',
        route: {
          component: AddLinkPage,
          path: 'links/new',
          props: {
          },
          on: {
            pageAfterOut (event, page) {
              console.log('page closed')
              // const finalChannel = page.app.data.finalChannel
              // if (finalChannel) {
              //   delete page.app.data.finalChannel
              //   self.thing.channels.push(finalChannel)
              //   self.$emit('links-updated')
              // }
            }
          }
        }
      }, {
        props: {
          item: this.item
        }
      })
    }
  },
  watch: {
    item () {
      this.load()
    }
  }
}
</script>
