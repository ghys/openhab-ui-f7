<template>
  <f7-list accordion-list>
    <f7-list-item group-title v-if="group"
      :title="group.label"
      :description="group.description"
      :footer="group.description" />
    <f7-list-item accordion-item media-item class="channel-item"
      v-for="channelType in channelTypes"
      :key="channelType.id" :title="channelType.label"
      :footer="channelType.description"
      :subtitle="getChannelId(channelType) + ' (' + getItemType(channelType) + ')'"
      :badge="getLinkedItems(channelType).length || ''" badge-color="blue"
      @accordion:open="opened(channelType)">
      <oh-icon v-if="!extensible && channelType.category" slot="media" :icon="channelType.category" height="32" width="32" />
      <span v-else-if="!extensible && channelType.label" slot="media" class="item-initial">{{channelType.label[0]}}</span>
      <f7-accordion-content>
        <slot :channelType="channelType" :channelId="getChannelId(channelType)"></slot>
      </f7-accordion-content>
    </f7-list-item>
  </f7-list>
</template>

<script>
export default {
  props: [
    'extensible',
    'group',
    'channelTypes',
    'thing'
  ],
  methods: {
    getChannelId (channelType) {
      if (this.extensible) return channelType.id
      return (this.group) ? this.group.id + '#' + channelType.id : channelType.id
    },
    getChannel (channelId) {
      return this.thing.channels.find((c) => c.id === channelId)
    },
    getLinkedItems (channelType) {
      const channelId = this.getChannelId(channelType)
      const channel = this.getChannel(channelId)
      if (!channel || !channel.linkedItems.length) return []
      return channel.linkedItems
    },
    getItemType (channelType) {
      const channelId = this.getChannelId(channelType)
      const channel = this.getChannel(channelId)
      if (channel && channel.kind === 'TRIGGER') return 'Event'
      if (!channel || !channel.itemType) return '?'
      return channel.itemType
    },
    opened (channelType) {
      console.log('channel opened')
      this.$emit('channel-opened', {
        channelId: this.getChannelId(channelType),
        channel: this.getChannel(channelType)
      })
    }
  }
}
</script>

<style>

</style>
