<template>
  <f7-page @page:afterin="onPageAfterIn">
    <f7-navbar :title="item.label || item.name" :subtitle="thing.label" back-link="Cancel">
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Save</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-block-title>Current State</f7-block-title>
        <f7-block strong class="state-block">
          {{item.transformedState || item.state}}
          <f7-button v-show="$theme.md" :href="'/analyzer/?items=' + item.name">Analyze</f7-button>
        </f7-block>
        <f7-list class="analyze-button" v-show="!$theme.md">
          <f7-list-button color="blue" :href="'/analyzer/?items=' + item.name">Analyze</f7-list-button>
        </f7-list>
        <!-- <f7-block strong>
          <f7-block-title>{{channel.label}}</f7-block-title>
          <div>{{channel.uid}}</div>
          <f7-block-footer>{{channel.description}}</f7-block-footer>
        </f7-block> -->
        <f7-block-title>Channel</f7-block-title>
        <f7-list media-list>
          <f7-list-item media-item class="channel-item"
            :title="channel.label"
            :footer="channel.description"
            :subtitle="channel.uid">
          </f7-list-item>
          <f7-list-button color="red" title="Unlink" @click="unlink()"></f7-list-button>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-block-title>Item</f7-block-title>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input label="Name" type="text" placeholder="Name" :value="item.name" disabled>
          </f7-list-input>
          <f7-list-input label="Label" type="text" placeholder="Name" :value="item.label" disabled
                         @input="item.label = $event.target.value">
          </f7-list-input>
          <f7-list-input label="Category" input-id="input-category" autocomplete="off" type="text" placeholder="Name" :value="item.category" disabled
                         @input="item.category = $event.target.value">
            <div class="padding" slot="root-end">
              <oh-icon :icon="item.category" height="32" width="32" />
            </div>
          </f7-list-input>
          <f7-list-input label="Type" type="text" :value="item.type" disabled>
          </f7-list-input>
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
            :checked="profileType.uid === currentProfileType.uid"
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
  props: ['thing', 'channel', 'channelType', 'linkInfo', 'item'],
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
      currentProfileType: { uid: '' },
      profileTypeConfiguration: null,
      types: Types,
      semanticClasses: SemanticClasses
    }
  },
  methods: {
    onPageAfterIn (event) {
      const itemName = this.item.name
      const itemType = this.item.type
      const channelUID = this.channel.uid.replace('#', '%23')
      const getProfileTypes = this.$oh.api.get('/rest/profile-types?channelTypeUID=' + this.channel.channelTypeUID + '&itemType=' + itemType)
      getProfileTypes.then((data) => {
        this.profileTypes = data

        this.$oh.api.get('/rest/links/' + itemName + '/' + channelUID).then((data2) => {
          this.link = data2
          if (this.link.configuration.profile) {
            this.onProfileTypeChange(this.link.configuration.profile)
          }
          this.ready = true
        })
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
    }
  }
}
</script>
