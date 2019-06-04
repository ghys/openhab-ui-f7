<template>
    <f7-list class="config-parameter" :no-hairlines-md="configDescription.type !== 'BOOLEAN' && !configDescription.options.length && !configDescription.context">
      <f7-list-input
        v-if="configDescription.type === 'TEXT' && !configDescription.options.length && !configDescription.context"
        :label="configDescription.label"
        :name="configDescription.name"
        :value="value"
        type="text" />
      <f7-list-input
        v-if="configDescription.type === 'INTEGER' && !configDescription.options.length && !configDescription.context"
        :name="configDescription.name"
        :label="configDescription.label"
        :value="actualValue"
        type="number" />
      <f7-list-item v-if="configDescription.type === 'TEXT' && configDescription.context === 'script'"
         :title="configDescription.label">
        <f7-button slot="after" @click="codeEditorOpened = true">Edit script</f7-button>
        <script-editor-popup :title="configDescription.label" :code="value" :opened="codeEditorOpened" @closed="codeEditorOpened = false"></script-editor-popup>
      </f7-list-item>
      <item-picker v-if="configDescription.type === 'TEXT' && configDescription.context === 'item'"
         :title="configDescription.label" />
      <f7-list-item v-else-if="configDescription.options.length"
         :title="configDescription.label" smart-select :smart-select-params="smartSelectParams">
        <select :name="configDescription.name" @change="updateValue($event.target.value)">
          <option v-for="option in configDescription.options" :value="option.value" :key="option.value" :selected="actualValue === option.value">{{option.label}}</option>
        </select>
      </f7-list-item>
      <f7-list-item v-if="configDescription.type === 'BOOLEAN'" :title="configDescription.label">
        <f7-toggle slot="after" :name="configDescription.name" :checked="actualValue"></f7-toggle>
      </f7-list-item>
      <f7-block-footer slot="after-list" class="param-description">
        <small v-html="configDescription.description"></small>
      </f7-block-footer>
    </f7-list>
</template>

<script>
const ScriptEditorPopup = () => import('./controls/script-editor-popup.vue')
// import ScriptEditorPopup from './config/script-editor-popup.vue'
import ItemPicker from './controls/item-picker.vue'

export default {
  components: {
    ScriptEditorPopup,
    ItemPicker
  },
  props: [
    'configDescription',
    'value'
  ],
  data () {
    return {
      smartSelectParams: {},
      codeEditorOpened: false
    }
  },
  computed: {
    actualValue () {
      if (this.configDescription.type === 'BOOLEAN' && typeof (this.value) === 'string') {
        return this.value === 'true'
      } else if (this.configDescription.type === 'INTEGER') {
        return parseInt(this.value)
      }
      return this.value
    }
  },
  methods: {
    updateValue (value) {
      console.log('update value to ' + value)
    }
  },
  created () {
    if (this.configDescription.options.length < 10) {
      this.smartSelectParams.openIn = 'popover'
    } else if (this.configDescription.options.length > 100) {
      this.smartSelectParams.openIn = 'popup'
      this.smartSelectParams.searchbar = true
      this.smartSelectParams.virtualList = true
      if (this.$theme.aurora) this.smartSelectParams.virtualListHeight = 32
    } else {
      this.smartSelectParams.openIn = 'popup'
      this.smartSelectParams.searchbar = true
    }
    this.smartSelectParams.closeOnSelect = !(this.configDescription.multiple)
    // this.smartSelectParams.routableModals = false // to fix bug on firefox
  }
}
</script>

<style lang="stylus">
.param-description
  padding-left 16px !important
  p
    margin 0 !important
.smart-select-popover.popover
  --f7-popover-width 320px
</style>
