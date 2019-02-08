<template>
  <f7-page>
    <f7-navbar title-large="Settings" title="Settings" back-link="Back">
      <f7-nav-right>
        <f7-link
          class="searchbar-enable"
          data-searchbar=".searchbar-demo"
          icon-ios="f7:search_strong"
          icon-md="material:search"
        ></f7-link>
      </f7-nav-right>
      <f7-searchbar
        class="searchbar-demo"
        expandable
        search-container=".search-list"
        search-in=".item-title"
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
    <f7-block class="block-narrow after-big-title">
      <f7-row>
        <f7-col width="100" tablet-width="50">
          <f7-block-title>Configuration &amp; Automation</f7-block-title>
          <f7-list class="search-list">
            <f7-list-item
              color="red"
              link="inbox/"
              title="Inbox"
              badge="1"
              badge-color="red"
              :footer="objectsFooters.inbox"
            ></f7-list-item>
            <f7-list-item
              link="things/"
              title="Things"
              after="24"
              badge-color="blue"
              :footer="objectsFooters.things"
            ></f7-list-item>
            <f7-list-item
              link="items/"
              title="Items"
              after="192"
              badge-color="blue"
              :footer="objectsFooters.items"
            ></f7-list-item>
            <f7-list-item
              link="rules/"
              title="Rules"
              after="3"
              badge-color="blue"
              :footer="objectsFooters.rules"
            ></f7-list-item>
          </f7-list>
          <f7-block-title>Add-ons</f7-block-title>
          <f7-list class="search-list">
            <f7-list-item
              v-for="type in addonTypes"
              :key="type.id"
              :link="'addons/' + type.id"
              :title="type.label"
              :footer="addonsFooters[type.id]"
            ></f7-list-item>
          </f7-list>
        </f7-col>
        <f7-col width="100" tablet-width="50">
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
  data() {
    return {
      addonTypes: {},
      // addonTypes: [
      //   { link: "addons/bindings", title: "Bindings" },
      //   { link: "addons/actions", title: "Actions" },
      //   { link: "addons/persistence", title: "Persistence" },
      //   { link: "addons/io", title: "System Integrations" },
      //   { link: "addons/ui", title: "User Interfaces & Apps" },
      //   { link: "addons/voice", title: "Voice" },
      //   { link: "addons/misc", title: "Miscellaneous" }
      // ],
      systemServices: [],
      otherServices: [],
      objectsFooters: {
        inbox: "Add new things to your system",
        things: "Manage the physical layer, link to items",
        items: "The conceptual model of your home",
        rules: "Automate without programming"
      },
      addonsFooters: {
        binding: "Connect and control hardware and online services",
        action: "Predefined methods for rules and scripts",
        persistence: "Backend connectors to store historical data",
        transformation: "Translate between technical and human-readable values",
        misc: "Integrations to external systems and more",
        ui: "Alternative frontends for user interaction",
        voice:
          "Convert between text and speech, interpret human language queries"
      }
    };
  },
  beforeCreate() {
    fetch("/rest/services").then(resp => {
      const json = resp.json();
      json.then(j => {
        this.systemServices = j.filter(s => s.category === "system");
        this.otherServices = j.filter(s => s.category !== "system");
      });
    });

    // can be done in parallel
    fetch("/rest/extensions/types").then(resp2 => {
      const json2 = resp2.json();
      json2.then(j2 => {
        this.addonTypes = j2;
      });
    });
  }
};
</script>

<style>
</style>
