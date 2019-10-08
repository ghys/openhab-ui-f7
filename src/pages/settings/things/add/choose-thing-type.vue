<template>
  <f7-page @page:afterin="onPageAfterIn" @page:beforein="onPageBeforeIn">
    <f7-navbar title="Add a new Thing" back-link="Back">
      <f7-subnavbar :inner="false" v-show="initSearchbar">
        <f7-searchbar
          v-if="initSearchbar"
          class="searchbar-things"
          :init="initSearchbar"
          search-container=".thing-type-list"
          search-in=".item-title, .item-header, .item-footer"
          remove-diacritics
          :disable-button="!$theme.aurora"
        ></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>

    <!-- <f7-list-index
      ref="listIndex"
      list-el=".thing-type-list"
      :scroll-list="true"
      :label="true"
    ></f7-list-index> -->
    <f7-block class="block-narrow">
      <f7-col>
        <f7-list class="col thing-type-list">
          <f7-list-item divider title="Discovered Things (not implemented)"></f7-list-item>
          <f7-list-item v-if="scanning" title="Scanning for things...">
            <f7-preloader slot="media" :size="42"></f7-preloader>
          </f7-list-item>
          <f7-list-item v-if="!scanning && !scanResults.length"
            title="No discovery results.">
            <f7-button slot="after" @click="scan()">Retry</f7-button>
          </f7-list-item>
          <f7-list-item divider title="Add manually"></f7-list-item>
          <ul v-if="!ready">
          <f7-list-item
            v-for="n in 10"
            :key="n"
            :class="`skeleton-text skeleton-effect-blink`"
            title="Label of the thing type"
            footer="This contains the description of the thing type"
            header="thingTypeUID"
            media-item
          >
          </f7-list-item>
          </ul>
          <f7-list-item v-else v-for="thingType in thingTypes"
            :key="thingType.UID"
            :link="thingType.UID"
            :title="thingType.label"
            :footer="thingType.description"
            :header="thingType.UID"
            :badge="thingType.bridge ? 'Bridge' : ''" badge-color="blue"
            media-item
          >
          </f7-list-item>
        </f7-list>

      </f7-col>
    </f7-block>
    <f7-block v-if="!loading && !thingTypes.length" class="block-narrow">
      <f7-col>
        <f7-block strong>
          <p>No bindings available.</p>
        </f7-block>
      </f7-col>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  props: ['bindingId'],
  data () {
    return {
      ready: false,
      loading: false,
      initSearchbar: false,
      thingTypes: [],
      scanning: false,
      scanResults: []
    }
  },
  created () {

  },
  methods: {
    onPageBeforeIn () {
      this.scan()
    },
    onPageAfterIn () {
      // this.$f7.preloader.show()
      this.loading = true
      this.$oh.api.get('/rest/thing-types').then((data) => {
        this.thingTypes = data.filter((tt) => tt.UID.split(':')[0] === this.bindingId && tt.listed)
          .sort((a, b) => {
            if (a.bridge && !b.bridge) return -1
            if (b.bridge && !a.bridge) return 1
            return a.label.localeCompare(b.label)
          })
        this.loading = false
        this.ready = true
        this.initSearchbar = true
        // this.scan()
      })
    },
    scan () {
      // simulate scan
      this.scanning = true
      setTimeout(() => {
        this.scanning = false
      }, 2000)
    }
  }
}
</script>

<style>
</style>
