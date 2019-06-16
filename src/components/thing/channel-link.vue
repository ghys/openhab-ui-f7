<template>
  <f7-list media-list inset class="margin-left searchbar-ignore">
    <f7-list-group v-if="!ready">
      <f7-list-item
        media-item
        v-for="n in links.length"
        :key="n"
        :class="`skeleton-text skeleton-effect-blink`"
        title="Label of the item"
        subtitle="type + semantic metadata"
        after="The item state"
        footer="This contains the type of the item"
      >
        <f7-skeleton-block style="width: 32px; height: 32px; border-radius: 50%" slot="media"></f7-skeleton-block>
      </f7-list-item>
    </f7-list-group>
    <f7-list-group v-else>
      <f7-list-item
        v-for="link in links" :key="link.itemName"
        media-item link
        class="channellist-linkeditem searchbar-ignore"
        @click="configureLink(link)"
        :title="(link.item.label) ? link.item.label : link.item.name"
        :footer="(link.item.label) ? link.item.name : '\xa0'"
        :subtitle="getItemTypeAndMetaLabel(link.item)"
        :after="link.item.state"
      >
        <oh-icon v-if="link.item.category" slot="media" :icon="link.item.category" height="32" width="32" />
        <span v-else slot="media" class="item-initial">{{link.item.name[0]}}</span>
        <f7-icon v-if="!link.item.editable" slot="after-title" f7="lock_fill" size="1rem" color="gray"></f7-icon>
        <!-- <f7-button slot="after-start" color="blue" icon-f7="compose" icon-size="24px" :link="`${item.name}/edit`"></f7-button> -->
      </f7-list-item>
    </f7-list-group>
    <f7-list-item class="searchbar-ignore" link
      color="blue" title="Add Link to Item..." @click="addLink()">
        <f7-icon slot="media" f7="add_round" color="blue" />
    </f7-list-item>
    <f7-list-button class="searchbar-ignore" color="blue" title="Configure Channel" @click="configureChannel()"></f7-list-button>
    <f7-list-button class="searchbar-ignore" v-if="extensible" color="red" title="Delete Channel"></f7-list-button>
  </f7-list>
</template>

<style lang="stylus">
.channellist-linkeditem .item-after
  overflow hidden
  max-width 30%
  span
    overflow hidden
    text-overflow ellipsis
</style>

<script>
import AddLinkPage from '@/pages/settings/things/link/link-add.vue'
import ConfigureLinkPage from '@/pages/settings/things/link/link-edit.vue'
import ConfigureChannelPage from '@/pages/settings/things/channel/channel-edit.vue'

export default {
  props: ['channelType', 'channelId', 'thing', 'opened', 'extensible'],
  data () {
    return {
      ready: false,
      channel: null,
      links: [],
      channelKind: ''
    }
  },
  methods: {
    buildLinks () {
      this.channel = this.thing.channels.find((c) => c.id === this.channelId)
      if (this.channel) {
        this.channelKind = this.channel.kind
        this.$set(this, 'links', [])
        let promises = []
        this.ready = false
        this.channel.linkedItems.forEach((itemName) => {
          let link = {
            itemName,
            item: { name: itemName }
          }
          this.links.push(link)
          const fetchItem = this.$oh.api.get('/rest/items/' + link.itemName + '?metadata=semantics')
          fetchItem.then((i) => {
            link.item = i
          })
          promises.push(fetchItem)
        })
        Promise.all(promises).then(() => {
          this.ready = true
        })
      }
    },
    editLink (link) {
      console.log('edit link')
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
          thing: this.thing,
          channel: this.thing.channels.find((c) => c.id === this.channelId)
        }
      })
    },
    configureLink (link) {
      const self = this
      const path = 'links/' + link.itemName + '/' + this.channelId
      this.$f7router.navigate({
        url: path,
        route: {
          component: ConfigureLinkPage,
          path: path,
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
          thing: this.thing,
          channel: this.thing.channels.find((c) => c.id === this.channelId),
          item: link.item
        }
      })
    },
    configureChannel (channel) {
      const self = this
      const path = 'channels/' + this.channelId + '/edit'
      this.$f7router.navigate({
        url: path,
        route: {
          component: ConfigureChannelPage,
          path: path,
          context: {
            operation: 'edit-channel'
          },
          on: {
            pageAfterOut (event, page) {
              const context = page.route.route.context
              const finalChannel = context.finalChannel
              if (finalChannel) {
                // replace the channel in-place
                const idx = self.thing.channels.findIndex((c) => c.uid === finalChannel.uid)
                self.$set(self.thing.channels, idx, finalChannel)
                self.$emit('channel-updated')
              }
            }
          }
        }
      }, {
        props: {
          thing: this.thing,
          channel: this.channel,
          channelType: this.channelType,
          channelId: this.channelId
        }
      })
    },
    getItemTypeAndMetaLabel (item) {
      let ret = item.type
      if (item.metadata && item.metadata.semantics) {
        ret += ' · '
        const classParts = item.metadata.semantics.value.split('_')
        ret += classParts[0]
        if (classParts.length > 1) {
          ret += '>' + classParts.pop()
        }
      }
      return ret
    }
  },
  watch: {
    opened (isOpen) {
      if (isOpen) {
        this.buildLinks()
      }
    },
    thing () {
      if (this.opened) {
        this.buildLinks()
      }
    }
  }
}
</script>
