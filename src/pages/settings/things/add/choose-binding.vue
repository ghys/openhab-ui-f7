<template>
  <f7-page>
    <f7-navbar title="Choose Binding" back-link="Back">
    </f7-navbar>

    <f7-list-index
      ref="listIndex"
      list-el=".binding-list"
      :scroll-list="true"
      :label="true"
    ></f7-list-index>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-list v-if="loading" class="col binding-list">
          <f7-list-group>
            <f7-list-item
              v-for="n in 10"
              :key="n"
              :class="`skeleton-text skeleton-effect-blink`"
              title="Label of the binding"
              subtitle="This contains the description of the binding"
              media-item
            >
            </f7-list-item>
          </f7-list-group>
        </f7-list>
        <f7-list v-else class="col">
          <f7-list-item v-for="binding in bindings"
            :key="binding.id"
            :link="binding.id"
            :title="binding.name"
            :subtitle="binding.description"
            media-item
          >
          </f7-list-item>
        </f7-list>

      </f7-col>
    </f7-block>
    <f7-block v-if="!loading && !bindings.length" class="block-narrow">
      <f7-col>
        <f7-block strong>
          <p>No bindings available.</p>
        </f7-block>
      </f7-col>
    </f7-block>
    <f7-fab position="right-bottom" slot="fixed" color="blue">
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
      bindings: []
    }
  },
  created () {
    // this.$f7.preloader.show()
    this.loading = true
    this.$oh.api.get('/rest/bindings').then((data) => {
      this.bindings = data.sort((a, b) => a.name.localeCompare(b.name))
      this.loading = false
    })
  },
  methods: {}
}
</script>

<style>
</style>
