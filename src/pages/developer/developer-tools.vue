<template>
  <f7-page name="devtools" @page:beforeremove="onPageBeforeRemove">
    <f7-navbar title="Developer Tools" back-link="Back" back-link-url="/" back-link-force></f7-navbar>
    <f7-block-title class="after-big-title">Test SSE connection</f7-block-title>
    <f7-block strong>
      <p>Start a SSE connection to check the different implementations</p>
      <f7-button text="Stream Events" @click="startSSE()" v-if="!sseClient" />
      <f7-button text="Stop Streaming" @click="stopSSE()" v-if="sseClient" />
    </f7-block>
    <f7-list media-list>
      <f7-list-item v-for="event in sseEvents" :key="event.time.getTime()" :title="event.topic" :subtitle="event.payload" :after="event.type">
      </f7-list-item>
    </f7-list>
    <f7-block strong>
      <p>Test an icon fetch to check the different implementations</p>
      <f7-list media-list>
        <f7-list-input
          label="Icon"
          type="text"
          :value="icon"
          @change="icon = $event.target.value"
          placeholder="e.g. lightbulb, qualityofservice-2"
          :info="iconUrl"
          clear-button
        >
          <img :src="iconUrl" width="44" slot="media" />
        </f7-list-input>
      </f7-list>
    </f7-block>
    <f7-block>
      <cron-editor />
    </f7-block>
  </f7-page>
</template>

<script>
import CronEditor from '@/components/config/controls/cronexpression-editor.vue'

export default {
  components: {
    CronEditor
  },
  data () {
    return {
      sseClient: null,
      sseEvents: [],
      icon: 'lightbulb'
    }
  },
  methods: {
    onPageBeforeRemove () {
      if (this.sseClient) this.$oh.sse.close(this.sseClient)
    },
    startSSE () {
      this.sseClient = this.$oh.sse.connect('/rest/events', '', (event) => {
        event.time = new Date()
        this.sseEvents.unshift(...[event])
        this.sseEvents.splice(5)
      })
    },
    stopSSE () {
      this.$oh.sse.close(this.sseClient)
      this.sseClient = null
      this.sseEvents = []
    }
  },
  asyncComputed: {
    iconUrl () {
      return this.$oh.media.getIcon(this.icon)
    }
  }
}
</script>
