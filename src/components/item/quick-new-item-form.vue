<template>
  <f7-block v-if="newItem || checked" class="quick-link-form no-padding">
    <f7-list inline-labels no-hairlines-md>
      <f7-list-input label="Name" type="text" placeholder="Name" :value="item.name">
      </f7-list-input>
      <f7-list-input label="Label" type="text" placeholder="Name" :value="item.label"
                      @input="item.label = $event.target.value" clear-button>
      </f7-list-input>
      <f7-list-input v-if="!hideCategory" ref="category" label="Category" autocomplete="off" type="text" placeholder="Name" :value="item.category"
                      @input="item.category = $event.target.value" clear-button>
        <div slot="root-end" style="margin-left: calc(35% + 8px)" v-if="item.category">
          <oh-icon :icon="item.category" height="32" width="32" />
        </div>
      </f7-list-input>
      <f7-list-item v-if="item.type && !hideType" title="Type" type="text" placeholder="Name" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
        <select name="select-type" @change="item.type = $event.target.value">
          <option v-for="type in types.ItemTypes" :key="type" :value="type" :selected="type === item.type">{{type}}</option>
        </select>
      </f7-list-item>
    </f7-list>
    <semantics-picker v-if="!hideSemantics" :item="item" :same-class-only="true" :hide-type="true" />
  </f7-block>
</template>

<style lang="stylus">
.quick-link-form
  .item-inner
    display inherit !important
  .item-title
    font-weight inherit !important
</style>

<script>
import SemanticsPicker from '@/components/item/semantics-picker.vue'
import * as Types from '@/assets/item-types.js'
import { Categories } from '@/assets/categories.js'

export default {
  props: ['newItem', 'channel', 'channelId', 'channelType', 'checked', 'hideCategory', 'hideType', 'hideSemantics'],
  components: {
    SemanticsPicker
  },
  data () {
    let item = {}
    if (this.channel) {
      item = {
        name: 'New Item',
        label: this.channel.label,
        tags: ['Point']
      }
    } else {
      item = Object.assign({}, this.newItem)
    }
    if (!item.category) item.category = ''
    return {
      item: item,
      types: Types,
      categoryInputId: ''
    }
  },
  methods: {
    initializeAutocomplete (inputElement) {
      this.categoryAutocomplete = this.$f7.autocomplete.create({
        inputEl: inputElement,
        openIn: 'dropdown',
        source (query, render) {
          if (!query || !query.length) {
            render([])
          } else {
            render(Categories.filter((c) => c.toLowerCase().indexOf(query.toLowerCase()) >= 0))
          }
        }
      })
    }
  },
  mounted () {
    const categoryControl = this.$refs.category
    if (!categoryControl || !categoryControl.$el) return
    const inputElement = this.$$(categoryControl.$el).find('input')
    this.initializeAutocomplete(inputElement)
  }
}
</script>
