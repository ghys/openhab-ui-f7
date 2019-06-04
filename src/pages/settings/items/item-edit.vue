<template>
  <f7-page @page:beforeremove="onPageBeforeRemove" @page:init="onPageInit">
    <f7-navbar :title="'Edit: ' + item.name" back-link="Cancel">
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Save</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block class="block-narrow">
      <f7-col v-if="!item.editable">
        <div class="padding-left">Note: this item is not editable because it has been created with textual configuration.</div>
      </f7-col>
      <f7-col>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input label="Name" type="text" disabled placeholder="Name" :value="item.name">
          </f7-list-input>
          <f7-list-input label="Label" type="text" placeholder="Name" :value="item.label"
                         @input="item.label = $event.target.value" clear-button>
          </f7-list-input>
          <f7-list-input label="Category" input-id="input-category" autocomplete="off" type="text" placeholder="Name" :value="item.category"
                         @input="item.category = $event.target.value" clear-button>
            <div class="padding" slot="root-end">
              <oh-icon :icon="item.category" height="32" width="32" />
            </div>
          </f7-list-input>
          <f7-list-item v-if="item.type" title="Type" type="text" placeholder="Name" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
            <select name="select-type" @change="item.type = $event.target.value">
              <option v-for="type in types.ItemTypes" :key="type" :value="type" :selected="type === item.type">{{type}}</option>
            </select>
          </f7-list-item>
          <f7-list-item v-if="item.type === 'Group'" title="Base Type" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
            <select name="select-basetype" @change="item.groupType = $event.target.value">
              <option v-for="type in types.GroupTypes" :key="type" :value="type" :selected="type === item.groupType">{{type}}</option>
            </select>
          </f7-list-item>
          <f7-list-item v-if="item.type === 'Number'" title="Dimension" smart-select :smart-select-params="{openIn: 'popup', searchbar: true, closeOnSelect: true}">
            <select name="select-dimension" @change="item.dimension = $event.target.value">
              <option v-for="type in types.Dimensions" :key="type" :value="type" :selected="type === item.dimension">{{type}}</option>
            </select>
          </f7-list-item>
          <f7-list-item v-if="item.type === 'Group' && ['Number', 'Dimmer', 'Rollershutter'].indexOf(item.groupType) >= 0" title="Function" smart-select :smart-select-params="{openIn: 'popover', closeOnSelect: true}">
            <select name="select-function" @change="item.function = $event.target.value">
              <option v-for="type in types.ArithmeticFunctions" :key="type.name" :value="type.name" :selected="type.name === item.function">{{type.value}}</option>
            </select>
          </f7-list-item>
          <f7-list-item v-if="item.type === 'Group' && ['Contact'].indexOf(item.groupType) >= 0" title="Function" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
            <select name="select-function" @change="item.function = $event.target.value">
              <option v-for="type in types.LogicalOpenClosedFunctions" :key="type.name" :value="type.name" :selected="type.name === item.function">{{type.value}}</option>
            </select>
          </f7-list-item>
          <f7-list-item v-if="item.type === 'Group' && ['DateTime'].indexOf(item.groupType) >= 0" title="Function" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
            <select name="select-function" @change="item.function = $event.target.value">
              <option v-for="type in types.DateTimeFunctions" :key="type.name" :value="type.name" :selected="type.name === item.function">{{type.value}}</option>
            </select>
          </f7-list-item>
          <f7-list-item v-if="item.type === 'Group' && ['Switch', 'None'].indexOf(item.groupType) >= 0" title="Function" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
            <select name="select-function" @change="item.function = $event.target.value">
              <option v-for="type in types.LogicalOnOffFunctions" :key="type.name" :value="type.name" :selected="type.name === item.function">{{type.value}}</option>
            </select>
          </f7-list-item>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-block-title>Group Membership</f7-block-title>
        <f7-list v-if="ready">
          <item-picker title="Parent Group(s)" name="parent-groups" :value="item.groupNames" :multiple="true" filterType="Group"></item-picker>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-block-title>Semantics</f7-block-title>
        <f7-list no-hairlines-md>
          <f7-list-item v-if="ready" title="Semantic Class" smart-select :smart-select-params="{searchbar: true, openIn: 'popup', closeOnSelect: true}">
            <select name="select-semantics-class" @change="semanticClass = $event.target.value">
              <option :value="''">None</option>
              <optgroup label="Locations">
                <option v-for="type in semanticClasses.Locations" :key="type" :value="type" :selected="type === semanticClass">{{type}}</option>
              </optgroup>
              <optgroup label="Equipments">
                <option v-for="type in semanticClasses.Equipments" :key="type" :value="type" :selected="type === semanticClass">{{type}}</option>
              </optgroup>
              <optgroup label="Points">
                <option v-for="type in semanticClasses.Points" :key="type" :value="type" :selected="type === semanticClass">{{type}}</option>
              </optgroup>
            </select>
          </f7-list-item>
          <f7-list-item v-if="currentSemanticType" title="Semantic Type" :after="currentSemanticType" />
          <f7-list-item v-if="ready && currentSemanticType == 'Point'" title="Semantic Property" smart-select :smart-select-params="{searchbar: true, openIn: 'popup', closeOnSelect: true}">
            <select name="select-semantics-proerty" @change="semanticProperty = $event.target.value">
              <option :value="''">None</option>
              <option v-for="type in semanticClasses.Properties" :key="type" :value="type" :selected="type === semanticProperty">{{type}}</option>
            </select>
          </f7-list-item>
        </f7-list>
      </f7-col>
      <f7-col class="tags-editor">
        <f7-block-title>Non-Semantic Tags</f7-block-title>
        <f7-list no-hairlines>
          <f7-list-input
            type="text"
            placeholder="Add tag"
            :value="pendingTag"
            @input="pendingTag = $event.target.value"
            @blur="addTag()"
            class="add-tag-input"
          ></f7-list-input>
        </f7-list>
        <f7-block strong no-hairlines-md v-if="item.tags" style="margin-top: 0">
          <f7-chip v-for="tag in item.tags.filter((t) => t !== semanticClass && t !== semanticProperty)" :key="tag" :text="tag" deleteable @click="deleteTag"></f7-chip>
        </f7-block>
      </f7-col>
      <f7-col>
        <f7-list>
          <f7-list-button color="blue" title="Edit Channel Links"></f7-list-button>
        </f7-list>
        <f7-list>
          <f7-list-button color="red" title="Delete this Item"></f7-list-button>
        </f7-list>
      </f7-col>
    </f7-block>
  </f7-page>
