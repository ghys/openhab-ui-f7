<template>
  <f7-popup class="demo-popup" :opened="opened" @popupClosed="$emit('closed')">
    <f7-page>
      <f7-navbar>
        <f7-nav-left>
          <f7-link icon-if-ios="f7:arrow_left" icon-if-md="material:arrow_back" popup-close></f7-link>
        </f7-nav-left>
        <f7-nav-title>{{addon.label}}</f7-nav-title>
      </f7-navbar>
      <f7-block strong v-if="addon.id">
        <f7-row>
          <f7-col v-if="addon.link">
            <f7-button
              outline
              color="blue"
              :href="addon.link"
              external
              target="_blank"
            >Open documentation</f7-button>
          </f7-col>
          <f7-col>
            <f7-button
              outline
              fill
              color="blue"
              v-if="state === 'UNINSTALLED'"
              @click="install()"
            >Install {{addon.version}}</f7-button>
            <f7-button
              outline
              fill
              color="red"
              v-if="state === 'INSTALLED'"
              @click="uninstall()"
            >Uninstall {{addon.version}}</f7-button>
          </f7-col>
        </f7-row>
      </f7-block>
      <f7-block v-if="bindingInfo.description">
        <p>
          <strong>Author: {{bindingInfo.author}}</strong>
        </p>
        <div v-html="bindingInfo.description"/>
      </f7-block>
      <f7-block v-if="!bindingInfo.description">
        <p>No description available.</p>
      </f7-block>
    </f7-page>
  </f7-popup>
</template>

<script>
export default {
  props: ["addonId", "opened"],
  data() {
    return {
      addon: {},
      bindingInfo: {}
    };
  },
  // created () {
  //   fetch('/rest/extensions/' + this.addonId).then((resp) => {
  //     const json = resp.json()
  //     json.then((j) => {
  //       this.addon = j

  //       if (addon.binding && addon.installed) {
  //         fetch('/rest/bindings').then((resp2) => {
  //           const json2 = resp2.json()
  //           json2.then((j2) => {
  //             this.bindingInfo = j2

  //             // TODO: binding configuration
  //           })
  //         })
  //       }
  //     })
  //   })
  // },
  watch: {
    addonId() {
      if (!this.addonId) {
        this.addon = {};
        this.bindingInfo = {};
        return;
      }
      fetch("/rest/extensions/" + this.addonId).then(resp => {
        const json = resp.json();
        json.then(j => {
          this.addon = j;

          if (this.addon.type === "binding" && this.addon.installed) {
            fetch("/rest/bindings").then(resp2 => {
              const json2 = resp2.json();
              json2.then(j2 => {
                this.bindingInfo =
                  j2.find(b => b.id === this.addonId.replace("binding-", "")) ||
                  {};

                // TODO: binding configuration stuff
              });
            });
          }
        });
      });
    }
  },
  computed: {
    state() {
      // TODO: figure out somehow whether the addon is BEING installed/uninstalled.
      if (!this.addon) return "UNKNOWN";
      return this.addon.installed ? "INSTALLED" : "UNINSTALLED";
    }
  },
  methods: {
    install() {
      this.$f7.dialog.alert(
        "Installing/uninstalling addons not implemented yet!",
        "Sorry"
      );
    },
    uninstall() {
      this.install();
    }
  }
};
</script>
