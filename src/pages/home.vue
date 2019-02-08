<template>
  <f7-page>
    <f7-navbar title-large="Home">
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>Home</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-if-ios="f7:tabs" icon-if-md="material:exit_to_app" panel-open="right"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <!-- <f7-toolbar>
      <f7-link>Left Link</f7-link>
      <f7-link>Right Link</f7-link>
    </f7-toolbar>-->
    <f7-block class="block-narrow after-big-title">
      <f7-col>
        <f7-card
          title="Welcome to openHAB!"
          content="Congratulations, your server is up and running! However, it is not configured yet. Follow the setup wizard to let you guide through the initial configuration. (Note: the wizard could also be started automatically on launch if no package is detected - services/org.openhab.addons > package)."
        >
          <f7-card-footer>
            <f7-link color="blue">No thanks</f7-link>
            <f7-button color="blue" fill raised login-screen-open="#login-screen">Start Setup Wizard</f7-button>
          </f7-card-footer>
        </f7-card>
        <f7-card title="Suggested Tasks">
          <f7-card-content :padding="false">
            <ol>
              <li>
                <f7-link no-link-class color="blue" href="#">Install Bindings &amp; other add-ons</f7-link>
              </li>
              <li>
                <f7-link no-link-class color="blue" href="#">Discover &amp; configure Things</f7-link>
              </li>
              <li>
                <f7-link
                  no-link-class
                  color="blue"
                  href="#"
                >Design your home's conceptual model with Home Builder</f7-link>
              </li>
              <li>
                <f7-link
                  no-link-class
                  color="blue"
                  href="#"
                >Connect to openHAB Cloud for remote access and integration with voice assistants</f7-link>
              </li>
            </ol>
            <!-- <f7-list>
              <f7-list-item link="#">Link 1</f7-list-item>
              <f7-list-item link="#">Link 2</f7-list-item>
              <f7-list-item link="#">Link 3</f7-list-item>
              <f7-list-item link="#">Link 4</f7-list-item>
              <f7-list-item link="#">Link 5</f7-list-item>
            </f7-list>-->
          </f7-card-content>
          <f7-card-footer>
            <f7-link color="blue">Dismiss</f7-link>
          </f7-card-footer>
        </f7-card>
        <f7-block strong>
          <p>What to put here? Recent events and notifications maybe. Or some simple user configurable widgets. Or offer to configure a default sitemap and skip this screen after the initial setup?</p>
        </f7-block>
        <f7-block strong>Theme:
          <f7-segmented>
            <f7-button
              round
              color="blue"
              raised
              :fill="$f7.params.theme === 'auto'"
              @click="switchTheme('auto')"
            >Automatic</f7-button>
            <f7-button
              round
              color="blue"
              raised
              :fill="$f7.params.theme === 'md'"
              @click="switchTheme('md')"
            >Material</f7-button>
            <f7-button
              round
              color="blue"
              raised
              :fill="$f7.params.theme === 'ios'"
              @click="switchTheme('ios')"
            >iOS</f7-button>
          </f7-segmented>
        </f7-block>
        <!-- <f7-block-title>Navigation</f7-block-title>
        <f7-list>
          <f7-list-item link="/about/" title="About"></f7-list-item>
          <f7-list-item link="/form/" title="Form"></f7-list-item>
        </f7-list>
        <f7-block-title>Modals</f7-block-title>
        <f7-block strong>
          <f7-row>
            <f7-col width="50">
              <f7-button fill raised popup-open="#popup">Popup</f7-button>
            </f7-col>
            <f7-col width="50">
              <f7-button fill raised login-screen-open="#login-screen">Login Screen</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
        <f7-block-title>Panels</f7-block-title>
        <f7-block strong>
          <f7-row>
            <f7-col width="50">
              <f7-button fill raised panel-open="left">Left Panel</f7-button>
            </f7-col>
            <f7-col width="50">
              <f7-button fill raised panel-open="right">Right Panel</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>
        <f7-list>
          <f7-list-item link="/dynamic-route/blog/45/post/125/?foo=bar#about" title="Dynamic Route"></f7-list-item>
          <f7-list-item link="/load-something-that-doesnt-exist/" title="Default Route (404)"></f7-list-item>
        </f7-list>-->
      </f7-col>
    </f7-block>
  </f7-page>
</template>
<script>
export default {
  methods: {
    switchTheme(theme) {
      document.location = document.location.origin + "?theme=" + theme;
    }
  }
};
</script>
