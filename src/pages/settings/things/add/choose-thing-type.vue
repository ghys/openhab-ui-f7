<template>
  <f7-page>
    <f7-navbar title="Add a new Thing" back-link="Back">
    </f7-navbar>

    <!-- <f7-list-index
      ref="listIndex"
      list-el=".thing-type-list"
      :scroll-list="true"
      :label="true"
    ></f7-list-index> -->
    <f7-block class="block-narrow">
      <f7-col>
        <f7-list v-if="loading" class="col thing-type-list">
          <f7-list-group>
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
          </f7-list-group>
        </f7-list>
        <f7-list v-else class="col">
          <f7-list-item divider title="Discovered Things (not implemented)"></f7-list-item>
          <f7-list-item v-if="scanning" title="Scanning for things...">
            <f7-preloader slot="media"></f7-preloader>
          </f7-list-item>
          <f7-list-item v-if="!scanning && !scanResults.length" title="No discovery results."></f7-list-item>
          <f7-list-item divider title="Add manually"></f7-list-item>
          <f7-list-item v-for="thingType in thingTypes"
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
      loading: false,
      initSearchbar: false,
      thingTypes: [],
      scanning: false,
      scanResults: []
    }
  },
  created () {
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
    })
    // simulate scan
    this.scanning = true
    setTimeout(() => {
      this.scanning = false
    }, 2000)

    // this.$oh.api.post(`/rest/discovery/bindings/${this.bindingId}/scan`).then((data) => {
    //   this.scanning = true
    //   setTimeout(() => {
    //     this.scanning = false
    //   }, data)
    // })
  },
  methods: {}
}
</script>

<style>
</style>
