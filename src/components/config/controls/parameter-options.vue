<template>
  <ul>
      <f7-list-item
         :title="configDescription.label" smart-select :smart-select-params="smartSelectParams">
        <select :name="configDescription.name" @change="updateValue($event.target.value)">
          <option v-for="option in configDescription.options" :value="option.value" :key="option.value" :selected="value === option.value">{{option.label}}</option>
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
    updateValue (value) {
      this.$emit('input', value)
    }
  }
}
</script>
