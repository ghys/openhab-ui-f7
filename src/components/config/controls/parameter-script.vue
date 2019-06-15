<template>
  <ul>
      <f7-list-item
         :title="configDescription.label">
        <f7-button slot="after" @click="codeEditorOpened = true">Edit script</f7-button>
        <script-editor-popup :title="configDescription.label" :code="value" :opened="codeEditorOpened" @closed="codeEditorOpened = false"></script-editor-popup>
      </f7-list-item>
  </ul>
</template>

<script>
const ScriptEditorPopup = () => import('./script-editor-popup.vue')

export default {
  props: ['configDescription', 'value'],
  components: {
    ScriptEditorPopup
  },
  data () {
    return {
      codeEditorOpened: false
    }
  }
}
</script>