</template>

<style lang="stylus">
.tags-editor .list
  margin-bottom 0
  border 0
</style>

<script>
import { Categories } from '@/assets/categories.js'
import * as Types from '@/assets/item-types.js'
import * as SemanticClasses from '@/assets/semantics.js'

import ItemPicker from '@/components/config/controls/item-picker.vue'

export default {
  props: ['itemName'],
  components: {
    ItemPicker
  },
  data () {
    return {
      ready: false,
      item: {},
      types: Types,
      semanticClasses: SemanticClasses,
      semanticClass: '',
      semanticProperty: '',
      pendingTag: ''
    }
  },
  created () {
  },
  methods: {
    onPageBeforeRemove () {
      this.categoryAutocomplete.destroy()
    },
    onPageInit () {
      const loadItem = this.$oh.api.get('/rest/items/' + this.itemName + '?metadata=semantics')
      loadItem.then((data) => {
        if (!data.groupType) data.groupType = 'None'
        if (!data.function) data.function = ''
        data.dimension = ''
        this.item = data
        if (this.item.type.indexOf(':') > 0) {
          this.item.dimension = this.item.type.split(':')[1]
          this.item.type = this.item.type.split(':')[0]
        }
        this.item.tags.forEach((t) => {
          if (this.semanticType(t) !== '') {
            this.semanticClass = t
          }
          if (this.isSemanticPropertyTag(t)) {
            this.semanticProperty = t
          }
        })
        this.initializeAutocomplete()
        this.ready = true
      })
    },
    initializeAutocomplete () {
      this.categoryAutocomplete = this.$f7.autocomplete.create({
        inputEl: '#input-category',
        openIn: 'dropdown',
        source (query, render) {
          if (!query || !query.length) {
            render([])
          } else {
            render(Categories.filter((c) => c.toLowerCase().indexOf(query.toLowerCase()) === 0))
          }
        }
      })
    },
    semanticType (tag) {
      if (this.semanticClasses.Locations.indexOf(tag) >= 0) return 'Location'
      if (this.semanticClasses.Equipments.indexOf(tag) >= 0) return 'Equipment'
      if (this.semanticClasses.Points.indexOf(tag) >= 0) return 'Point'
      return ''
    },
    isSemanticPropertyTag (tag) {
      return (this.semanticClasses.Properties.indexOf(tag) >= 0)
    },
    addTag () {
      if (this.pendingTag && this.item.tags.indexOf(this.pendingTag) === -1) {
        this.item.tags.push(this.pendingTag)
      }
      this.pendingTag = ''
    },
    deleteTag (chip) {
      const tag = chip.innerText
      if (this.item.tags.indexOf(tag)) {
        this.item.tags.splice(this.item.tags.indexOf(tag))
      }
    },
    save () {
      this.$f7.dialog.alert('Save not implemented!')
    }
  },
  computed: {
    currentSemanticType () {
      return this.semanticType(this.semanticClass)
    }
  }
}
</script>
