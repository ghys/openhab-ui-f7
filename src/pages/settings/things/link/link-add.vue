<template>
  <f7-page @page:afterin="onPageAfterIn">
    <f7-navbar title="Link Channel to Item" back-link="Cancel">
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Link</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-list media-list>
          <f7-list-item radio :checked="createItem === false" value="false" @change="createItem = false" title="Use an existing Item" name="item-creation-choice" />
          <f7-list-item radio :checked="createItem === true" value="true" @change="createItem = true" title="Create a new Item" name="item-creation-choice" />
        </f7-list>
      </f7-col>
      <f7-col v-if="createItem === false">
        <f7-block-title>Link to an existing Item</f7-block-title>
        <f7-list>
          <item-picker title="Item to Link" name="item" :value="item" :multiple="false" :filterType="channel.itemType"></item-picker>
        </f7-list>
      </f7-col>
      <f7-col v-else>
        <f7-block-title>New Item</f7-block-title>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input label="Name" type="text" placeholder="Name" :value="item.name">
          </f7-list-input>
          <f7-list-input label="Label" type="text" placeholder="Name" :value="item.label"
                         @input="item.label = $event.target.value" clear-button>
          </f7-list-input>
          <f7-list-input label="Category" input-id="input-category" autocomplete="off" type="text" placeholder="Name" :value="item.category"
                         @input="item.category = $event.target.value" clear-button>
            <div class="padding" slot="root-end">
              <oh-icon :icon="item.category" height="32" width="32" />
            </div>
          </f7-list-input>
          <f7-list-item v-if="item.type" title="Type" type="text" placeholder="Name" smart-select :smart-select-params="{openIn: 'popup', closeOnSelect: true}">
            <select name="select-type" @change="item.type = $event.target.value">
              <option v-for="type in types.ItemTypes" :key="type" :value="type" :selected="type === item.type">{{type}}</option>
            </select>
          </f7-list-item>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-block-title>Profile</f7-block-title>
        <f7-block v-if="!ready" class="text-align-center">
          <f7-preloader></f7-preloader>
          <div>Loading...</div>
        </f7-block>
        <f7-list v-else>
          <f7-list-item radio :checked="!currentProfileType" value="" @change="onProfileTypeChange()" title="No Profile (Default)" name="profile-type" />
          <f7-list-item radio v-for="profileType in profileTypes"
            :value="profileType.uid"
            @change="onProfileTypeChange(profileType.uid)"
            :key="profileType.uid" :title="profileType.label" name="profile-type"></f7-list-item>
        </f7-list>
        <f7-block-footer class="padding-left padding-right">
          Profiles define how Channels and Items work together. Install transformation add-ons to get additional profiles.
          <f7-link external color="blue" target="_blank" href="https://www.openhab.org/docs/configuration/items.html#profiles">Learn more about profiles.</f7-link>
        </f7-block-footer>
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

import { Categories } from '@/assets/categories.js'
import * as Types from '@/assets/item-types.js'
import * as SemanticClasses from '@/assets/semantics.js'

export default {
  components: {
    ConfigSheet,
    ItemPicker
  },
  props: ['thing', 'channel', 'channelType'],
  data () {
    return {
      ready: false,
      createItem: false,
      link: {
        itemName: null,
        channelUID: null,
        configuration: {}
      },
      profileTypes: [],
      currentProfileType: null,
      profileTypeConfiguration: null,
      item: {},
      types: Types,
      semanticClasses: SemanticClasses
    }
  },
  methods: {
    onPageAfterIn (event) {
      const getProfileTypes = this.$oh.api.get('/rest/profile-types?channelTypeUID=' + this.channel.channelTypeUID)
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
      this.currentProfileType = this.profileTypes.find((p) => p.uid === event.target.value)
      const getProfileConfigDescription = this.$oh.api.get('/rest/config-descriptions/profile:' + profileTypeUid)
      getProfileConfigDescription.then((data) => {
        this.profileTypeConfiguration = data
      }).catch((err) => {
        // just clear out the config sheet
        console.log(`No configuration for profile type ${profileTypeUid}: ` + err)
        this.profileTypeConfiguration = null
      })
    }
  }
}
</script>
