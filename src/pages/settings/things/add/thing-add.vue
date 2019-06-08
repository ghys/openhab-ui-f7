<template>
  <f7-page @page:afterin="onPageAfterIn">
    <f7-navbar :title="(ready) ? 'New ' + thingType.label : 'New Thing'" back-link="Back">
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Add</f7-link>
      </f7-nav-right>
    </f7-navbar>

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

    <f7-block v-if="ready" class="block-narrow">
      <thing-general-settings :thing="thing" :thing-type="thingType" :createMode="true" />
      <config-sheet
        :parameter-groups="thingType.parameterGroups"
        :parameters="thingType.configParameters"
        :configuration="thing.configuration"
      />
    </f7-block>

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
import ConfigSheet from '@/components/config/config-sheet.vue'

import ThingGeneralSettings from '@/components/thing/thing-general-settings.vue'

let copyToast = null

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export default {
  components: {
    ConfigSheet,
    ThingGeneralSettings
  },
  props: ['thingTypeId'],
  data () {
    return {
      ready: false,
      currentTab: 'info',
      thing: {
        UID: '',
        label: '',
        configuration: {},
        channels: [],
        thingTypeUID: this.thingTypeId
      },
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
      this.$oh.api.get('/rest/thing-types/' + this.thingTypeId).then(data => {
        this.thingType = data
        try {
          this.thing.ID = uuidv4().split('-')[0]
          this.thing.UID = this.thingTypeId + ':' + this.thing.ID
        } catch (e) {
          console.log('Cannot generate ID: ' + e)
        }
        this.thing.label = this.thingType.label
        this.ready = true
      })
    },
    copyTextualDefinition () {
      let el = document.getElementById('textual-definition')
      el.select()
      document.execCommand('copy')
      copyToast.open()
    }
  }
  // watch: {
  //   thingId (val) {
  //     this.thing.UID = this.thingTypeUID.UID + ':' + this.thingId
  //   }
  // }
}
</script>
