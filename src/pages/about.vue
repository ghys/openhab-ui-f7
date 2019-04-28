<template>
  <f7-page name="about">
    <f7-navbar title-large="About" title="About" back-link="Back"></f7-navbar>
    <f7-block-title class="after-big-title">About This App</f7-block-title>
    <f7-block strong>
      <p>openHAB Default UI version {{this.$f7.version}}</p>
      <p>Laudantium neque magnam vitae nemo quam commodi, in cum dolore obcaecati laborum, excepturi harum, optio qui, consequuntur? Obcaecati dolor sequi nesciunt culpa quia perspiciatis, reiciendis ex debitis, ut tenetur alias.</p>
    </f7-block>
    <f7-block>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni molestiae laudantium dignissimos est nobis delectus nemo ea alias voluptatum architecto, amet similique, saepe iste consectetur in repellat ut minus quibusdam!</p>
      <p>Molestias et distinctio porro nesciunt ratione similique, magni doloribus, rerum nobis, aliquam quae reiciendis quasi modi. Nam a recusandae, fugiat in ea voluptates fuga eius, velit corrupti reprehenderit dignissimos consequatur!</p>
      <p>Blanditiis, cumque quo adipisci. Molestiae, dolores dolorum quos doloremque ipsa ullam eligendi commodi deserunt doloribus inventore magni? Ea mollitia veniam nostrum nihil, iusto doloribus a at! Ea molestiae ullam delectus!</p>
    </f7-block>

    <f7-block-title class="after-big-title">Appearance Options (local to this device)</f7-block-title>
    <theme-switcher />

    <!-- <f7-button href="/analyzer/?items=MultiSensorSalon_Temperature">Analyzer</f7-button> -->

  </f7-page>
</template>

<script>
import ThemeSwitcher from '../components/theme-switcher.vue'

export default {
  components: {
    ThemeSwitcher
  }
}
</script>
