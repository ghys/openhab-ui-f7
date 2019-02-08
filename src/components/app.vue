<template>
<f7-app :params="f7params">
  <!-- Status bar overlay for fullscreen mode-->
  <f7-statusbar></f7-statusbar>

  <!-- Left Panel -->
  <f7-panel left cover style="background: #fafafa">
    <!-- <f7-view url="/panel-left/"></f7-view> -->
    <f7-list-item link="/" class="logo">
      <img src="../static/img/openhab-logo.png" width="100%">
    </f7-list-item>
    <!-- <f7-list>
      <f7-list-item link="/" title="Home" view=".view-main" panel-close>
        <f7-icon slot="media" ios="f7:home" md="material:home"></f7-icon>
      </f7-list-item>
    </f7-list> -->
    <!-- <f7-block-title>Sitemaps</f7-block-title> -->
    <f7-list>
      <f7-list-item v-for="sitemap in sitemaps" :animate="false" :key="sitemap.name"
              :link="'/sitemap/' + sitemap.name + '/' + sitemap.name"
              :title="sitemap.label" view=".view-main" panel-close>
        <f7-icon slot="media" ios="f7:list" md="material:list"></f7-icon>
      </f7-list-item>
      <!-- <f7-list-item link="/sitemap/_default" title="Default" view="#main-view" panel-close></f7-list-item>
      <f7-list-item link="/sitemap/other" title="Other sitemap" view="#main-view" panel-close></f7-list-item>
      <f7-list-item link="/sitemap/floors" title="By Floor" view="#main-view" panel-close></f7-list-item>
      <f7-list-item link="/sitemap/devices" title="By Device" view="#main-view" panel-close></f7-list-item> -->
    </f7-list>      
    <f7-block-title>Administration</f7-block-title>
    <f7-list>
      <f7-list-item link="/settings/" title="Settings" view=".view-main" panel-close>
        <f7-icon slot="media" ios="f7:gears" md="material:settings"></f7-icon>
      </f7-list-item>

      <f7-list-item link="/about/" title="Help &amp; About" view=".view-main" panel-close>
        <f7-icon slot="media" ios="f7:help_round" md="material:help"></f7-icon>
      </f7-list-item>
    </f7-list>
  </f7-panel>

  <!-- Right Panel -->
  <f7-panel right reveal theme-dark>
    <panel-right />
    <!-- <f7-view url="/panel-right/"></f7-view> -->
  </f7-panel>

  <!-- Your main view, should have "view-main" class -->
  <f7-view main class="safe-areas" url="/"></f7-view>


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


  <setup-wizard />
  <!-- <f7-login-screen id="my-login-screen">
    <f7-view>
      <f7-page login-screen>
        <f7-login-screen-title>Login</f7-login-screen-title>
        <f7-list form>
          <f7-list-input
            type="text"
            name="username"
            placeholder="Your username"
            :value="username"
            @input="username = $event.target.value"
          ></f7-list-input>
          <f7-list-input
            type="password"
            name="password"
            placeholder="Your password"
            :value="password"
            @input="password = $event.target.value"
          ></f7-list-input>
        </f7-list>
        <f7-list>
          <f7-list-button title="Sign In" login-screen-close @click="alertLoginData"></f7-list-button>
          <f7-block-footer>
            Some text about login information.<br>Click "Sign In" to close Login Screen
          </f7-block-footer>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-login-screen> -->
</f7-app>
</template>


<style lang="stylus" scoped>
.panel-left
  .logo
    list-style none
    padding 3rem 2rem
    background-color #fff
    height 50px
  .list
    margin-top 0
</style>

<script>
  import cordovaApp from '../js/cordova-app.js';
  import routes from '../js/routes.js';
  import PanelRight from '../pages/panel-right.vue'
  import SetupWizard from '../pages/wizards/setup-wizard.vue'

  export default {
    components: {
      PanelRight,
      SetupWizard
    },        
    data() {
      return {
        // Framework7 Parameters
        f7params: {
          id: 'org.openhab.ui', // App bundle ID
          name: 'openHAB', // App name
          theme: (document.documentURI && document.documentURI.indexOf('?theme=ios') > 0) ? 'ios' :
                 (document.documentURI && document.documentURI.indexOf('?theme=md') > 0) ? 'md' :
                 'auto', // Automatic theme detection
          // App root data
          data: function () {
            return {
              user: {
                firstName: 'John',
                lastName: 'Doe',
              },

            };
          },

          // App routes
          routes: routes,
          view: {
            pushState: true,
          },
          // Enable panel left visibility breakpoint
          panel: {
            leftBreakpoint: 960,
          },

          // Register service worker
          serviceWorker: this.$device.cordova ? {} : {
            path: '/service-worker.js',
          },
          // Input settings
          input: {
            scrollIntoViewOnFocus: !!this.$device.cordova,
            scrollIntoViewCentered: !!this.$device.cordova,
          },
          // Cordova Statusbar settings
          statusbar: {
            overlay: this.$device.cordova && this.$device.ios || 'auto',
            iosOverlaysWebView: true,
            androidOverlaysWebView: false,
          },
        },

        // Login screen data
        username: '',
        password: '',

        sitemaps: null
      }
    },
    methods: {
      alertLoginData() {
        this.$f7.dialog.alert('Username: ' + this.username + '<br>Password: ' + this.password);
      }
    },
    created () {
      fetch('/rest/sitemaps').then((resp) => {
        const json = resp.json()
        json.then((j) => {
          this.sitemaps = j
        })
      })
    },
    mounted() {
      this.$f7ready((f7) => {
        // Init cordova APIs (see cordova-app.js)
        if (f7.device.cordova) {
          cordovaApp.init(f7);
        }
        // Call F7 APIs here
      });
    }
  }
</script>