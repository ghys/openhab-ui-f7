<template>
  <f7-page @page:afterin="onPageAfterIn" @page:beforeout="onPageBeforeOut" @click="selectItem(null)">
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
      <f7-link class="left details-link" @click="detailsOpened = true">Details</f7-link>
      <f7-link class="right" @click="selectedItem = null">Clear</f7-link>
    </f7-toolbar>

    <f7-block v-if="!ready" class="text-align-center">
      <f7-preloader></f7-preloader>
      <div>Loading...</div>
    </f7-block>
    <f7-block v-else class="semantic-tree-wrapper" :class="{ 'sheet-opened' : detailsOpened }">
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
            <model-details-pane :model="selectedItem" :links="links" />
          </f7-block>
        </f7-col>
      </f7-row>
    </f7-block>

    <f7-fab position="right-bottom" slot="fixed" color="blue" v-if="!selectedItem || selectedItem.class.indexOf('Point_') < 0">
      <f7-icon ios="f7:add" md="material:add" aurora="f7:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close" aurora="f7:close"></f7-icon>
      <f7-fab-buttons position="top">
        <f7-fab-button label="Add Equipment"><f7-icon ios="f7:bulb" md="material:highlight" aurora="f7:bulb"></f7-icon></f7-fab-button>
        <f7-fab-button label="Add Thing as Equipment" @click="addThingAsEquipment"><f7-icon ios="f7:layers_fill" md="material:layers" aurora="f7:layers_fill"></f7-icon></f7-fab-button>
        <f7-fab-button v-show="!selectedItem || selectedItem.class.indexOf('Location_') === 0" label="Add Location"><f7-icon ios="f7:placemark" md="material:place" aurora="f7:placemark"></f7-icon></f7-fab-button>
      </f7-fab-buttons>
    </f7-fab>

    <f7-sheet class="model-details-sheet" :backdrop="false" :close-on-escape="true" :opened="detailsOpened" @sheet:closed="detailsOpened = false">
      <f7-page v-if="selectedItem">
        <f7-toolbar>
          <div class="left">
            <!-- <f7-link @click="copyTextualDefinition">Copy</f7-link> -->
          </div>
          <div class="right">
            <f7-link sheet-close>Close</f7-link>
          </div>
        </f7-toolbar>
        <f7-block style="margin-bottom: 6rem">
          <model-details-pane :model="selectedItem" :links="links" />
        </f7-block>
      </f7-page>
    </f7-sheet>

  </f7-page>
</template>

<style lang="stylus">
.semantic-tree-wrapper
  padding 0
  margin-bottom 0
  .block
    padding 0
.semantic-tree
  .treeview
    --f7-treeview-item-height 40px
    .treeview-item-label
      font-size 10pt
      white-space nowrap
      overflow-x hidden
    .semantic-class
      font-size 8pt
      color var(--f7-list-item-footer-text-color)
.model-details-sheet
  z-index 10900

@media (min-width: 768px)
  .semantic-tree-wrapper
    height calc(100% - var(--f7-navbar-height))
    .row
      height 100%
      .col-100
        height 100%
        overflow auto
        .semantic-tree
          min-height 100%
          margin 0
          height auto
      .details-pane
        padding-top 0
        .block
          margin-top 0
  .toolbar-details
    .details-link
      visibility hidden !important

@media (max-width: 767px)
  .details-pane
    display none
  .semantic-tree-wrapper.sheet-opened
    margin-bottom var(--f7-sheet-height)
  .details-sheet
    height calc(1.4*var(--f7-sheet-height))
</style>

<script>
import ModelDetailsPane from '@/components/model/details-pane.vue'
import AddThingAsEquipment from './add-thing-as-equipment.vue'

export default {
  components: {
    ModelDetailsPane
  },
  data () {
    return {
      ready: false,
      loading: false,
      items: [],
      links: [],
      locations: [],
      rootLocations: [],
      equipments: {},
      initSearchbar: false,
      selectedItem: null,
      detailsOpened: false,
      eventSource: null
    }
  },
  created () {

  },
  methods: {
    onPageAfterIn () {
      this.load()
    },
    onPageBeforeOut () {
      this.detailsOpened = false
    },
    load () {
      // if (this.ready) return
      this.loading = true
      const items = this.$oh.api.get('/rest/items?metadata=semantics')
      const links = this.$oh.api.get('/rest/links')
      Promise.all([items, links]).then((data) => {
        this.items = data[0]
        this.links = data[1]
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
        if (!this.eventSource) this.startEventSource()
      })
    },
    startEventSource () {
      this.eventSource = this.$oh.sse.connect('/rest/events?topics=smarthome/items/*/added,smarthome/items/*/updated,smarthome/items/*/removed', null, (event) => {
        console.log(event)
        const topicParts = event.topic.split('/')
        switch (topicParts[3]) {
          case 'added':
          case 'removed':
          case 'updated':
            // this.ready = false
            this.load()
            break
        }
      })
    },
    stopEventSource () {
      this.$oh.sse.close(this.eventSource)
      this.eventSource = null
    },
    getChildren (parent) {
      if (parent.class.indexOf('Location_') === 0) {
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
        parent.children.equipments.forEach((e) => {
          this.getChildren(e)
        })

        parent.children.points = this.points
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
      } else {
        parent.children.equipments = this.equipments
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
        parent.children.equipments.forEach((e) => {
          this.getChildren(e)
        })

        parent.children.points = this.points
          .filter((i) => i.metadata.semantics.config && i.metadata.semantics.config.isPointOf === parent.item.name)
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
      }
    },
    selectItem (item) {
      this.selectedItem = item
      // this.detailsOpened = true
      console.log('selected ' + item.item.name)
    },
    addThingAsEquipment () {
      const self = this
      this.$f7router.navigate({
        url: 'add-thing',
        route: {
          component: AddThingAsEquipment,
          path: 'add-thing',
          props: {
          },
          on: {
            pageAfterOut (event, page) {
              console.log('page closed')
              // const finalChannel = page.app.data.finalChannel
              // if (finalChannel) {
              //   delete page.app.data.finalChannel
              //   self.thing.channels.push(finalChannel)
              //   self.$emit('links-updated')
              // }
            }
          }
        }
      }, {
        props: {
          parent: this.selectedItem
        }
      })
    }
  }
}
</script>
