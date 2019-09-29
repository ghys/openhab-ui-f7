<template>
  <f7-popup class="script-editor" tablet-fullscreen @popup:opened="() => showEditor = true" @popup:closed="$emit('closed')" :opened="opened">
    <f7-page class="code-editor-content">
      <f7-navbar :title="title">
        <f7-nav-right>
          <f7-link popup-close=".script-editor">Close</f7-link>
        </f7-nav-right>
      </f7-navbar>
      <editor v-if="showEditor" :code="code"></editor>
    </f7-page>
  </f7-popup>
</template>

<style lang="stylus">
.code-editor-content
  background white
</style>

<script>
export default {
  components: {
    'editor': () => import('./script-editor.vue')
  },
  props: ['title', 'code', 'opened'],
  data () {
    return {
      showEditor: false
    }
  },
  methods: {
    initChart () {
      this.showEditor = true
    }
  }
}
</script>
