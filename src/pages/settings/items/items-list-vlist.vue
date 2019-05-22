<template>
  <f7-page>
    <f7-navbar title="Items" back-link="Back">
      <f7-nav-right>
        <f7-link icon-md="material:done_all" @click="toggleCheck()"
        :text="(!$theme.md) ? ((showCheckboxes) ? 'Done' : 'Select') : ''"></f7-link>
      </f7-nav-right>
      <f7-subnavbar :inner="false" v-show="initSearchbar">
        <f7-searchbar
          v-if="initSearchbar"
          class="searchbar-items"
          :init="initSearchbar"
          search-container=".virtual-list"
          search-in=".item-title"
          remove-diacritics
        ></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>
    <f7-toolbar class="contextual-toolbar" :class="{ 'navbar': $theme.md }" v-if="showCheckboxes" bottom-ios bottom-aurora>
      <f7-link v-show="selectedItems.length" v-if="!$theme.md" class="delete" icon-ios="f7:trash" icon-aurora="f7:trash">Delete {{selectedItems.length}}</f7-link>
      <f7-link v-if="$theme.md" icon-md="material:close" @click="showCheckboxes = false"></f7-link>
      <div class="title" v-if="$theme.md">
        {{selectedItems.length}} selected
      </div>
      <div class="right" v-if="$theme.md">
        <f7-link icon-md="material:delete"></f7-link>
      </div>
    </f7-toolbar>

    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
    <f7-block class="block-narrow" v-if="loading">
      <f7-block-title class="col wide">Loading...</f7-block-title>
      <f7-list v-if="loading" class="col wide">
        <f7-list-group>
          <f7-list-item
            media-item
            v-for="n in 20"
            :key="n"
            :class="`skeleton-text skeleton-effect-blink`"
            title="Label of the item"
            subtitle="This contains the name of the item"
            after="The item type"
          >
          </f7-list-item>
        </f7-list-group>
      </f7-list>
    </f7-block>
    <f7-block class="block-narrow" v-if="items.length > 0">
      <f7-col>
        <f7-block-title>{{items.length}} items</f7-block-title>
        <f7-list
          class="searchbar-found"
          media-list
          virtual-list
          :virtual-list-params="{ items, searchAll, renderExternal, height: $theme.ios ? 64 : $theme.aurora ? 46 : 73}"
        >
          <ul>
            <f7-list-item
              v-for="(item, index) in vlData.items"
              :key="index"
              media-item
              :checkbox="showCheckboxes"
              :checked="isChecked(item.name)"
              @change="(e) => toggleItemCheck(e, item.name)"
              :link="showCheckboxes ? null : item.name"
              :title="(item.label) ? item.label : item.name"
              :subtitle="(item.label) ? item.name : '-'"
              :after="item.type"
              :style="`top: ${vlData.topPosition}px`"
            >
              <oh-icon v-if="item.category" slot="media" :icon="item.category" height="32" width="32" />
              <span v-else slot="media" class="item-initial">{{item.name[0]}}</span>
            </f7-list-item>
          </ul>
        </f7-list>
      </f7-col>
    </f7-block>
    <!-- <f7-block v-if="!items.length" class="service-config block-narrow">
      <f7-col>
        <f7-block strong>
          <p>No items.</p>
        </f7-block>
      </f7-col>
    </f7-block>-->
    <f7-fab position="right-bottom" slot="fixed" color="blue" href="add">
      <f7-icon ios="f7:add" md="material:add" aurora="f7:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close" aurora="f7:close"></f7-icon>
    </f7-fab>
  </f7-page>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      items: [], // [{ label: 'Staircase', name: 'Staircase'}],
      indexedItems: {},
      initSearchbar: false,
      vlData: {
        items: []
      },
      selectedItems: [],
      showCheckboxes: false
    }
  },
  created () {
    this.loading = true
    this.$oh.api.get('/rest/items').then(data => {
      this.items = data
      // simulate a large list
      // this.items = [
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data,
      //   ...data
      // ]
      this.items = this.items.sort((a, b) => {
        const labelA = a.label || a.name
        const labelB = b.label || b.name
        return labelA.localeCompare(labelB)
      })
      this.indexedItems = this.items.reduce((prev, item, i, items) => {
        const initial = (item.label) ? item.label.substring(0, 1).toUpperCase() : item.name.substring(0, 1).toUpperCase()
        if (!prev[initial]) {
          prev[initial] = []
        }
        prev[initial].push(item)

        return prev
      }, {})
      this.loading = false

      setTimeout(() => {
        this.initSearchbar = true
      })
    })
  },
  methods: {
    searchAll (query, items) {
      const found = []
      for (let i = 0; i < items.length; i += 1) {
        var haystack = items[i].name
        if (items[i].label) haystack += ' ' + items[i].label
        if (
          haystack.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          query.trim() === ''
        ) { found.push(i) }
      }
      return found // return array with mathced indexes
    },
    renderExternal (vl, vlData) {
      this.vlData = vlData
    },
    toggleCheck () {
      this.showCheckboxes = !this.showCheckboxes
    },
    isChecked (item) {
      return this.selectedItems.indexOf(item) >= 0
    },
    toggleItemCheck (event, item) {
      console.log('toggle check')
      if (this.isChecked(item)) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1)
      } else {
        this.selectedItems.push(item)
      }
    }
  },
  asyncComputed: {
    iconUrl () {
      return icon => this.$oh.media.getIcon(icon)
    }
  }
}
</script>
