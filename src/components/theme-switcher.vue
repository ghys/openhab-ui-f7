<template>
  <f7-block strong>Theme:
    <f7-segmented>
      <f7-button round color="blue" raised @click="switchTheme('auto')">Auto</f7-button>
      <f7-button round color="blue" raised @click="switchTheme('md')">MD</f7-button>
      <f7-button round color="blue" raised @click="switchTheme('ios')">iOS</f7-button>
      <f7-button round color="blue" raised @click="switchTheme('aurora')">Aurora</f7-button>
    </f7-segmented>
  </f7-block>
</template>
<script>
export default {
  methods: {
    switchTheme (theme) {
      localStorage.setItem('openhab.ui:theme', theme)
      location.reload()
      // document.location = document.location.origin + document.location.pathname + '?theme=' + theme
    }
  }
}
</script>
