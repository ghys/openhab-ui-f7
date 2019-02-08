<template>
  <f7-page>
    <f7-navbar title="Items" back-link="Back">
      <f7-nav-right>
        <f7-link
          class="searchbar-enable"
          data-searchbar=".searchbar-items"
          icon-ios="f7:search_strong"
          icon-md="material:search"
        ></f7-link>
      </f7-nav-right>
      <f7-searchbar
        v-if="initSearchbar"
        class="searchbar-items"
        :init="initSearchbar"
        expandable
        search-container=".virtual-list"
        search-in=".item-title"
        remove-diacritics
      ></f7-searchbar>
    </f7-navbar>
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
    <f7-block class="block-narrow" v-if="items.length > 0">
      <f7-col>
        <f7-block-title>{{items.length}} items</f7-block-title>
        <f7-list
          class="searchbar-found"
          media-list
          virtual-list
          :virtual-list-params="{ items, searchAll, renderExternal, height: $theme.ios ? 63 : 73}"
        >
          <ul>
            <f7-list-item
              v-for="(item, index) in vlData.items"
              :key="index"
              media-item
              link="#"
              :title="(item.label) ? item.label : item.name"
              :subtitle="(item.label) ? item.name : '-'"
              :after="item.type"
              :style="`top: ${vlData.topPosition}px`"
            ></f7-list-item>
          </ul>
        </f7-list>
      </f7-col>
    </f7-block>
    <!-- <f7-block v-if="!items.length" class="service-config block-narrow">
			<f7-col>
				<f7-block strong>
          <p>No items.</p>
        </f7-block>
			</f7-col>
    </f7-block>-->
    <f7-fab position="right-bottom" slot="fixed" color="blue" href="add">
      <f7-icon ios="f7:add" md="material:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close"></f7-icon>
    </f7-fab>
  </f7-page>
</template>

<script>
export default {
  data() {
    return {
      items: [], // [{ label: 'Staircase', name: 'Staircase'}],
      initSearchbar: false,
      vlData: {
        items: []
      }
    };
  },
  created() {
    fetch("/rest/items").then(resp => {
      const json = resp.json();
      json.then(j => {
        this.items = j;
        setTimeout(() => {
          this.initSearchbar = true;
        }, 0);
      });
    });
  },
  methods: {
    searchAll(query, items) {
      const found = [];
      for (let i = 0; i < items.length; i += 1) {
        var haystack = items[i].name;
        if (items[i].label) haystack += " " + items[i].label;
        if (
          haystack.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          query.trim() === ""
        )
          found.push(i);
      }
      return found; // return array with mathced indexes
    },
    renderExternal(vl, vlData) {
      this.vlData = vlData;
    }
  }
};
</script>

<style>
</style>
