<template>
  <f7-page @page:afterin="onPageAfterIn">
    <f7-navbar :title="thing.label" back-link="Back" no-hairline></f7-navbar>
    <f7-toolbar tabbar position="top">
      <f7-link tab-link="#info" tab-link-active>Info</f7-link>
      <f7-link tab-link="#config">Config</f7-link>
      <f7-link tab-link="#channels">Channels</f7-link>
    </f7-toolbar>

    <f7-tabs>
      <f7-tab id="info" tab-active @tab:show="() => this.currentTab = 'info'">
        <f7-block v-if="ready" class="block-narrow padding-left padding-right" strong>
          <f7-col>Status:
            <f7-chip class="margin-left"
              :text="thing.statusInfo.status"
              :color="thing.statusInfo.status === 'ONLINE' ? 'green' : 'red'"
            >{{thing.statusInfo.status}}</f7-chip>
            <div v-if="thing.statusInfo.statusDetail !== 'NONE' || thing.statusInfo.description">
              <strong
                v-if="thing.statusInfo.statusDetail !== 'NONE'"
              >{{thing.statusInfo.statusDetail}}</strong>
              <br>
              <div v-if="thing.statusInfo.description">{{thing.statusInfo.description}}</div>
            </div>
          </f7-col>
        </f7-block>
        <!-- skeletons for not ready -->
        <f7-block v-else class="block-narrow padding-left padding-right skeleton-text skeleton-effect-blink" strong>
          <f7-col>______:
            <f7-chip class="margin-left" text="________"></f7-chip>
            <div>
              <strong>____ _______</strong>
              <br>
            </div>
          </f7-col>
        </f7-block>

        <f7-block v-if="ready" class="block-narrow padding-left padding-right">
          <f7-col>
            <h3>{{thingType.label}}</h3>
            <div v-html="thingType.description"></div>
          </f7-col>
        </f7-block>
        <!-- skeletons for not ready -->
        <f7-block v-else class="block-narrow padding-left padding-right skeleton-text skeleton-effect-blink">
          <f7-col>
            <h3>____ _______</h3>
            <div>____ ____ ____ _____ ___ __ ____ __ ________ __ ____ ___ ____</div>
          </f7-col>
        </f7-block>

        <f7-block class="block-narrow" v-if="ready && thing.properties">
          <f7-col>
            <f7-block-title v-if="Object.keys(thing.properties).length > 0">Properties</f7-block-title>
            <f7-list>
              <!-- <f7-list-item v-if="Object.keys(thing.properties).length > 0" divider>Properties</f7-list-item> -->
              <f7-list-item
                v-for="(value, key) in thing.properties"
                :key="key"
                :title="key"
                :after="value"
              ></f7-list-item>
            </f7-list>
          </f7-col>
        </f7-block>

        <f7-block class="block-narrow" v-if="ready">
          <f7-col>
            <f7-list>
              <!-- <f7-list-item v-if="Object.keys(thing.properties).length > 0" divider>Properties</f7-list-item> -->
              <f7-list-button color="red" title="Delete this Thing"></f7-list-button>
            </f7-list>
          </f7-col>
        </f7-block>
      </f7-tab>

      <f7-tab id="config" :disabled="!(thing.configuration && thingType.configParameters)" @tab:show="() => this.currentTab = 'config'">
        <f7-block v-if="currentTab === 'config'" class="block-narrow">
          <config-sheet
            :parameter-groups="thingType.parameterGroups"
            :parameters="thingType.configParameters"
            :configuration="thing.configuration"
          />
        </f7-block>
      </f7-tab>

      <f7-tab id="channels" disabled="!thingType.channels" @tab:show="() => this.currentTab = 'channels'">
        <f7-block v-if="currentTab === 'channels'" class="block-narrow">
          <channel-list :thingType="thingType" :thing="thing"
          />
        </f7-block>
      </f7-tab>
    </f7-tabs>

    <f7-fab position="right-bottom" color="blue" slot="fixed" @click="codePopupOpened = true">
      <f7-icon ios="f7:document_text" md="material:assignment" aurora="f7:document_text" ></f7-icon>
      <f7-icon ios="f7:close" md="material:close"></f7-icon>
    </f7-fab>

    <f7-popup tablet-fullscreen :opened="codePopupOpened" @popup:closed="codePopupOpened = false">
      <f7-page>
        <f7-toolbar>
          <div class="left">
            <f7-link @click="copyTextualDefinition">Copy</f7-link>
          </div>
          <div class="right">
            <f7-link popup-close>Close</f7-link>
          </div>
        </f7-toolbar>
        <!-- <pre class="textual-definition" v-html="textualDefinition"></pre> -->
        <textarea class="textual-definition" id="textual-definition" :value="textualDefinition"></textarea>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<style lang="stylus">
