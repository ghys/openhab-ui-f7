<template>
  <f7-block v-if="thingType" class="channel-list">
    <f7-block>
      <f7-row>
        <f7-col class="padding-left">
          <f7-searchbar
            :disable-button="false"
            inline
            disable-link-text="Cancel"
            placeholder="Search channels"
            search-container=".channel-group"
            search-in=".item-title"
            search-group=".channel-group .row"
            :clear-button="true"
          ></f7-searchbar>
        </f7-col>
      </f7-row>
    </f7-block>
    <div style="text-align:right" class="padding-right" v-if="hasAdvanced">
      Show advanced <f7-checkbox :value="showAdvanced" @change="toggleAdvanced"></f7-checkbox>
    </div>
    <f7-col v-if="thingType.channelGroups.length">
      <f7-block width="100" class="channel-group">
        <f7-row v-for="group in thingType.channelGroups" :key="group.id">
          <f7-col>
            <!-- <f7-block-title class="channel-group-title">{{group.label}}</f7-block-title>
            <f7-block-footer class="channel-description param-description" v-if="group.description">
              {{group.description}}
            </f7-block-footer> -->

            <channel-link
              :group="group"
              :channelTypes="displayedChannels(group)"
              :thing="thing"
            />
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-col>
    <f7-col v-else-if="thingType.channels.length">
      <f7-block width="100" class="channel-group">
        <f7-row>
          <f7-col>
            <channel-link
              :channelTypes="displayedChannels()"
              :thing="thing"
            />
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-col>
    <f7-col v-else>
      <f7-block strong>
        <f7-row>
          <f7-col class="padding-left">
            This thing has no channels. Either the thing type doesn't define channels, or they may be detected and appear later.
          </f7-col>
        </f7-row>
      </f7-block>
    </f7-col>
  </f7-block>
</template>

<style lang="stylus">

.channel-list
  margin-left calc(-1*var(--f7-block-padding-horizontal))
  padding-left 0
  padding-right 0
.channel-group
  padding-right 0
  .list
    margin 0
</style>

<script>
import ChannelLink from './channel-link.vue'

export default {
  props: ['thingType', 'thing'],
  components: {
    ChannelLink
  },
  data () {
    return {
      showAdvanced: false
    }
  },
  computed: {
    hasAdvanced () {
      if (this.thingType.channelGroups.length > 0) {
        return this.thingType.channelGroups.some((g) => g.channels.some((c) => c.advanced))
      } else {
        return this.thingType.channels.some((c) => c.advanced)
      }
    },
    displayedChannels () {
      if (!this.thingType) return []
      return (group) => {
        if (!group) return (this.showAdvanced) ? this.thingType.channels : this.thingType.channels.filter((p) => p.advanced === false)
        return (this.showAdvanced) ? group.channels : group.channels.filter((p) => p.advanced === false)
      }
    }
  },
  methods: {
    toggleAdvanced (event) {
      this.showAdvanced = event.target.checked
    }
  }
}
</script>
