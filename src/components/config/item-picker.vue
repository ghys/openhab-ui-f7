<template>
<ul>
  <f7-list-item :title="title" smart-select :smart-select-params="smartSelectParams">
    <select :name="name" :multiple="multiple">
      <option v-for="item in items" :value="item.name" :key="item.name" :selected="value === item.name">
        {{item.label ? item.label + ' (' + item.name + ')' : item.name}}
      </option>
    </select>
  </f7-list-item>
</ul>
</template>

<script>
export default {
  props: ['title', 'name', 'value', 'multiple'],
  data () {
    return {
      items: [],
      icons: {},
      smartSelectParams: {
        openIn: 'popup',
        searchbar: true,
        searchbarPlaceholder: 'Search items',
        virtualList: true,
        virtualListHeight: (this.$theme.aurora) ? 32 : undefined
      }
    }
  },
  created () {
    this.smartSelectParams.closeOnSelect = !(this.multiple)
    // TODO use a Vuex store
    this.$oh.api.get('/rest/items').then((data) => {
      this.items = data.sort((a, b) => {
        const labelA = a.label || a.name
        const labelB = b.label || b.name
        return labelA.localeCompare(labelB)
      })
    })
  }
}
</script>
