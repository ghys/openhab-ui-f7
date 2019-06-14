<template>
  <f7-page>
    <f7-navbar title="Add Thing as Equipment" back-link="Back">
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Add</f7-link>
      </f7-nav-right>
    </f7-navbar>

    <f7-block class="block-narrow">
      <f7-col>
        <f7-block-title v-if="parent">Parent Location or Equipment</f7-block-title>
        <f7-list media-list v-if="parent">
          <ul>
            <item :item="parent.item" />
          </ul>
        </f7-list>
        <f7-block-title>Equipment</f7-block-title>
        <f7-block-footer class="padding-left padding-right">
          Select the Thing you wish to create as an Equipment group in the model. It will be placed under the parent group displayed above, if any.
          You can alter the new group's details and change its equipment class.
        </f7-block-footer>
        <f7-list inline-labels no-hairlines-md>
          <thing-picker title="Thing" name="thing" :value="selectedThingId" @input="(e) => selectedThingId = e" />
        </f7-list>
        <f7-block v-if="!ready" class="text-align-center">
          <f7-preloader></f7-preloader>
          <div>Loading...</div>
        </f7-block>
        <div v-else-if="selectedThing.UID && selectedThingType.UID">
          <quick-new-item-form :new-item="newEquipmentItem" :hide-type="true" />
          <f7-block-title>Channels</f7-block-title>
            <f7-block-footer class="padding-left padding-right">
              Check the channels you wish to create as new Point items. They will be members of the new equipment group defined above.
              You can alter the suggested names and labels as well as the semantic class and related property.<br/><br/>
              The newly created Points will be linked to their respective channels with the default profile
              (you will be able to configure the links later if needed).
            </f7-block-footer>
            <channel-list :thing="selectedThing" :thingType="selectedThingType"
              :multiple-links-mode="true"
              @selected="(channel) => toggleSelect(channel)" />
        </div>
      </f7-col>
    </f7-block>
  </f7-page>
</template>

<script>
import ThingPicker from '@/components/config/controls/thing-picker.vue'
import ChannelList from '@/components/thing/channel-list.vue'
import QuickNewItemForm from '@/components/item/quick-new-item-form.vue'

import Item from '@/components/item/item.vue'

export default {
  components: {
    Item,
    ThingPicker,
    ChannelList,
    QuickNewItemForm
  },
  props: ['parent'],
  data () {
    return {
      ready: true,
      selectedThingId: '',
      selectedThing: {},
      selectedThingType: {},
      newEquipmentItem: {}
    }
  },
  methods: {
    toggleSelect (channel) {

    }
  },
  watch: {
    selectedThingId () {
      this.selectedThing = {}
      this.selectedThingType = {}
      this.ready = false
      if (!this.selectedThingId) return
      this.$oh.api.get('/rest/things/' + this.selectedThingId).then((data) => {
        this.selectedThing = data

        this.$oh.api.get('/rest/thing-types/' + this.selectedThing.thingTypeUID).then(data2 => {
          this.selectedThingType = data2
          this.newEquipmentItem = {
            name: this.selectedThing.label.replace(/[^0-9a-z]/gi, ''),
            label: this.selectedThing.label,
            tags: ['Equipment'],
            type: 'Group',
            groupNames: (this.parent) ? this.parent.item.name : []
          }
          this.ready = true
        })
      })
    }
  }
}
</script>
