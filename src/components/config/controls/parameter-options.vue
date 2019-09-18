<template>
  <ul>
      <f7-list-item
         :title="configDescription.label" smart-select :smart-select-params="smartSelectParams" ref="item">
        <select :name="configDescription.name" @change="updateValue" :multiple="configDescription.multiple">
          <option v-for="option in configDescription.options" :value="option.value" :key="option.value" :selected="isSelected(option)">{{option.label}}</option>
        </select>
      </f7-list-item>
  </ul>
</template>

<script>
export default {
  props: ['configDescription', 'value'],
  data () {
    return {
      smartSelectParams: {}
    }
  },
  created () {
    if (this.configDescription.options.length < 10) {
      this.smartSelectParams.openIn = (this.configDescription.options.some((o) => o.label.length > 25)) ? 'sheet' : 'popover'
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
  },
  methods: {
    updateValue (event) {
      let value = this.$refs.item.f7SmartSelect.getValue()
      if (!this.configDescription.multiple && this.configDescription.type === 'INTEGER') {
        value = parseInt(value)
      }
      this.$emit('input', value)
    },
    isSelected (option) {
      if (this.value === null || this.value === undefined) return
      if (!this.configDescription.multiple) {
        return this.value.toString() === option.value
      } else {
        return this.value && this.value.indexOf(option.value) >= 0
      }
    }
  }
}
</script>
