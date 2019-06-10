<template>
  <f7-page @page:afterin="onPageAfterIn" @click="selectItem(null)">
    <f7-navbar title="Semantic Model" back-link="Back">
      <f7-nav-right>
        <!-- <f7-link icon-md="material:done_all" @click="toggleCheck()"
        :text="(!$theme.md) ? ((showCheckboxes) ? 'Done' : 'Select') : ''"></f7-link> -->
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
    <f7-toolbar v-if="selectedItem != null" bottom class="toolbar-details">
      <f7-link @click="detailsOpened = true">Details</f7-link>
    </f7-toolbar>

    <f7-block v-if="!ready" class="text-align-center">
      <f7-preloader></f7-preloader>
      <div>Loading...</div>
    </f7-block>
    <f7-block v-else class="semantic-tree-wrapper">
      <f7-row>
        <f7-col width="100" desktop-width="50" tablet-width="50">
          <f7-block strong class="semantic-tree" no-gap>
            <f7-treeview>
              <model-treeview-item v-for="location in rootLocations" :key="location.item.name" :model="location"
                @selected="selectItem" :selected="selectedItem">
              </model-treeview-item>
            </f7-treeview>
          </f7-block>
        </f7-col>
        <f7-col v-if="selectedItem" width="100" desktop-width="50" tablet-width="50" class="details-pane">
          <f7-block no-gap>
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

    <f7-fab position="right-bottom" slot="fixed" color="blue">
      <f7-icon ios="f7:add" md="material:add" aurora="f7:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close" aurora="f7:close"></f7-icon>
      <f7-fab-buttons position="top">
        <f7-fab-button label="Add Equipment"><f7-icon ios="f7:bulb" md="material:highlight" aurora="f7:bulb"></f7-icon></f7-fab-button>
        <f7-fab-button label="Add Thing as Equipment">2</f7-fab-button>
        <f7-fab-button v-show="!selectedItem || selectedItem.class.indexOf('Location_') === 0" label="Add Location"><f7-icon ios="f7:placemark" md="material:placemark" aurora="f7:placemark"></f7-icon></f7-fab-button>
      </f7-fab-buttons>
    </f7-fab>

    <f7-sheet tablet-fullscreen :backdrop="false" :close-on-escape="true" :opened="detailsOpened" @sheet:closed="detailsOpened = false">
      <f7-page>
        <f7-toolbar>
          <div class="left">
            <!-- <f7-link @click="copyTextualDefinition">Copy</f7-link> -->
          </div>
          <div class="right">
            <f7-link sheet-close>Close</f7-link>
          </div>
        </f7-toolbar>
        <f7-card v-if="selectedItem">
          <f7-card-header>{{selectedItem.item.label || selectedItem.item.name}}</f7-card-header>
          <f7-card-content>
          </f7-card-content>
        </f7-card>

      </f7-page>
    </f7-sheet>

  </f7-page>
</template>

<style lang="stylus">
.semantic-tree-wrapper
  padding 0
  margin-bottom var(--f7-sheet-height)
  .block
    padding 0
.semantic-tree
  .treeview
    --f7-treeview-item-height 40px
    overflow-x auto
    .treeview-item-label
      font-size 10pt
      white-space nowrap
      overflow-x hidden
    .semantic-class
      font-size 8pt
      color var(--f7-list-item-footer-text-color)

@media (min-width: 768px)
  .toolbar-details
    display none

@media (max-width: 767px)
  .details-pane
    display none
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
      detailsOpened: false
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
      // this.detailsOpened = true
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
