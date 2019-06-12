<template>
  <f7-page @page:afterin="onPageAfterIn">
    <f7-navbar title="Link Channel to Item" back-link="Cancel">
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Link</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block class="block-narrow">
      <!-- Option to create new item (if not supplied by prop) -->
      <f7-col v-if="!item">
        <f7-list media-list>
          <f7-list-item radio :checked="createItem === false" value="false" @change="createItem = false" title="Use an existing Item" name="item-creation-choice" />
          <f7-list-item radio :checked="createItem === true" value="true" @change="createItem = true" title="Create a new Item" name="item-creation-choice" />
        </f7-list>
      </f7-col>

      <!-- Choose item to link -->
      <f7-col v-if="createItem === false && !item">
        <f7-block-title>Link to an existing Item</f7-block-title>
        <f7-list>
          <item-picker title="Item to Link" name="item" :value="item" :multiple="false" :filterType="channel.itemType"></item-picker>
        </f7-list>
      </f7-col>

      <!-- Create new item -->
      <f7-col v-else-if="createItem === true && !item">
        <f7-block-title>New Item</f7-block-title>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input label="Name" type="text" placeholder="Name" :value="newItem.name">
          </f7-list-input>
          <f7-list-input label="Label" type="text" placeholder="Name" :value="newItem.label"
                         @input="item.label = $event.target.value" clear-button>
          </f7-list-input>
          <f7-list-input label="Category" input-id="input-category" autocomplete="off" type="text" placeholder="Name" :value="newItem.category"
                         @input="newItem.category = $event.target.value" clear-button>
            <div class="padding" slot="root-end">
              <oh-icon :icon="newItem.category" height="32" width="32" />
            </div>
          </f7-list-input>
          <f7-list-item v-if="newItem.type" title="Type" type="text" placeholder="Name" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
            <select name="select-type" @change="newItem.type = $event.target.value">
              <option v-for="type in types.ItemTypes" :key="type" :value="type" :selected="type === newItem.type">{{type}}</option>
            </select>
          </f7-list-item>
        </f7-list>
      </f7-col>

      <!-- Item to link supplied as prop -->
      <f7-col v-else-if="item">
        <f7-block-title>Item</f7-block-title>
        <f7-list media-list>
          <ul>
            <item :item="item" />
          </ul>
        </f7-list>
        <f7-block-title>Thing</f7-block-title>
        <f7-list inline-labels no-hairlines-md>
          <thing-picker title="Thing" name="thing" :value="selectedThingId" @input="(e) => selectedThingId = e" />
        </f7-list>
        <div v-if="selectedThing.UID && selectedThingType.UID">
          <f7-block-title>Channel</f7-block-title>
            <channel-list :thing="selectedThing" :thingType="selectedThingType"
              :picker-mode="true" :item-type-filter="item.type"
              @selected="(channel) => loadProfileTypes(channel)" />
        </div>
      </f7-col>

      <f7-block v-if="!itemTypeCompatible()" class="text-color-red">
        The channel and the item type are not compatible.
      </f7-block>

      <f7-block v-if="!ready" class="text-align-center">
        <f7-preloader></f7-preloader>
        <div>Loading...</div>
      </f7-block>

      <!-- Profile configuration -->
      <f7-col v-else-if="profileTypes.length">
        <f7-block-title>Profile</f7-block-title>
        <f7-block-footer class="padding-left padding-right">
          Profiles define how Channels and Items work together. Install transformation add-ons to get additional profiles.
          <f7-link external color="blue" target="_blank" href="https://www.openhab.org/docs/configuration/items.html#profiles">Learn more about profiles.</f7-link>
        </f7-block-footer>
        <!-- <f7-block v-if="!ready" class="text-align-center">
          <f7-preloader></f7-preloader>
          <div>Loading...</div>
        </f7-block> -->
        <f7-list>
          <f7-list-item radio :checked="!currentProfileType" value="" @change="onProfileTypeChange()" title="No Profile (Default)" name="profile-type" />
          <f7-list-item radio v-for="profileType in profileTypes"
            :value="profileType.uid"
            @change="onProfileTypeChange(profileType.uid)"
            :key="profileType.uid" :title="profileType.label" name="profile-type"></f7-list-item>
        </f7-list>
      </f7-col>
      <f7-col v-if="profileTypeConfiguration != null">
        <f7-block-title>Profile Configuration</f7-block-title>
          <config-sheet
            :parameter-groups="profileTypeConfiguration.parameterGroups"
            :parameters="profileTypeConfiguration.parameters"
            :configuration="link.configuration"
          />
      </f7-col>
    </f7-block>
  </f7-page>
