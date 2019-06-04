<template>
  <img :src="iconUrl" :width="width" :height="height" onload="this.className=''" onerror="this.className='no-icon'" />
</template>

<style lang="stylus">
.no-icon
  display none !important
</style>

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
