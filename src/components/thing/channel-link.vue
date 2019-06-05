<template>
  <f7-list media-list inset class="margin-left searchbar-ignore">
    <!-- <f7-list-item v-if="!opened" :title="channelId"
          :class="`skeleton-text skeleton-effect-blink`" /> -->
    <f7-list-item class="searchbar-ignore" v-if="channelKind === 'TRIGGER'"
      subtitle="This is a trigger channel"
      footer="Use rules to catch events and react accordingly.">
    </f7-list-item>
    <f7-list-item v-for="link in links" :key="link.itemName" class="searchbar-ignore"
      :title="link.item.label || link.item.name" @click="editLink(link)" link
      :subtitle="link.item.label ? link.item.name : ''"
      :after="link.item.type">
        <oh-icon v-if="link.item.category" slot="media" :icon="link.item.category" height="32" width="32" />
        <span v-else slot="media" class="item-initial">{{link.item.name[0]}}</span>
    </f7-list-item>
    <f7-list-item class="searchbar-ignore" link v-if="channelKind !== 'TRIGGER'" color="blue" title="Add Link to Item..."></f7-list-item>
    <f7-list-button class="searchbar-ignore" color="blue" title="Configure Channel"></f7-list-button>
    <f7-list-button class="searchbar-ignore" v-if="extensible" color="red" title="Delete Channel"></f7-list-button>
  </f7-list>
</template>

<script>
export default {
  props: ['channelType', 'channelId', 'thing', 'opened', 'extensible'],
  data () {
    return {
      channel: null,
      links: [],
      channelKind: ''
    }
  },
  methods: {
    editLink (link) {
      console.log('edit link')
    }
  },
  watch: {
    opened (isOpen) {
      if (isOpen) {
        console.log('fetch links now')
        this.channel = this.thing.channels.find((c) => c.id === this.channelId)
        if (this.channel) {
          this.channelKind = this.channel.kind
          if (this.channelKind === 'STATE') {
            // this.links = this.channel.linkedItems.map((itemName) => {
            //   return {
            //     item: { name }
            //   }
            // })
            this.$set(this, 'links', [])
            this.channel.linkedItems.forEach((itemName) => {
              let link = {
                itemName,
                item: { name: itemName }
              }
              this.links.push(link)
              this.$oh.api.get('/rest/items/' + link.itemName).then((i) => {
                link.item = i
              })
            })
          }
        }
      }
    }
  }
}
</script>