</template>

<script>
import ConfigSheet from '@/components/config/config-sheet.vue'
import ItemPicker from '@/components/config/controls/item-picker.vue'
import ThingPicker from '@/components/config/controls/thing-picker.vue'
import ChannelList from '@/components/thing/channel-list.vue'

import Item from '@/components/item/item.vue'

import { Categories } from '@/assets/categories.js'
import * as Types from '@/assets/item-types.js'
import * as SemanticClasses from '@/assets/semantics.js'

export default {
  components: {
    ConfigSheet,
    ItemPicker,
    ThingPicker,
    Item,
    ChannelList
  },
  props: ['thing', 'channel', 'channelType', 'item'],
  data () {
    return {
      ready: true,
      createItem: false,
      link: {
        itemName: null,
        channelUID: null,
        configuration: {}
      },
      selectedItem: null,
      selectedThingId: '',
      selectedThing: {},
      selectedThingType: {},
      selectedChannel: null,
      profileTypes: [],
      currentProfileType: null,
      profileTypeConfiguration: null,
      newItem: {},
      types: Types,
      semanticClasses: SemanticClasses
    }
  },
  methods: {
    onPageAfterIn (event) {
      if (!this.channel) return
      this.loadProfileTypes(this.channel)
    },
    loadProfileTypes (channel) {
      this.ready = false
      this.selectedChannel = channel
      const getProfileTypes = this.$oh.api.get('/rest/profile-types?channelTypeUID=' + channel.channelTypeUID)
      getProfileTypes.then((data) => {
        this.profileTypes = data
        this.ready = true
      })
    },
    onProfileTypeChange (profileTypeUid) {
      if (!profileTypeUid) {
        this.profileTypeConfiguration = null
        this.currentProfileType = null
        return
      }
      this.currentProfileType = this.profileTypes.find((p) => p.uid === profileTypeUid)
      const getProfileConfigDescription = this.$oh.api.get('/rest/config-descriptions/profile:' + profileTypeUid)
      getProfileConfigDescription.then((data) => {
        this.profileTypeConfiguration = data
      }).catch((err) => {
        // just clear out the config sheet
        console.log(`No configuration for profile type ${profileTypeUid}: ` + err)
        this.profileTypeConfiguration = null
      })
    },
    itemTypeCompatible () {
      // TODO move to testable .js file
      let item = this.item
      if (!item) item = (this.createItem) ? this.newItem : this.selectedItem
      if (!item) return true
      if (!item.type) return true
      if (!this.selectedChannel) return true
      if (!this.selectedChannel.itemType) return false

      const channelItemType = this.selectedChannel.itemType
      if (channelItemType === this.item.type) return true

      // Exceptions
      if (item.type.indexOf('Number') === 0 && channelItemType.indexOf('Number') === 0) return true
      if (channelItemType === 'Color' && (item.type === 'Dimmer' || item.type === 'Switch')) return true
      if (channelItemType === 'Dimmer' && item.type === 'Switch') return true

      return false
    },
    save () {
      if (!this.itemTypeCompatible()) {
        this.$f7.dialog.alert('The channel and item type are not compatible')
        return
      }
    }
  },
  watch: {
    selectedThingId () {
      this.selectedThing = {}
      this.selectedThingType = {}
      this.profileTypes = []
      this.currentProfileType = null
      this.profileTypeConfiguration = null
      this.ready = false
      if (!this.selectedThingId) return
      this.$oh.api.get('/rest/things/' + this.selectedThingId).then((data) => {
        this.selectedThing = data

        this.$oh.api.get('/rest/thing-types/' + this.selectedThing.thingTypeUID).then(data2 => {
          this.selectedThingType = data2
          this.ready = true
        })
      })
    }
  }
}
</script>
