<template>
  <ul>
      <f7-list-input
        :floating-label="$theme.md"
        :label="configDescription.label"
        :name="configDescription.name"
        :value="value"
        :required="configDescription.required" validate
        :clear-button="!configDescription.required"
        @input="updateValue"
        :type="(configDescription.context === 'password') ? 'password' : 'text'" />
  </ul>
</template>

<script>
export default {
  props: ['configDescription', 'value'],
  methods: {
    updateValue (event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
