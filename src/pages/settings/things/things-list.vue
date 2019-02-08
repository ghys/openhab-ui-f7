<template>
  <f7-page>
    <f7-navbar title="Things" back-link="Back">
      <f7-nav-right>
        <f7-link
          class="searchbar-enable"
          data-searchbar=".searchbar-things"
          icon-ios="f7:search_strong"
          icon-md="material:search"
        ></f7-link>
      </f7-nav-right>
      <f7-searchbar
        class="searchbar-things"
        expandable
        search-container=".search-list"
        search-in=".item-title"
        remove-diacritics
      ></f7-searchbar>
    </f7-navbar>
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-block-title>{{things.length}} things</f7-block-title>
        <f7-list class="search-list searchbar-found" media-list>
          <f7-list-item
            v-for="thing in things"
            :key="thing.UID"
            media-item
            :link="thing.UID"
            :title="thing.label"
            :subtitle="thing.UID"
            :badge="thing.statusInfo.status"
            :badge-color="thing.statusInfo.status === 'ONLINE' ? 'green' : 'red'"
          ></f7-list-item>
        </f7-list>
      </f7-col>
    </f7-block>
    <!-- <f7-block v-if="!things.length" class="block-narrow">
			<f7-col>
				<f7-block strong>
          <p>No things.</p>
        </f7-block>
			</f7-col>
    </f7-block>-->
    <f7-fab position="right-bottom" slot="fixed" color="blue">
      <f7-icon ios="f7:add" md="material:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close"></f7-icon>
      <f7-fab-buttons position="top">
        <f7-fab-button label="Scan and add to Inbox">S</f7-fab-button>
        <f7-fab-button label="Add thing manually">M</f7-fab-button>
      </f7-fab-buttons>
    </f7-fab>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      things: []
    };
  },
  created() {
    fetch("/rest/things").then(resp => {
      const json = resp.json();
      json.then(j => {
        this.things = j;
        this.initSearchbar = true;
      });
    });
  },
  methods: {}
};
</script>

<style>
</style>
