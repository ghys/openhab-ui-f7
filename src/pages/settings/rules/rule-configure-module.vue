<template>
  <f7-page @page:afterin="setPreviousPage">
    <f7-navbar title="Edit module" back-link="Cancel" no-shadow no-hairline>
      <f7-nav-right>
        <f7-link @click="save()" v-if="$theme.md" icon-md="material:save" icon-only></f7-link>
        <f7-link @click="save()" v-if="!$theme.md">Done</f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block class="block-narrow">
      <f7-col>
        <f7-list inline-labels no-hairlines-md>
          <f7-list-input type="text" placeholder="Name" :value="rule.name"
                         @input="rule.name = $event.target.value" clear-button>
          </f7-list-input>
          <f7-list-input type="text" placeholder="Description" :value="rule.description"
                         @input="rule.description = $event.target.value" clear-button>
          </f7-list-input>
        </f7-list>
      </f7-col>
      <f7-col>
        <f7-block-title>Module type</f7-block-title>
        <f7-list>
          <f7-list-item radio v-for="moduleType in moduleTypes[currentSection].filter((t) => t.visibility === 'VISIBLE')"
            :value="moduleType.uid"
            @change="currentModuleType = moduleTypes[currentSection].find((m) => m.uid === $event.target.value)"
            :key="moduleType.uid" :title="moduleType.label" name="module-type"></f7-list-item>
        </f7-list>
      </f7-col>
      <f7-col v-if="currentModuleType != null">
        <f7-block-title>Configuration</f7-block-title>
          <config-parameter
            v-for="parameter in currentModuleType.configDescriptions"
            :key="parameter.name"
            :config-description="parameter"
            :value="currentModuleConfig[parameter.name]"
          />
      </f7-col>
    </f7-block>
  </f7-page>
</template>

<script>
import ConfigParameter from '@/components/config/config-parameter.vue'

export default {
  components: {
    ConfigParameter
  },
  props: ['moduleTypes', 'currentSection'],
  data () {
    debugger
    return {
      rule: this.$f7.data.rule,
      currentModuleType: null,
      currentModuleConfig: {}
    }
  },
  methods: {
    setPreviousPage ($ev) {
    },
    save () {
      debugger
      this.$f7.data.currentConfig = this.currentModuleConfig
    }
  }
}
</script>
