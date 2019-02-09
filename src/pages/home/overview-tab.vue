<template>
<div>
  <f7-block class="block-narrow">
    <f7-col>
      <f7-card
        v-show="showSetup"
        title="Welcome to openHAB!"
        content="Congratulations, your server is up and running! However, it is not configured yet. Follow the setup wizard and let it guide you through the initial configuration. (Note: the wizard could also be started automatically on launch if no package is detected - services/org.openhab.addons > package)."
      >
        <f7-card-footer>
          <f7-link color="blue" @click="skipSetupWizard()">No thanks</f7-link>
          <!-- <f7-button color="blue" fill raised login-screen-open="#login-screen">Start Setup Wizard</f7-button> -->
          <f7-button color="blue" fill raised href="/setup-wizard/">Start Setup Wizard</f7-button>
        </f7-card-footer>
      </f7-card>
      <f7-card title="Suggested Tasks" v-show="showTasks">
        <f7-card-content :padding="false">
          <ol>
            <li>
              <f7-link no-link-class color="blue" href="#">Install Bindings &amp; other add-ons</f7-link>
            </li>
            <li>
              <f7-link no-link-class color="blue" href="#">Discover &amp; configure Things</f7-link>
            </li>
            <li>
              <f7-link
                no-link-class
                color="blue"
                href="#"
              >Design your home's conceptual model with Home Builder</f7-link>
            </li>
            <li>
              <f7-link
                no-link-class
                color="blue"
                href="#"
              >Connect to openHAB Cloud for remote access and integration with voice assistants</f7-link>
            </li>
          </ol>
        </f7-card-content>
        <f7-card-footer>
          <f7-link color="blue" @click="showTasks = false">Dismiss</f7-link>
        </f7-card-footer>
      </f7-card>

    </f7-col>
  </f7-block>

  <div class="demo-expandable-cards" v-if="showCards">
    <expandable-card color="red" header="temperature" title="Thermostat Upstairs" />
    <expandable-card color="blue" header="temperature" title="Thermostat Downstairs" />
    <expandable-card color="green" header="gauge" />
    <!-- <expandable-card color="teal" header="gauge" /> -->
    <expandable-card color="deeppurple" />
    <!-- <expandable-card color="gray" /> -->
    <expandable-card color="black" header="player" title="SONOS Multiroom" />
    <expandable-card color="blue" header="image" title="Webcam Front Door" />
    <!-- <expandable-card color="orange" />
    <expandable-card color="deeporange" />
    <expandable-card color="pink" />
    <expandable-card color="lightblue" /> -->
  </div>

</div>
</template>

<script>
import ExpandableCard from '../../components/expandable-card.vue'

export default {
  components: {
    ExpandableCard
  },
  data () {
    return {
      showSetup: true,
      showTasks: true,
      showCards: false
    }
  },
  created () {
    this.$oh.api.get('/rest/items').then((data) => {
      this.showCards = true
    })
  },
  methods: {
    skipSetupWizard () {
      const vm = this
      this.$f7.dialog.confirm(
        'Are you sure? You currently only have a minimal set of features available and you will need to install all essential add-ons by hand!',
        'Skip Setup Wizard',
        () => {
          vm.showSetup = false
        }
      )
    },
    dismissTasks () {
      this.showTasks = false
    },
    displayCards () {
      setTimeout(() => { this.showCards = true }, 3000)
    }
  }
}
</script>
