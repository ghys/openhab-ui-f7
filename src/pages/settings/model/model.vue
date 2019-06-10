<template>
  <f7-page @page:afterin="onPageAfterIn" @click="selectItem(null)">
    <f7-navbar title="Semantic Model" back-link="Back">
      <f7-nav-right>
        <f7-link icon-md="material:done_all" @click="toggleCheck()"
        :text="(!$theme.md) ? ((showCheckboxes) ? 'Done' : 'Select') : ''"></f7-link>
      </f7-nav-right>
      <!-- <f7-subnavbar :inner="false" v-show="initSearchbar">
        <f7-searchbar
          v-if="initSearchbar"
          class="searchbar-items"
          :init="initSearchbar"
          search-container=".virtual-list"
          search-in=".item-title, .item-subtitle, .item-footer"
          remove-diacritics
        ></f7-searchbar>
      </f7-subnavbar> -->
    </f7-navbar>
    <f7-toolbar class="contextual-toolbar" :class="{ 'navbar': $theme.md }" v-if="selectedItem != null" bottom>
    </f7-toolbar>

    <f7-block v-if="!ready" class="text-align-center">
      <f7-preloader></f7-preloader>
      <div>Loading...</div>
    </f7-block>
    <f7-block v-else>
      <f7-row>
        <f7-col width="100" desktop-width="50" tablet-width="50">
          <f7-block strong>
            <f7-treeview>
              <model-treeview-item v-for="location in rootLocations" :key="location.item.name" :model="location"
                @selected="selectItem" :selected="selectedItem">
              </model-treeview-item>
            </f7-treeview>
          </f7-block>
        </f7-col>
        <f7-col v-if="selectedItem" width="100" desktop-width="50" tablet-width="50">
          <f7-block>
            <f7-card>
              <f7-card-header>{{selectedItem.item.label || selectedItem.item.name}}</f7-card-header>
              <f7-card-content>
              </f7-card-content>
            </f7-card>
          </f7-block>
        </f7-col>
      </f7-row>
    </f7-block>
    <!-- <f7-block class="block-narrow" v-else>
      <f7-block-title class="col wide">{{items.length}} items</f7-block-title>
      <f7-col>
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
            </f7-list-item>
          </ul>
        </f7-list>
      </f7-col>
    </f7-block> -->

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
      locations: [],
      rootLocations: [],
      equipments: {},
      initSearchbar: false,
      selectedItem: null,
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
        this.items = data
        this.locations = this.items.filter((i) => i.metadata && i.metadata.semantics && i.metadata.semantics.value.indexOf('Location_') === 0)
        this.equipments = this.items.filter((i) => i.metadata && i.metadata.semantics && i.metadata.semantics.value.indexOf('Equipment_') === 0)
        this.points = this.items.filter((i) => i.metadata && i.metadata.semantics && i.metadata.semantics.value.indexOf('Point_') === 0)
        this.rootLocations = this.locations.filter((i) => !i.metadata.semantics.config || !i.metadata.semantics.config.isPartOf).map((i) => {
          return {
            item: i,
            class: i.metadata.semantics.value,
            children: {
              locations: [],
              equipments: [],
              points: []
            }
          }
        })
        this.rootLocations.forEach((l) => {
          this.getChildren(l)
        })
        this.loading = false
        this.ready = true
      })
    },
    getChildren (parent) {
      parent.children.locations = this.locations
        .filter((i) => i.metadata.semantics.config && i.metadata.semantics.config.isPartOf === parent.item.name)
        .map((i) => {
          return {
            item: i,
            class: i.metadata.semantics.value,
            children: {
              locations: [],
              equipments: [],
              points: []
            }
          }
        })
      parent.children.locations.forEach((l) => {
        this.getChildren(l)
      })
      parent.children.equipments = this.equipments
        .filter((i) => i.metadata.semantics.config && i.metadata.semantics.config.hasLocation === parent.item.name)
        .map((i) => {
          return {
            item: i,
            class: i.metadata.semantics.value,
            children: {
              locations: [],
              equipments: [],
              points: []
            }
          }
        })
    },
    selectItem (item) {
      this.selectedItem = item
      console.log('selected ' + item.item.name)
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
    }
  },
  asyncComputed: {
    iconUrl () {
      return icon => this.$oh.media.getIcon(icon)
    }
  }
}
</script>
