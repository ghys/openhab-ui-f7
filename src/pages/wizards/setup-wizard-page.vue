<template>
  <f7-page no-toolbar no-navbar no-swipeback no-swipe-panel login-screen class="setup-wizard" @page:init="pageBeforeIn" @page:beforeout="pageBeforeOut">
         <f7-tabs animated>
            <f7-tab id="intro" tab-active>
              <f7-login-screen-title>
                <img class="intro-logo" src="static/img/openhab-logo.png" style="max-width: 200px">
                <br>Welcome!
              </f7-login-screen-title>
              <f7-list form>
                <f7-list-item
                  title="Language"
                  smart-select
                  :smart-select-params="{openIn: 'popup', searchbar: true, closeOnSelect: true}"
                >
                  <select name="language">
                    <option
                      v-for="option in availableLanguages"
                      :key="option.value"
                      :value="option.value"
                    >{{option.label}}</option>
                  </select>
                </f7-list-item>
                <f7-list-item
                  title="Region"
                  smart-select
                  :smart-select-params="{openIn: 'popup', searchbar: true, closeOnSelect: true}"
                >
                  <select name="region">
                    <option
                      v-for="option in availableRegions"
                      :key="option.value"
                      :value="option.value"
                    >{{option.label}}</option>
                  </select>
                </f7-list-item>
                <f7-list-item
                  title="Timezone"
                  smart-select
                  :smart-select-params="{openIn: 'popup', searchbar: true, virtualList: true, closeOnSelect: true, virtualListHeight: ($theme.aurora) ? 32 : undefined }"
                >
                  <select name="timezone">
                    <option
                      v-for="option in availableTimezones"
                      :key="option.value"
                      :value="option.value"
                    >{{option.label}}</option>
                  </select>
                </f7-list-item>
              </f7-list>
              <f7-list>
                <f7-list-button tab-link="#location" tab-link-active color="blue">
                  <big>Next</big>
                  <f7-icon ios="f7:arrow_right" aurora="f7:arrow_right" md="material:arrow_forward"/>
                </f7-list-button>
                <f7-list-button title="Close" color="red" reload-all ignore-cache link="/"></f7-list-button>
              </f7-list>
            </f7-tab>

            <f7-tab id="location">
              <f7-block>
                <f7-link
                  icon-ios="f7:arrow_left"
                  icon-aurora="f7:arrow_left"
                  icon-md="material:arrow_back"
                  tab-link="#intro"
                  color="blue"
                  tab-link-active
                ></f7-link>
                <f7-login-screen-title>Set your location</f7-login-screen-title>
              </f7-block>
              <f7-block
                strong
              >Would you like to give access to your location? It will help determining data dependent on your position (like sunrise/sunset times).
                <br>
                <br>
                <f7-button fill raised @click="getCurrentPosition()">Share location</f7-button>
              </f7-block>
              <f7-list>
                <f7-list-input label="Longitude" type="text" disabled :value="long"></f7-list-input>
                <f7-list-input label="Latitude" type="text" disabled :value="lat"></f7-list-input>
              </f7-list>
              <f7-list>
                <f7-list-button tab-link="#package" tab-link-active color="blue">
                  <big>Next</big>
                  <f7-icon ios="f7:arrow_right" aurora="f7:arrow_right" md="material:arrow_forward"/>
                </f7-list-button>
                <f7-list-button title="Close" color="red" reload-all ignore-cache link="/"></f7-list-button>
              </f7-list>
            </f7-tab>

            <f7-tab id="package">
              <f7-block>
                <f7-link
                  icon-ios="f7:arrow_left"
                  icon-aurora="f7:arrow_left"
                  icon-md="material:arrow_back"
                  tab-link="#location"
                  color="blue"
                  tab-link-active
                ></f7-link>
                <f7-login-screen-title>Choose a startup package</f7-login-screen-title>
              </f7-block>
              <f7-block
                strong
              >openHAB can be pre-configured with one of the following add-on packages as a starting point.</f7-block>
              <f7-list class="search-list searchbar-found">
                <f7-list-item
                  radio
                  checked
                  name="package"
                  value="standard"
                  title="Standard"
                  footer="This is the recommended package for the normal user."
                >
                  <!-- <f7-icon slot="media" icon="demo-list-icon"></f7-icon> -->
                </f7-list-item>
                <f7-list-item
                  radio
                  name="package"
                  value="simple"
                  title="Simple"
                  footer="Fully UI-driven setup and configuration process."
                >
                  <!-- <f7-icon slot="media" icon="demo-list-icon"></f7-icon> -->
                </f7-list-item>
                <f7-list-item
                  radio
                  name="package"
                  value="expert"
                  title="Expert"
                  footer="Specifically meant for power users and textual configuration."
                >
                  <!-- <f7-icon slot="media" icon="demo-list-icon"></f7-icon> -->
                </f7-list-item>
                <f7-list-item
                  radio
                  name="package"
                  value="demo"
                  title="Demo"
                  footer="Installs a complete sample configuration for testing."
                >
                  <!-- <f7-icon slot="media" icon="demo-list-icon"></f7-icon> -->
                </f7-list-item>
              </f7-list>
              <f7-list>
                <f7-list-button tab-link="#finish" tab-link-active color="blue">
                  <big>Next</big>
                  <f7-icon ios="f7:arrow_right" aurora="f7:arrow_right" md="material:arrow_forward"/>
                </f7-list-button>
                <f7-list-button title="Close" color="red" reload-all ignore-cache link="/"></f7-list-button>
              </f7-list>
            </f7-tab>

            <f7-tab id="finish">
              <f7-block>
                <f7-link
                  icon-ios="f7:arrow_left"
                  icon-aurora="f7:arrow_left"
                  icon-md="material:arrow_back"
                  tab-link="#package"
                  color="blue"
                  tab-link-active
                ></f7-link>
                <f7-login-screen-title>Almost done!</f7-login-screen-title>
              </f7-block>
              <f7-block strong>You're all set! Click Finish to configure openHAB with your options.</f7-block>

              <f7-list>
                <f7-list-button @click="configure()" tab-link-active color="blue">
                  <big>Finish</big>
                </f7-list-button>
                <f7-list-button title="Close" color="red" reload-all ignore-cache link="/"></f7-list-button>
              </f7-list>
            </f7-tab>
          </f7-tabs>
        </f7-page>
