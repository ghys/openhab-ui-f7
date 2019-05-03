<template>
  <img :src="iconUrl" :width="width" :height="height" />
</template>

<script>
export default {
  props: ['icon', 'width', 'height'],
  asyncComputed: {
    iconUrl () {
      return this.$oh.media.getIcon(this.icon)
    }
  }
}
</script>
