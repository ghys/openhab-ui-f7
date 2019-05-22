<template>
<f7-app :params="f7params" :class="{ 'theme-dark': this.themeOptions.dark == 'dark', 'theme-filled': this.themeOptions.bars === 'default' }">
  <!-- Status bar overlay for fullscreen mode-->
  <f7-statusbar></f7-statusbar>

  <!-- Left Panel -->
  <f7-panel left :cover="showSidebar" class="sidebar">
    <f7-page>
      <f7-list-item link="/" class="logo" panel-close v-if="themeOptions.dark === 'dark'">
        <img src="../static/img/openhab-logo-white.png" width="100%">
      </f7-list-item>
      <f7-list-item link="/" class="logo" panel-close v-else>
        <img src="../static/img/openhab-logo.png" width="100%">
      </f7-list-item>
      <!-- <f7-block-title>Sitemaps</f7-block-title> -->
      <f7-list>
        <f7-list-item v-for="sitemap in sitemaps" :animate="false" :key="sitemap.name"
                :link="'/sitemap/' + sitemap.name + '/' + sitemap.name"
                :title="sitemap.label" view=".view-main" panel-close>
          <f7-icon slot="media" ios="f7:list" aurora="material:list" md="material:list"></f7-icon>
        </f7-list-item>
      </f7-list>
      <f7-block-title>Administration</f7-block-title>
      <f7-list class="admin-links">
        <f7-list-item link="/settings/" title="Settings" view=".view-main" panel-close>
          <f7-icon slot="media" ios="f7:gears" md="material:settings"></f7-icon>
        </f7-list-item>

        <f7-list-item link="/developer/" title="Developer Tools" panel-close>
          <f7-icon slot="media" ios="f7:fire" aurora="f7:fire" md="material:extension"></f7-icon>
        </f7-list-item>
        <f7-list-item link="/about/" title="Help &amp; About" view=".view-main" panel-close>
          <f7-icon slot="media" ios="f7:help_round" md="material:help"></f7-icon>
        </f7-list-item>
        <f7-list-item v-if="loggedIn" link="/" title="Logout" @click="logout()" panel-close>
          <f7-icon slot="media" ios="f7:exit" md="material:exit_to_app"></f7-icon>
        </f7-list-item>
        <!-- <f7-list-item title="Master-Details" view=".view-main" panel-close>
          <f7-icon slot="media" ios="f7:exit" md="material:exit_to_app"></f7-icon>
        </f7-list-item> -->
      </f7-list>
    </f7-page>
  </f7-panel>

  <!-- Right Panel -->
  <f7-panel right reveal theme-dark>
    <panel-right />
    <!-- <f7-view url="/panel-right/"></f7-view> -->
  </f7-panel>

  <!-- Your main view, should have "view-main" class -->
  <f7-view main class="safe-areas" url="/" :master-detail-breakpoint="960"></f7-view>

  <!-- Popup -->
  <f7-popup id="my-popup">
    <f7-view>
      <f7-page>
        <f7-navbar title="Popup">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block>
          <p>Popup content goes here.</p>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-popup>

  <f7-login-screen id="my-login-screen" :opened="loginScreenOpened">
    <f7-view>
      <f7-page login-screen>
        <f7-login-screen-title><img width="200px" src="static/img/openhab-logo.png"><br>Login</f7-login-screen-title>
        <f7-list form>
          <f7-list-input
            type="text"
            name="serverUrl"
            placeholder="openHAB server URL"
            :value="serverUrl"
            @input="serverUrl = $event.target.value"
          ></f7-list-input>
          <f7-list-input
            type="text"
            name="username"
            placeholder="Username (optional)"
            :value="username"
            @input="username = $event.target.value"
          ></f7-list-input>
          <f7-list-input
            type="password"
            name="password"
            placeholder="Password (optional)"
            :value="password"
            @input="password = $event.target.value"
          ></f7-list-input>
        </f7-list>
        <f7-list>
          <f7-list-button title="Sign In" @click="login"></f7-list-button>
          <f7-block-footer>
            Some text about login information.
          </f7-block-footer>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-login-screen>
