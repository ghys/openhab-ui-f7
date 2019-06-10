<template>
  <f7-treeview-item selectable :label="model.item.label || model.item.name"
    :icon-ios="icon('ios')" :icon-aurora="icon('aurora')" :icon-md="icon('md')"
    :selected="selected === model"
    @click="select">
    <div v-if="model.children.locations.length > 0">
      <model-treeview-item v-for="location in model.children.locations"
      :key="location.item.name"
      :model="location" @selected="(event) => $emit('selected', event)"
      :selected="selected" />
    </div>
    <div v-if="model.children.equipments.length > 0">
      <model-treeview-item v-for="equipment in model.children.equipments"
      :key="equipment.item.name"
      :model="equipment" @selected="(event) => $emit('selected', event)"
      :selected="selected" />
    </div>
    <small slot="content-end" style="display:block"> ({{className()}})</small>
  </f7-treeview-item>
</template>

<script>
export default {
  props: ['model', 'selected'],
  methods: {
    icon (theme) {
      if (this.model.class.indexOf('Location_') === 0) {
        return (theme === 'md') ? 'material:place' : 'f7:placemark'
      }
      if (this.model.class.indexOf('Equipment_') === 0) {
        return (theme === 'md') ? 'material:highlight' : 'f7:bulb'
      }
    },
    className () {
      return this.model.class.substring(this.model.class.lastIndexOf('_') + 1)
    },
    select (event) {
      var self = this
      var $ = self.$$
      if ($(event.target).is('.treeview-toggle')) return
      this.$emit('selected', this.model)
    }
  }
}
</script>
