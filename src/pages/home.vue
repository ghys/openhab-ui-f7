<template>
  <f7-page v-on:page:afterin="displayCards">
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
        <locations-tab v-if="currentTab === 'locations'" />
      </f7-tab>
      <f7-tab id="tab-equipments" :tab-active="currentTab === 'equipments'" @tab:show="() => this.currentTab = 'equipments'">
        <equipments-tab v-if="currentTab === 'equipments'" />
      </f7-tab>
      <f7-tab id="tab-properties" :tab-active="currentTab === 'properties'" @tab:show="() => this.currentTab = 'properties'">
        <properties-tab v-if="currentTab === 'properties'" />
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>
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
      currentTab: 'overview'
    }
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