</f7-app>
</template>

<style lang="stylus" scoped>
.panel-left
  .page
    background #f5f5f5 !important
  .logo
    list-style none
    padding 3rem 2rem
    background-color #fff
    height 50px
  .list
    margin-top 0
.theme-dark
  .panel-left
    .page
      background #232323 !important
  .logo
    background #111111 !important
</style>

<script>
import cordovaApp from '../js/cordova-app.js'
import routes from '../js/routes.js'
import PanelRight from '../pages/panel-right.vue'

export default {
  components: {
    PanelRight
  },
  data () {
    return {
      // Framework7 Parameters
      f7params: {
        id: 'org.openhab.ui', // App bundle ID
        name: 'openHAB', // App name
        theme: localStorage.getItem('openhab.ui:theme') || 'auto',
        // theme: (document.documentURI && document.documentURI.indexOf('?theme=ios') > 0) ? 'ios'
        //   : (document.documentURI && document.documentURI.indexOf('?theme=md') > 0) ? 'md'
        //     : 'auto', // Automatic theme detection
        autoDarkTheme: true,
        // App root data
        data: function () {
          return {
          }
        },

        // App routes
        routes: routes,
        view: {
          pushState: true // !this.$device.cordova
        },
        // Enable panel left visibility breakpoint
        panel: {
          leftBreakpoint: 960
        },

        // Register service worker
        serviceWorker: (this.$device.cordova || location.hostname === 'localhost') ? {} : {
          path: '/service-worker.js'
        },
        // Input settings
        input: {
          scrollIntoViewOnFocus: !!this.$device.cordova,
          scrollIntoViewCentered: !!this.$device.cordova
        },
        card: {
          swipeToClose: true
        },
        // Cordova Statusbar settings
        statusbar: {
          overlay: (this.$device.cordova && this.$device.ios) || 'auto',
          iosOverlaysWebView: true,
          androidOverlaysWebView: false
        }
      },

      // Login screen data
      serverUrl: '',
      username: '',
      password: '',

      sitemaps: null,
      showSidebar: true,
      loginScreenOpened: false,
      loggedIn: false,

      themeOptions: {
        dark: false,
        filled: true
      }
    }
  },
  methods: {
    loadSitemaps () {
      this.$oh.api.get('/rest/sitemaps').then((data) => {
        this.sitemaps = data
      })
    },
    login () {
      localStorage.setItem('openhab.ui:serverUrl', this.serverUrl)
      localStorage.setItem('openhab.ui:username', this.username)
      localStorage.setItem('openhab.ui:password', this.password)
      this.$oh.api.get('/rest/sitemaps').then((data) => {
        this.sitemaps = data
        this.loginScreenOpened = false
        this.loggedIn = true
      }).catch((err) => {
        localStorage.removeItem('openhab.ui:serverUrl')
        localStorage.removeItem('openhab.ui:username')
        localStorage.removeItem('openhab.ui:password')
        this.$f7.dialog.alert('Cannot login, please try again: ' + err)
      })
    },
    logout () {
      localStorage.removeItem('openhab.ui:serverUrl')
      localStorage.removeItem('openhab.ui:username')
      localStorage.removeItem('openhab.ui:password')
      this.serverUrl = ''
      this.username = ''
      this.password = ''
      this.loginScreenOpened = true
      this.loggedIn = false
    }
  },
  created () {
    this.themeOptions.dark = localStorage.getItem('openhab.ui:theme.dark') || 'light'
    this.themeOptions.bars = localStorage.getItem('openhab.ui:theme.bars') || 'default'
    // this.loginScreenOpened = true
  },
  mounted () {
    this.$f7ready((f7) => {
      // Init cordova APIs (see cordova-app.js)
      if (f7.device.cordova) {
        cordovaApp.init(f7)

        if (!localStorage.getItem('openhab.ui:serverUrl')) {
          this.loginScreenOpened = true
          return
        }

        this.loggedIn = true
      }

      this.loadSitemaps()
    })
  }
}
</script>
