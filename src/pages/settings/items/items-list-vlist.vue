<template>
  <f7-page @page:afterin="onPageAfterIn">
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
          search-in=".item-title, .item-subtitle, .item-footer"
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
    <!-- skeleton for not ready -->
    <f7-block class="block-narrow" v-if="!ready">
      <f7-block-title class="col wide">Loading...</f7-block-title>
      <f7-list media-list class="col wide">
        <f7-list-group>
          <f7-list-item
            media-item
            v-for="n in 20"
            :key="n"
            :class="`skeleton-text skeleton-effect-blink`"
            title="Label of the item"
            subtitle="type, semantic metadata"
            after="The item state"
            footer="This contains the type of the item"
          >
            <f7-skeleton-block style="width: 32px; height: 32px; border-radius: 50%" slot="media"></f7-skeleton-block>
          </f7-list-item>
        </f7-list-group>
      </f7-list>
    </f7-block>
    <f7-block class="block-narrow" v-else>
      <f7-col>
        <f7-block-title class="col wide">{{items.length}} items</f7-block-title>
        <f7-list
          class="searchbar-found col wide"
          media-list
          virtual-list
          :virtual-list-params="{ items, searchAll, renderExternal, height: $theme.ios ? 78 : $theme.aurora ? 60 : 87}"
        >
          <ul>
            <f7-list-item
              v-for="(item, index) in vlData.items"
              :key="index"
              media-item
              class="itemlist-item"
              :checkbox="showCheckboxes"
              :checked="isChecked(item.name)"
              @change="(e) => toggleItemCheck(e, item.name)"
              :link="showCheckboxes ? null : item.name"
              :title="(item.label) ? item.label : item.name"
              :footer="(item.label) ? item.name : '\xa0'"
              :subtitle="getItemTypeAndMetaLabel(item)"
              :style="`top: ${vlData.topPosition}px`"
              :after="item.state"
            >
              <oh-icon v-if="item.category" slot="media" :icon="item.category" height="32" width="32" />
              <span v-else slot="media" class="item-initial">{{item.name[0]}}</span>
              <f7-icon v-if="!item.editable" slot="after-title" f7="lock_fill" size="1rem" color="gray"></f7-icon>
              <!-- <f7-button slot="after-start" color="blue" icon-f7="compose" icon-size="24px" :link="`${item.name}/edit`"></f7-button> -->
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

<style lang="stylus">
.itemlist-item .item-after
  overflow hidden
  max-width 30%
  span
    overflow hidden
    text-overflow ellipsis
</style>

<script>
export default {
  data () {
    return {
      ready: false,
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

  },
  methods: {
    onPageAfterIn () {
      if (this.ready) return
      this.loading = true
      this.$oh.api.get('/rest/items?metadata=semantics').then(data => {
        this.items = data.sort((a, b) => {
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
        this.ready = true

        setTimeout(() => {
          this.initSearchbar = true
        })
      })
    },
    searchAll (query, items) {
      const found = []
      for (let i = 0; i < items.length; i += 1) {
        var haystack = items[i].name
        if (items[i].label) haystack += ' ' + items[i].label
        haystack += this.getItemTypeAndMetaLabel(items[i])
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
    getItemTypeAndMetaLabel (item) {
      let ret = item.type
      if (item.metadata && item.metadata.semantics) {
        ret += ' · '
        const classParts = item.metadata.semantics.value.split('_')
        ret += classParts[0]
        if (classParts.length > 1) {
          ret += '>' + classParts.pop()
        }
      }
      return ret
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
