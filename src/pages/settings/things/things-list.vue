<template>
  <f7-page>
    <f7-navbar title="Things" back-link="Back">
      <!-- <f7-nav-right>
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
        search-container=".contacts-list"
        search-in=".item-title"
        remove-diacritics
      ></f7-searchbar> -->
      <f7-subnavbar :inner="false" v-show="initSearchbar">
        <f7-searchbar
          v-if="initSearchbar"
          class="searchbar-items"
          :init="initSearchbar"
          search-container=".contacts-list"
          search-in=".item-title"
          remove-diacritics
        ></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>

    <f7-list-index
      ref="listIndex"
      list-el=".things-list"
      :scroll-list="true"
      :label="true"
    ></f7-list-index>

    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-block-title>{{things.length}} things</f7-block-title>
        <!-- <f7-list class="search-list searchbar-found" media-list>
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
        </f7-list> -->
        <f7-list v-if="loading" contacts-list class="col things-list">
          <f7-list-group>
            <f7-list-item
              media-item
              v-for="n in 10"
              :key="n"
              :class="`skeleton-text skeleton-effect-blink`"
              title="Label of the thing"
              subtitle="This contains the thing UID"
              after="status badge"
            >
            </f7-list-item>
          </f7-list-group>
        </f7-list>
        <f7-list v-else class="searchbar-found col" contacts-list>
          <f7-list-group v-for="(thingsWithInitial, initial) in indexedThings" :key="initial">
            <f7-list-item v-if="thingsWithInitial.length" :title="initial" group-title></f7-list-item>
            <f7-list-item v-for="thing in thingsWithInitial"
              :key="thing.UID"
              media-item
              :link="thing.UID"
              :title="thing.label"
              :subtitle="thing.UID"
              :badge="thing.statusInfo.status"
              :badge-color="thing.statusInfo.status === 'ONLINE' ? 'green' : 'red'"
            >
            </f7-list-item>
          </f7-list-group>
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
    <f7-fab position="right-bottom" slot="fixed" color="blue" href="add">
      <f7-icon ios="f7:add" md="material:add" aurora="f7:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close" aurora="f7:close"></f7-icon>
      <!-- <f7-fab-buttons position="top">
        <f7-fab-button label="Scan and add to Inbox">S</f7-fab-button>
        <f7-fab-button label="Add thing manually">M</f7-fab-button>
      </f7-fab-buttons> -->
    </f7-fab>
  </f7-page>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      initSearchbar: false,
      things: [],
      indexedThings: {}
    }
  },
  created () {
    // this.$f7.preloader.show()
    this.loading = true
    this.$oh.api.get('/rest/things').then((data) => {
      this.things = data.sort((a, b) => a.label.localeCompare(b.label))
      this.indexedThings = this.things.reduce((prev, thing, i, items) => {
        const initial = thing.label.substring(0, 1).toUpperCase()
        if (!prev[initial]) {
          prev[initial] = []
        }
        prev[initial].push(thing)

        return prev
      }, {})
      this.initSearchbar = true
      this.loading = false
      setTimeout(() => { this.$refs.listIndex.update() })
      // this.$f7.preloader.hide()
    })
  },
  methods: {}
}
</script>

<style>
</style>