</template>

<style lang="stylus">
.setup-wizard
  .tabs-animated-wrap
    overflow-y auto !important

.view-master-detail
  .setup-wizard
    .intro-logo
      visibility hidden
      // margin-top 25%
    .tab
      padding-top 10%
</style>

<script>
export default {
  data () {
    return {
      availableLanguages: null,
      availableRegions: null,
      availableTimezones: null,
      lang: 'en',
      region: 'US',
      timezone: 'UTC',
      long: null,
      lat: null
    }
  },
  methods: {
    configure () {
      this.$f7.dialog.alert(
        'Not yet done!',
        'Sorry'
      )
    },
    getCurrentPosition () {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.long = position.coords.longitude
          this.lat = position.coords.latitude
        }, (error) => {
          this.$f7.dialog.alert(
            error.message,
            'Error while retrieving current position'
          )
        })
      } else {
        this.$f7.dialog.alert(
          'Geolocation is not available',
          'Sorry'
        )
      }
    },
    pageBeforeIn () {
      this.$f7.panel.get('left').disableVisibleBreakpoint()
    },
    pageBeforeOut (e, page) {
      this.$f7.panel.get('left').enableVisibleBreakpoint()
    }
  },
  created () {
    this.$oh.api.get('/rest/config-descriptions/system:i18n').then((data) => {
      this.availableLanguages = data.parameters.find(
        p => p.name === 'language'
      ).options
      this.availableRegions = data.parameters.find(
        p => p.name === 'region'
      ).options
      this.availableTimezones = data.parameters.find(
        p => p.name === 'timezone'
      ).options
    })
  }
}
</script>
