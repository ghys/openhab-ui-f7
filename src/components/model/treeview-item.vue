<template>
  <f7-treeview-item selectable :label="(model.item.label || model.item.name)"
    :icon-ios="icon('ios')" :icon-aurora="icon('aurora')" :icon-md="icon('md')"
    :selected="selected && selected.item.name === model.item.name"
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
    <div v-if="model.children.points.length > 0">
      <model-treeview-item v-for="point in model.children.points"
      :key="point.item.name"
      :model="point" @selected="(event) => $emit('selected', event)"
      :selected="selected" />
    </div>
    <div slot="label" class="semantic-class"> {{className()}}</div>
  </f7-treeview-item>
</template>

<script>
export default {
  props: ['model', 'selected'],
  methods: {
    icon (theme) {
      if (this.model.class.indexOf('Location_') === 0) {
        return (theme === 'md') ? 'material:place' : 'f7:placemark'
      } else if (this.model.class.indexOf('Equipment_') === 0) {
        return (theme === 'md') ? 'material:highlight' : 'f7:bulb'
      } else if (this.model.class.indexOf('Point_') === 0) {
        return (theme === 'md') ? 'material:flash_on' : 'f7:bolt_fill'
      }
      return ''
    },
    className () {
      const semantics = this.model.item.metadata.semantics
      const property = (semantics.config && semantics.config.relatesTo)
        ? semantics.config.relatesTo : null
      return this.model.class.substring(this.model.class.lastIndexOf('_') + 1) +
        ((property) ? ' (' + property.replace('Property_', '') + ')' : '')
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
