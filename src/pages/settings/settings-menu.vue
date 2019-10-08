<template>
  <f7-page @page:init="onPageInit" class="page-settings">
    <f7-navbar :large-transparent="false" title-large="Settings" title="Settings" back-link="Back" back-link-url="/home/" back-link-force>
      <f7-nav-right>
        <f7-link
          class="searchbar-enable"
          data-searchbar=".searchbar-demo"
          icon-ios="f7:search_strong"
          icon-aurora="f7:search_strong"
          icon-md="material:search"
        ></f7-link>
      </f7-nav-right>
      <f7-searchbar
        class="searchbar-demo"
        expandable
        search-container=".search-list"
        search-in=".item-title"
        :disable-button="!$theme.aurora"
      ></f7-searchbar>
    </f7-navbar>
    <!-- <f7-block>
      <f7-row tag="p">
        <f7-col tag="span">
          <f7-segmented>
            <f7-button big round outline><big>16</big> Things</f7-button>
            <f7-button big round outline><big>138</big> Items</f7-button>
          </f7-segmented>
        </f7-col>
      </f7-row>
    </f7-block>-->
    <f7-block class="block-narrow after-big-title settings-menu" v-show="addonsLoaded && servicesLoaded">
      <f7-row>
        <f7-col width="100" medium="50">
          <f7-block-title>Configuration &amp; Automation</f7-block-title>
          <f7-list class="search-list">
            <f7-list-item
              color="red"
              link="inbox/"
              title="Inbox"
              :badge="inboxCount"
              badge-color="red"
              :footer="objectsSubtitles.inbox"
            ></f7-list-item>
            <f7-list-item
              link="things/"
              title="Things"
              :after="thingsCount"
              badge-color="blue"
              :footer="objectsSubtitles.things"
            ></f7-list-item>
            <f7-list-item
              link="items/"
              title="Items"
              :after="itemsCount"
              badge-color="blue"
              :footer="objectsSubtitles.items"
            ></f7-list-item>
            <f7-list-item
              link="model/"
              title="Model"
              badge-color="blue"
              :footer="objectsSubtitles.model"
            ></f7-list-item>
            <!-- <f7-list-item
              link="items-virtual/"
              title="Items (virtual)"
              :after="itemsCount"
              badge-color="blue"
              :footer="objectsSubtitles.items"
            ></f7-list-item> -->
            <f7-list-item
              link="rules/"
              title="Rules"
              badge-color="blue"
              :footer="objectsSubtitles.rules"
            ></f7-list-item>
            <f7-list-item
              link="schedule/"
              title="Schedule"
              badge-color="blue"
              :footer="objectsSubtitles.schedule"
            ></f7-list-item>
          </f7-list>
          <f7-block-title>Add-ons</f7-block-title>
          <f7-list class="search-list">
            <f7-list-item
              v-for="type in addonTypes"
              :key="type.id"
              :link="'addons/' + type.id"
              :title="type.label"
              :footer="addonsSubtitles[type.id]"
            ></f7-list-item>
          </f7-list>
        </f7-col>
        <f7-col width="100" medium="50">
          <f7-block-title>System Services</f7-block-title>
          <f7-list class="search-list">
            <f7-list-item
              v-for="service in systemServices"
              :key="service.id"
              :link="'services/' + service.id"
              :title="service.label"
            ></f7-list-item>
          </f7-list>
          <f7-block-title>Other Services</f7-block-title>
          <f7-list class="search-list">
            <f7-list-item
              v-for="service in otherServices"
              :key="service.id"
              :link="'services/' + service.id"
              :title="service.label"
            ></f7-list-item>
          </f7-list>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  data () {
    return {
      addonsLoaded: false,
      servicesLoaded: false,
      addonTypes: {},
      systemServices: [],
      otherServices: [],
      objectsSubtitles: {
        inbox: 'Add new things to your system',
        things: 'Manage the physical layer',
        items: 'Manage the functional layer',
        model: 'The semantic model of your home',
        rules: 'Automate with triggers and actions',
        schedule: 'View upcoming time-based rules'
      },
      addonsSubtitles: {
        binding: 'Connect and control hardware and online services',
        action: 'Predefined methods for rules and scripts',
        persistence: 'Backend connectors to store historical data',
        transformation: 'Translate between technical and human-readable values',
        misc: 'Integrations to external systems and more',
        ui: 'Alternative frontends for user interaction',
        voice: 'Convert between text and speech, interpret human language queries'
      },
      inboxCount: '',
      thingsCount: '',
      itemsCount: ''
    }
  },
  methods: {
    onPageInit () {
      // can be done in parallel!
      this.$oh.api.get('/rest/services').then((data) => {
        this.systemServices = data.filter(s => s.category === 'system')
        this.otherServices = data.filter(s => s.category !== 'system')
        this.servicesLoaded = true
      })
      this.$oh.api.get('/rest/extensions/types').then((data) => {
        this.addonTypes = data
        this.addonsLoaded = true
      })
      this.$oh.api.get('/rest/inbox').then((data) => { this.inboxCount = data.length.toString() })
      this.$oh.api.get('/rest/things').then((data) => { this.thingsCount = data.length.toString() })
      this.$oh.api.get('/rest/items').then((data) => { this.itemsCount = data.length.toString() })
    }
  }
}
</script>

<style lang="stylus">
.device-desktop .settings-menu
  --f7-list-item-footer-line-height 1.3
</style>
