<template>
  <f7-list accordion-list>
    <f7-list-item group-title v-if="group"
      :title="group.label"
      :description="group.description"
      :footer="group.description" />
    <f7-list-item accordion-item media-item
      v-for="channelType in channelTypes"
      :key="channelType.id" :title="channelType.label"
      :footer="channelType.description"
      :badge="getLinkedItems(channelType)" badge-color="blue">
      <oh-icon v-if="channelType.category" slot="media" :icon="channelType.category" height="32" width="32" />
      <span v-else slot="media" class="item-initial">{{channelType.label[0]}}</span>
      <f7-accordion-content>
        {{channelType}}
      </f7-accordion-content>
    </f7-list-item>
  </f7-list>
</template>

<script>
export default {
  props: [
    'group',
    'channelTypes',
    'thing'
  ],
  methods: {
    getLinkedItems (channelType) {
      const channelId = (this.group) ? this.group.id + '#' + channelType.id : channelType.id
      const channel = this.thing.channels.find((c) => c.id === channelId)
      return channel.linkedItems.length
    }
  }
}
</script>

<style>

</style>