code.textual-definition pre {
  overflow-x: auto;
  white-space: normal;
}

pre.textual-definition {
  padding: 5px;
}

textarea.textual-definition {
  position: absolute;
  top: var(--f7-toolbar-height);
  left: 5px;
  right: 5px;
  bottom: 0;
  width: calc(100% - 10px);
  font-family: monospace;
}

.md .code-popup {
  margin-bottom: 0 !important;
}

.ios .code-popup {
  margin-bottom: 44px !important;
}

.code-popup {
  width: 100%;
  position: fixed;
  bottom: 0 !important;
  top: var(--f7-toolbar-height) !important;
  // margin -2px !important
  background-color: white !important;
  border-top: 2px solid #555;

  // z-index 1000 !important
  code {
    max-height: 50% !important;
    overflow-y: auto !important;
  }
}
</style>

<script>
import ChannelList from '@/components/thing/channel-list.vue'
import ConfigSheet from '@/components/config/config-sheet.vue'

let copyToast = null

export default {
  components: {
    ConfigSheet,
    ChannelList
  },
  props: ['thingId'],
  data () {
    return {
      ready: false,
      currentTab: 'info',
      thing: {},
      thingType: {},
      codePopupOpened: false
    }
  },
  created () {
    copyToast = this.$f7.toast.create({
      text: 'Textual definition copied to clipboard',
      closeTimeout: 2000
    })
  },
  computed: {
    textualDefinition () {
      if (!this.thing.UID || !this.thingType.UID) return ''

      let definition = ''

      if (this.thing.bridgeUID) {
        definition +=
          '# Attention: This Thing is provided by a Bridge (' +
          this.thing.bridgeUID +
          ').' +
          '\n# You can also include it within the Bridge block and remove' +
          '\n# the reference between parentheses to the bridge below.\n\n'
      }

      definition += '# Thing definition (put in a .things file):\n\n'

      definition += this.thingType.bridge ? 'Bridge' : 'Thing'
      definition += ' ' + this.thing.UID
      definition += ' ' + JSON.stringify(this.thing.label)
      if (this.thing.location) { definition += ' @ ' + JSON.stringify(this.thing.location) }
      if (this.thing.bridgeUID) definition += ' (' + this.thing.bridgeUID + ')'
      definition += ' [ '
      let parameters = []
      for (let parameter in this.thing.configuration) {
        if (!Array.isArray(this.thing.configuration[parameter])) {
          parameters.push(
            parameter +
              '=' +
              JSON.stringify(this.thing.configuration[parameter])
          )
        }
      }
      definition += parameters.join(', ') + ' ]'

      // TODO: for bridges, handle things related to that bridge

      let itemDefinitions = []
      for (let channel of this.thing.channels) {
        if (!channel.itemType) continue

        let itemDefinition = ''
        itemDefinition += channel.itemType
        itemDefinition +=
          ' ' +
          this.thing.label.replace(/[^0-9a-z]/gi, '') +
          '_' +
          channel.id.replace(/[^0-9a-z]/gi, '')
        itemDefinition += ' "' + channel.label + '"'
        itemDefinition += ' {channel=' + JSON.stringify(channel.uid) + '}'
        itemDefinitions.push(itemDefinition)
      }
      if (itemDefinitions.length) {
        definition += '\n\n\n# Item definitions (put in a .items file):\n\n'
        definition += itemDefinitions.join('\n')
      }

      definition +=
        '\n\n# END ' + this.thing.UID + ' - ' + this.thing.label + '\n\n'

      return definition
    }
  },
  methods: {
    onPageAfterIn () {
      if (this.ready) return
      this.$oh.api.get('/rest/things/' + this.thingId).then(data => {
        this.thing = data

        this.$oh.api.get('/rest/thing-types/' + this.thing.thingTypeUID).then(data2 => {
          this.thingType = data2
          this.ready = true
        })
      })
    },
    copyTextualDefinition () {
      let el = document.getElementById('textual-definition')
      el.select()
      document.execCommand('copy')
      copyToast.open()
    }
  }
}
</script>
