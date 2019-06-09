<template>
  <f7-page v-on:page:afterin="displayCards" class="home-page">
    <f7-navbar>  <!-- title-large="Home"> -->
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>Home</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-ios="f7:tabs" icon-aurora="f7:tabs" icon-md="material:exit_to_app" panel-open="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-toolbar tabbar labels bottom class="home-tabs">
      <f7-link tab-link="#tab-overview" tab-link-active class="tabbar-label" icon-ios="f7:home" icon-aurora="f7:home" icon-md="material:home">Overview</f7-link>
      <f7-link tab-link="#tab-locations" class="tabbar-label" icon-ios="f7:placemark" icon-aurora="f7:placemark" icon-md="material:place">Locations</f7-link>
      <f7-link tab-link="#tab-equipments" class="tabbar-label" icon-ios="f7:bulb" icon-aurora="f7:bulb" icon-md="material:highlight">Equipments</f7-link>
      <f7-link tab-link="#tab-properties" class="tabbar-label" icon-ios="f7:bolt_fill" icon-aurora="f7:bolt_fill" icon-md="material:flash_on">Properties</f7-link>
    </f7-toolbar>

    <f7-tabs>
      <f7-tab id="tab-overview" :tab-active="currentTab === 'overview'" @tab:show="() => this.currentTab = 'overview'">
        <overview-tab v-if="currentTab === 'overview'" />
      </f7-tab>
      <f7-tab id="tab-locations" :tab-active="currentTab === 'locations'" @tab:show="() => this.currentTab = 'locations'">
        <locations-tab v-if="currentTab === 'locations'" :semantic-items="semanticItems" />
      </f7-tab>
      <f7-tab id="tab-equipments" :tab-active="currentTab === 'equipments'" @tab:show="() => this.currentTab = 'equipments'">
        <equipments-tab v-if="currentTab === 'equipments'" :semantic-items="semanticItems" />
      </f7-tab>
      <f7-tab id="tab-properties" :tab-active="currentTab === 'properties'" @tab:show="() => this.currentTab = 'properties'">
        <properties-tab v-if="currentTab === 'properties'" :semantic-items="semanticItems" />
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<style lang="stylus">
.home-page .page-content::-webkit-scrollbar
    width 0
</style>

<script>
import OverviewTab from './home/overview-tab.vue'
import LocationsTab from './home/locations-tab.vue'
import EquipmentsTab from './home/equipments-tab.vue'
import PropertiesTab from './home/properties-tab.vue'

export default {
  components: {
    OverviewTab,
    LocationsTab,
    EquipmentsTab,
    PropertiesTab
  },
  data () {
    return {
      showSetup: true,
      showTasks: true,
      showCards: false,
      currentTab: 'overview',
      semanticItems: {}
    }
  },
  created () {
    this.$oh.api.get('/rest/items?metadata=semantics').then((data) => {
      // get the location items
      this.semanticItems.locations = data.filter((item, index, items) => {
        return item.metadata && item.metadata.semantics &&
          item.metadata.semantics.value.indexOf('Location_') === 0
      }).sort((a, b) => {
        const titleA = a.label || a.name
        const titleB = b.label || b.name
        return titleA.localeCompare(titleB)
      }).map((l) => {
        return {
          item: l,
          properties: data.filter((item, index, items) => {
            return item.metadata && item.metadata.semantics &&
              item.metadata.semantics && item.metadata.semantics.config &&
              item.metadata.semantics.config.relatesTo &&
              item.metadata.semantics.config.hasLocation === l.name
          }),
          equipments: data.filter((item, index, items) => {
            return item.metadata && item.metadata.semantics &&
              item.metadata.semantics && item.metadata.semantics.config &&
              item.metadata.semantics.value.indexOf('Equipment_') === 0 &&
              item.metadata.semantics.config.hasLocation === l.name
          }).map((item) => {
            return {
              item: item,
              points: data.filter((item2, index, items) => {
                return item2.metadata && item2.metadata.semantics &&
                  item2.metadata.semantics && item2.metadata.semantics.config &&
                  item2.metadata.semantics.config.isPointOf === item.name
              })
            }
          })
        }
      })

      // get the equipment items
      this.semanticItems.equipments = data.filter((item, index, items) => {
        return item.metadata && item.metadata.semantics &&
          item.metadata.semantics &&
          item.metadata.semantics.value.indexOf('Equipment_') === 0
      }).reduce((prev, item, i, properties) => {
        const equipmentType = item.metadata.semantics.value.split('_')[1]
        if (!prev[equipmentType]) prev[equipmentType] = []
        const equipmentWithPoints = {
          item: item,
          points: data.filter((item2, index, items) => {
            return item2.metadata && item2.metadata.semantics &&
              item2.metadata.semantics && item2.metadata.semantics.config &&
              item2.metadata.semantics.config.isPointOf === item.name
          })
        }
        prev[equipmentType].push(equipmentWithPoints)
        return prev
      }, {})

      // get the property items
      this.semanticItems.properties = data.filter((item, index, items) => {
        return item.metadata && item.metadata.semantics &&
          item.metadata.semantics && item.metadata.semantics.config &&
          item.metadata.semantics.config.relatesTo
      }).reduce((prev, item, i, properties) => {
        const property = item.metadata.semantics.config.relatesTo.split('_')[1]
        if (!prev[property]) prev[property] = []
        prev[property].push(item)
        return prev
      }, {})
    })
  },
  methods: {
    skipSetupWizard () {
      const vm = this
      this.$f7.dialog.confirm(
        'Are you sure? You currently only have a minimal set of features available and you will need to install all essential add-ons by hand!',
        'Skip Setup Wizard',
        () => {
          vm.showSetup = false
        }
      )
    },
    dismissTasks () {
      this.showTasks = false
    },
    displayCards () {
      setTimeout(() => { this.showCards = true }, 3000)
    }
  }
}
</script>
