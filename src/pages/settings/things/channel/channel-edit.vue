<template>
  <f7-page @page:afterin="onPageAfterIn">
    <f7-navbar :title="channel.label" :subtitle="thing.label" back-link="Cancel">
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Done</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input type="text" placeholder="Channel Identifier" :value="channel.id"
                         disabled>
          </f7-list-input>
          <f7-list-input type="text" placeholder="Label" :value="channel.label"
                         disabled>
          </f7-list-input>
        </f7-list>
      </f7-col>
      <f7-col v-if="channelType != null">
        <f7-block-title v-if="configDescription.parameters">Configuration</f7-block-title>
          <config-sheet
            :parameter-groups="configDescription.parameterGroups"
            :parameters="configDescription.parameters"
            :configuration="config"
          />
      </f7-col>
    </f7-block>
  </f7-page>
</template>

<script>
import ConfigSheet from '@/components/config/config-sheet.vue'

export default {
  components: {
    ConfigSheet
  },
  props: ['thing', 'thingType', 'channel', 'channelType', 'channelId'],
  data () {
    return {
      ready: false,
      configDescription: {},
      currentChannelType: null,
      config: {}
    }
  },
  methods: {
    onPageAfterIn (event) {
      this.config = Object.assign({}, this.channel.configuration)
      this.$oh.api.get(`/rest/config-descriptions/channel:${this.thing.UID}:${this.channelId.replace('#', '%23')}`).then((ct) => {
        this.configDescription = ct
        this.ready = true
      })
    },
    save () {
      let finalChannel = Object.assign({}, this.channel, {
        configuration: this.config
      })
      this.$f7.data.finalChannel = finalChannel
      this.$f7router.back()
      // this.$emit('channelAddComplete', finalChannel)
      // this.$f7.view.main.emit('complete', finalChannel)
    }
  }
}
</script>
