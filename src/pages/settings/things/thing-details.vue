<template>
  <f7-page>
    <f7-navbar :title="thing.label" back-link="Back"></f7-navbar>
    <f7-toolbar tabbar position="top">
      <f7-link tab-link="#info" tab-link-active>Info</f7-link>
      <f7-link tab-link="#config" v-if="thingType.configParameters">Config</f7-link>
      <f7-link tab-link="#channels">Channels</f7-link>
    </f7-toolbar>

    <f7-tabs v-if="thing.UID">
      <f7-tab id="info" tab-active>
        <f7-block class="block-narrow padding-left padding-right" strong>
          <f7-col>Status:
            <f7-chip
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
        <f7-block class="block-narrow padding-left padding-right">
          <f7-col>
            <h3>{{thingType.label}}</h3>
            <div v-html="thingType.description"></div>
          </f7-col>
        </f7-block>

        <f7-block class="block-narrow">
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

        <f7-block class="block-narrow">
          <f7-col>
            <f7-list>
              <!-- <f7-list-item v-if="Object.keys(thing.properties).length > 0" divider>Properties</f7-list-item> -->
              <f7-list-button color="red" title="Delete this Thing"></f7-list-button>
            </f7-list>
          </f7-col>
        </f7-block>
      </f7-tab>

      <f7-tab id="config" v-if="thing.configuration && thingType.configParameters">
        <f7-block class="block-narrow">
          <f7-col v-if="!thingType.parameterGroups.length">
            <config-parameter
              v-for="parameter in thingType.configParameters"
              :key="parameter.name"
              :config-description="parameter"
              :value="thing.configuration[parameter.name]"
            />
          </f7-col>
          <f7-col v-if="thingType.parameterGroups.length">
            <f7-list accordion-list>
              <f7-list-item
                accordion-item
                v-for="group in thingType.parameterGroups"
                :key="group.name"
                :title="group.label"
              >
                <f7-accordion-content>
                  <f7-block>
                    <config-parameter
                      v-for="parameter in thingType.configParameters.filter((p) => p.groupName === group.name)"
                      :key="parameter.name"
                      :config-description="parameter"
                      :value="thing.configuration[parameter.name]"
                    />
                  </f7-block>
                </f7-accordion-content>
              </f7-list-item>
            </f7-list>
          </f7-col>
        </f7-block>
      </f7-tab>

      <f7-tab id="channels" v-if="thingType.channels">
        <f7-block class="block-narrow">
          <f7-col v-if="thingType.channels.length">
            <channel-link :channelTypes="thingType.channels" :thing="thing"/>
          </f7-col>
          <f7-col v-if="thingType.channelGroups.length">
            <f7-list accordion-list>
              <f7-list-item
                accordion-item
                v-for="group in thingType.channelGroups"
                :key="group.id"
                :title="group.label"
                :footer="group.description"
              >
                <f7-accordion-content>
                  <channel-link :channelTypes="group.channels" :thing="thing"/>
                </f7-accordion-content>
              </f7-list-item>
            </f7-list>
          </f7-col>
        </f7-block>
      </f7-tab>
    </f7-tabs>

    <f7-fab position="right-bottom" color="blue" slot="fixed" @click="codePopupOpened = true">
      <f7-icon ios="f7:document_text" md="material:assignment" aurora="f7:document_text" ></f7-icon>
      <f7-icon ios="f7:close" md="material:close"></f7-icon>
    </f7-fab>

    <f7-popup tablet-fullscreen :opened="codePopupOpened" @popup:closed="codePopupOpened = false">
      <f7-page>
        <!-- <f7-navbar>
          <f7-nav-left>
            <f7-link icon-if-ios="f7:arrow_left" icon-if-md="material:arrow_back" popup-close></f7-link>
          </f7-nav-left>
          <f7-nav-title>
            Textual Definition
          </f7-nav-title>
        </f7-navbar>-->
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
import ChannelLink from '../../../components/channel-link.vue'
import ConfigParameter from '../../../components/config-parameter.vue'

let copyToast = null

export default {
  components: {
    ConfigParameter,
    ChannelLink
  },
  props: ['thingId'],
  data () {
    return {
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

    this.$oh.api.get('/rest/things/' + this.thingId).then(data => {
      this.thing = data

      this.$oh.api.get('/rest/thing-types/' + this.thing.thingTypeUID).then(data2 => {
        this.thingType = data2
      })
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
    copyTextualDefinition () {
      let el = document.getElementById('textual-definition')
      el.select()
      document.execCommand('copy')
      copyToast.open()
    }
  }
}
</script>
