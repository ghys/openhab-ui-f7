<template>
  <f7-page class="other-apps">
    <f7-navbar bg-color="blue" title="Other Apps"></f7-navbar>
    <theme-switcher />
    <f7-block strong>
      <p>Mock list - need an API</p>
    </f7-block>
    <a href="#" external>
      <f7-card class="app-card">
        <f7-card-content :padding="false">
          <img src="static/img/dashboard-tiles-tmp/basicui.png" width="100%">
        </f7-card-content>
        <f7-card-footer>
          <div class="app-card-name">Basic UI</div>
        </f7-card-footer>
      </f7-card>
    </a>

    <a href="#" external>
      <f7-card class="app-card">
        <f7-card-content :padding="false">
          <img src="static/img/dashboard-tiles-tmp/habpanel.png" width="100%">
        </f7-card-content>
        <f7-card-footer>
          <div class="app-card-name">HABPanel</div>
        </f7-card-footer>
      </f7-card>
    </a>

    <a href="#" external>
      <f7-card class="app-card">
        <f7-card-content :padding="false">
          <img src="static/img/dashboard-tiles-tmp/habot.png" width="100%">
        </f7-card-content>
        <f7-card-footer>
          <div class="app-card-name">HABot</div>
        </f7-card-footer>
      </f7-card>
    </a>

    <a href="#" external>
      <f7-card class="app-card">
        <f7-card-content :padding="false">
          <img src="static/img/dashboard-tiles-tmp/rest.png" width="100%">
        </f7-card-content>
        <f7-card-footer>
          <div class="app-card-name">REST Docs</div>
        </f7-card-footer>
      </f7-card>
    </a>

    <!-- <f7-block-title>Load page in panel</f7-block-title>
    <f7-list>
      <f7-list-item link="/about/" title="About"></f7-list-item>
      <f7-list-item link="/form/" title="Form"></f7-list-item>
    </f7-list>
    <f7-block-title>Load page in main view</f7-block-title>
    <f7-list>
      <f7-list-item link="/about/" title="About" view="#main-view" panel-close></f7-list-item>
      <f7-list-item link="/form/" title="Form" view="#main-view" panel-close></f7-list-item>
    </f7-list>-->
  </f7-page>
</template>
<script>
import ThemeSwitcher from '../components/theme-switcher.vue'
export default {
  components: {
    ThemeSwitcher
  }
}
</script>

<style lang="stylus">
.other-apps {
  background-color: #333 !important;
}

.app-card {
  &:hover {
    background-color: rgba(255, 255, 255, 0.12) !important;
  }

  // background-color #333 !important
  .app-card-name {
    width: 100%;
    text-align: center;
  }
}
</style>
