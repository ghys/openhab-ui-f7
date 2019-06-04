<template>
  <f7-page>
    <f7-navbar :title="`${rule.uid ? 'Edit' : 'Create'} rule`" back-link="Cancel" no-shadow no-hairline>
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Save</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block class="block-narrow">
      <f7-col>
        <div class="padding-left">Note: Mockup only!</div>
      </f7-col>
      <f7-col>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input type="text" placeholder="Name" :value="rule.name">
          </f7-list-input>
          <f7-list-input type="text" placeholder="Description" :value="rule.description"
                         @input="rule.description = $event.target.value" clear-button>
          </f7-list-input>
        </f7-list>
      </f7-col>
      <div class="padding" style="text-align: right">
        <f7-link sortable-toggle=".sortable">Toggle Reorder</f7-link>
      </div>
      <f7-col>
        <f7-block-title>When</f7-block-title>
        <f7-list sortable>
          <f7-list-item title="Trigger 1"></f7-list-item>
          <f7-list-item title="Trigger 2"></f7-list-item>
        </f7-list>
        <f7-list>
          <f7-list-button color="blue" title="Add Trigger" @click="addModule('triggers')"></f7-list-button>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-block-title>Then</f7-block-title>
        <f7-list sortable>
          <f7-list-item title="Action 1"></f7-list-item>
          <f7-list-item title="Action 2"></f7-list-item>
          <f7-list-item title="Action 3"></f7-list-item>
        </f7-list>
        <f7-list>
          <f7-list-button color="blue" title="Add Action" @click="addModule('actions')"></f7-list-button>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-block-title>But only if</f7-block-title>
        <f7-list>
          <f7-list-button color="blue" title="Add Condition" @click="addModule('conditions')"></f7-list-button>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-list>
          <f7-list-button color="blue" title="Disable this Rule"></f7-list-button>
        </f7-list>
        <f7-list>
          <f7-list-button color="blue" title="Run this Rule Now"></f7-list-button>
        </f7-list>
        <f7-list>
          <f7-list-button color="red" title="Delete this Rule"></f7-list-button>
        </f7-list>
      </f7-col>
    </f7-block>
    <f7-popup class="demo-popup" :opened="moduleConfigOpened" @popupClosed="moduleConfigOpened = false">
      <f7-page>
        <f7-navbar>
          <f7-nav-left>
            <f7-link icon-ios="f7:arrow_left" icon-md="material:arrow_back" icon-aurora="f7:arrow_left" popup-close></f7-link>
          </f7-nav-left>
          <f7-nav-title>Edit module</f7-nav-title>
        </f7-navbar>
        <f7-block>
          <f7-block-title>Module type</f7-block-title>
          <f7-list>
            <f7-list-item radio v-for="moduleType in moduleTypes[currentSection].filter((t) => t.visibility === 'VISIBLE')"
              :value="moduleType.uid"
              @change="currentModuleType = moduleTypes[currentSection].find((m) => m.uid === $event.target.value)"
              :key="moduleType.uid" :title="moduleType.label" name="module-type"></f7-list-item>
          </f7-list>
        </f7-block>
        <f7-block v-if="currentModuleType != null">
          <f7-block-title>Configuration</f7-block-title>
            <config-parameter
              v-for="parameter in currentModuleType.configDescriptions"
              :key="parameter.name"
              :config-description="parameter"
              :value="currentModuleConfig[parameter.name]"
            />
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script>
import ConfigParameter from '@/components/config/config-parameter.vue'
import RuleConfigureModulePage from './rule-configure-module.vue'

export default {
  components: {
    ConfigParameter
  },
  data () {
    return {
      ready: false,
      rule: { name: 'Sample' },
      moduleTypes: {
        actions: [],
        conditions: [],
        triggers: []
      },
      moduleConfigOpened: false,
      currentSection: 'actions',
      currentModuleType: null,
      currentModuleConfig: {}
    }
  },
  created () {
    const load1 = this.$oh.api.get('/rest/module-types?type=action')
    const load2 = this.$oh.api.get('/rest/module-types?type=condition')
    const load3 = this.$oh.api.get('/rest/module-types?type=trigger')
    load1.then((data) => {
      this.moduleTypes.actions = data
    })
    load2.then((data) => {
      this.moduleTypes.conditions = data
    })
    load3.then((data) => {
      this.moduleTypes.triggers = data
    })
    Promise.all([load1, load2, load3]).then(() => {
      this.ready = true
    })
  },
  methods: {
    addModule (section) {
      this.currentSection = section
      const f7 = this.$f7
      f7.data.rule = this.rule
      this.$f7router.navigate({
        url: 'confmodule',
        route: {
          component: RuleConfigureModulePage,
          path: 'confmodule',
          props: {
            rule: this.rule,
            currentSection: this.currentSection,
            moduleTypes: this.moduleTypes
          },
          on: {
            pageAfterOut (e, page) {
              console.log(f7)
              debugger
            }
          }
        }
      }, {
        props: {
          rule: this.rule,
          currentSection: this.currentSection,
          moduleTypes: this.moduleTypes
        }
      })
      // this.$f7router.navigate('/settings/rules/module', {
      //   props: {
      //     rule: this.rule,
      //     currentSection: this.currentSection,
      //     moduleTypes: this.moduleTypes
      //   },
      //   on: {
      //     pageAfterOut (e, page) {
      //       debugger
      //     }
      //   }
      // })
    }
  }
}
</script>
