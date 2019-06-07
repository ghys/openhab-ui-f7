<template>
  <f7-page @page:afterin="onPageAfterIn">
    <f7-navbar title="Inbox" back-link="Back">
      <f7-subnavbar :inner="false" v-show="initSearchbar">
        <f7-searchbar
          v-if="initSearchbar"
          class="searchbar-inbox"
          :init="initSearchbar"
          search-container=".contacts-list"
          search-in=".item-title"
          remove-diacritics
        ></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>

    <f7-list-index
      ref="listIndex"
      list-el=".inbox-list"
      :scroll-list="true"
      :label="true"
    ></f7-list-index>

    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-block-title>{{inbox.length}} entries</f7-block-title>
        <f7-list v-if="!ready" contacts-list class="col inbox-list">
          <f7-list-group>
            <f7-list-item
              media-item
              v-for="n in 10"
              :key="n"
              :class="`skeleton-text skeleton-effect-blink`"
              title="Label of the thing"
              subtitle="This contains the inbox UID"
              footer="binding:thingUID"
            >
            </f7-list-item>
          </f7-list-group>
        </f7-list>
        <f7-list v-else class="searchbar-found col" contacts-list>
          <f7-list-group v-for="(inboxWithInitial, initial) in indexedInbox" :key="initial">
            <f7-list-item v-if="inboxWithInitial.length" :title="initial" group-title></f7-list-item>
            <f7-list-item v-for="entry in inboxWithInitial"
              :key="entry.thingUID"
              :link="true"
              media-item
              @click="openEntryActions(entry)"
              :title="entry.label"
              :subtitle="entry.representationProperty ? entry.properties[entry.representationProperty] : ''"
              :footer="entry.thingTypeUID"
            >
              <!-- <f7-button icon-f7="add_round" color="blue" slot="after"></f7-button>
              <f7-button icon-f7="eye_off" color="blue" slot="after"></f7-button>
              <f7-button icon-f7="trash" color="blue" slot="after"></f7-button> -->
            </f7-list-item>
          </f7-list-group>
        </f7-list>

      </f7-col>
    </f7-block>
    <f7-block v-if="ready && !inbox.length" class="block-narrow">
      <f7-col>
        <f7-block strong>
          <p>Inbox is empty.</p>
        </f7-block>
      </f7-col>
    </f7-block>
    <f7-fab position="right-bottom" slot="fixed" color="blue" href="/settings/things/add">
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
      ready: false,
      loading: false,
      initSearchbar: false,
      inbox: [],
      indexedInbox: {}
    }
  },
  created () {

  },
  methods: {
    onPageAfterIn () {
      // this.$f7.preloader.show()
      this.loading = true
      this.$oh.api.get('/rest/inbox').then((data) => {
        this.inbox = data.sort((a, b) => a.label.localeCompare(b.label))
        this.indexedInbox = this.inbox.reduce((prev, entry, i, inbox) => {
          const initial = entry.label.substring(0, 1).toUpperCase()
          if (!prev[initial]) {
            prev[initial] = []
          }
          prev[initial].push(entry)

          return prev
        }, {})
        this.initSearchbar = true
        this.loading = false
        this.ready = true
        setTimeout(() => { this.$refs.listIndex.update() })
        // this.$f7.preloader.hide()
      })
    },
    openEntryActions (entry) {
      let actions = this.$f7.actions.create({
        convertToPopover: true,
        closeOnEscape: true,
        buttons: [
          [
            {
              text: entry.label,
              label: true
            }
          ],
          [
            {
              text: 'Add as Thing',
              color: 'blue',
              bold: true,
              onClick: () => {
                console.log(`Add ${entry.thingUID} as thing`)
                this.$f7.dialog.prompt(`Thing will create a new Thing ${entry.thingUID} with the following name:`,
                  'Add as Thing',
                  () => {
                    this.$f7.dialog.alert('Not implemented', 'Sorry')
                  },
                  null,
                  entry.label)
              }
            },
            {
              text: 'Ignore',
              color: 'blue',
              onClick: () => {
                console.log(`Ignoe ${entry.thingUID}`)
              }
            }
          ],
          [
            {
              text: 'Remove',
              color: 'red',
              onClick: () => {
                console.log(`Remove ${entry.thingUID}`)
              }
            }
          ]
        ]
      })

      actions.open()
    }
  }
}
</script>

<style>
</style>
