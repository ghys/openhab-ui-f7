<template>
  <f7-page>
    <f7-navbar :title="'Add ' + addonType + ' add-on'" back-link="Back">
      <f7-subnavbar :inner="false">
        <f7-searchbar search-container=".search-list" search-in=".item-title" remove-diacritics></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-block-title
          v-if="addons.length"
        >{{addons.length}} Addon{{addons.length > 1 ? 's' : ''}} available</f7-block-title>
        <f7-list class="search-list searchbar-found">
          <f7-list-item
            v-for="addon in addons"
            :key="addon.id"
            link="#"
            @click="openAddonPopup(addon.id)"
            :footer="addon.version"
            :title="addon.label"
          >
            <!-- <f7-icon slot="media" icon="demo-list-icon"></f7-icon> -->
          </f7-list-item>
        </f7-list>
      </f7-col>
    </f7-block>
    <addon-details-popup
      :addon-id="currentAddonId"
      :opened="addonPopupOpened"
      @closed="addonPopupOpened = false"
    />
  </f7-page>
</template>

<script>
import AddonDetailsPopup from "./addon-details-popup.vue";

export default {
  components: {
    AddonDetailsPopup
  },
  props: ["addonType"],
  data() {
    return {
      addons: [],
      currentAddonId: null,
      addonPopupOpened: false
    };
  },
  created() {
    fetch("/rest/extensions").then(resp => {
      const json = resp.json();
      json.then(j => {
        this.addons = j.filter(
          addon => !addon.installed && addon.type === this.addonType
        );
      });
    });
  },
  methods: {
    openAddonPopup(addonId) {
      this.currentAddonId = addonId;
      this.addonPopupOpened = true;
    }
  }
};
</script>

<style>
</style>
