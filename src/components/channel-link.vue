<template>
  <f7-list accordion-list inset>
    <f7-list-item accordion-item
      v-for="channelType in channelTypes"
      :key="channelType.id" :title="channelType.label" :footer="channelType.description">
      <f7-accordion-content>
        {{channelType}}
      </f7-accordion-content>
    </f7-list-item>
  </f7-list>
</template>

<script>
export default {
  props: [
    'channelTypes',
    'thing'
  ]
}
</script>

<style>

</style>
