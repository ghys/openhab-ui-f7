<template>
  <f7-page>
    <f7-navbar :title="service.label" back-link="Back">
      <f7-nav-right>
        <f7-link @click="save()" icon-if-ios="f7:download" icon-if-md="material:save" icon-only></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block form v-if="configDescriptions && config" class="service-config block-narrow">
      <f7-col>
        <config-parameter
          v-for="parameter in configDescriptions.parameters"
          :key="parameter.name"
          :config-description="parameter"
          :value="config[parameter.name]"
        />
      </f7-col>
      <!-- <f7-list-input

        :label="parameter.label"
        type="text" />
      <f7-block-footer>
        <div :v-html="parameter.description"></div>
      </f7-block-footer>-->
      <!-- <f7-list-input
          :v-for="param in configDescriptions.parameters"
          :key="param.name"
          :label="param.label"
          :info="param.description"
      type="text" />-->
      <!-- placeholder="Your name"
          required
          validate
      clear-button-->
    </f7-block>
  </f7-page>
</template>

<script>
import ConfigParameter from "../../../components/config-parameter.vue";

export default {
  components: {
    ConfigParameter
  },
  props: ["serviceId"],
  data() {
    return {
      service: {},
      configDescriptions: null,
      config: null
    };
  },
  methods: {
    save() {
      alert("Save not implemented!");
      // this.$f7.dialog.alert('Save not implemented!')
    }
  },
  created() {
    fetch("/rest/services/" + this.serviceId).then(resp => {
      const json = resp.json();
      json.then(j => {
        this.service = j;

        if (this.service.configDescriptionURI) {
          fetch(
            "/rest/config-descriptions/" + this.service.configDescriptionURI
          ).then(resp2 => {
            const json2 = resp2.json();
            json2.then(j2 => {
              this.configDescriptions = j2;

              fetch("/rest/services/" + this.serviceId + "/config").then(
                resp3 => {
                  const json3 = resp3.json();
                  json3.then(j3 => {
                    this.config = j3;
                  });
                }
              );
            });
          });
        }
      });
    });
  }
};
</script>

<style lang="stylus">
.service-config {
  .item-input-info {
    white-space: normal;
  }
}
</style>
