<template>
  <f7-block strong>
    <p>Theme</p>
    <f7-segmented>
      <f7-button round color="blue" raised @click="switchTheme('auto')">Auto</f7-button>
      <f7-button round color="blue" raised @click="switchTheme('md')">MD</f7-button>
      <f7-button round color="blue" raised @click="switchTheme('ios')">iOS</f7-button>
      <f7-button round color="blue" raised @click="switchTheme('aurora')">Aurora</f7-button>
    </f7-segmented>
    <p>Dark mode</p>
    <f7-row>
      <f7-col width="50" class="bg-color-white demo-theme-picker" @click="setThemeDark('light')">
        <f7-checkbox checked disabled v-if="theme === 'light'" />
      </f7-col>
      <f7-col width="50" class="bg-color-black demo-theme-picker" @click="setThemeDark('dark')">
        <f7-checkbox checked disabled v-if="theme === 'dark'" />
      </f7-col>
    </f7-row>
    <p>Switch navigation bars to filled style:</p>
    <f7-row>
      <f7-col width="50" class="demo-bars-picker demo-bars-picker-fill" @click="setBarsStyle('default')">
        <div class="demo-navbar"></div>
        <f7-checkbox checked disabled v-if="barsStyle === 'default'" />
      </f7-col>
      <f7-col width="50" class="demo-bars-picker demo-bars-picker-empty" @click="setBarsStyle('light')">
        <div class="demo-navbar"></div>
        <f7-checkbox checked disabled v-if="barsStyle === 'light'" />
      </f7-col>
    </f7-row>
  </f7-block>
</template>
<script>
export default {
  methods: {
    switchTheme (theme) {
      localStorage.setItem('openhab.ui:theme', theme)
      location.reload()
      // document.location = document.location.origin + document.location.pathname + '?theme=' + theme
    },
    setThemeDark (value) {
      localStorage.setItem('openhab.ui:theme.dark', value)
      location.reload()
    },
    setBarsStyle (value) {
      localStorage.setItem('openhab.ui:theme.bars', value)
      location.reload()
    }
  }
}
</script>
<style>
.demo-theme-picker {
  cursor: pointer;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 5px 20px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  box-sizing: border-box;
  position: relative;
}
.demo-theme-picker .checkbox {
  position: absolute;
  left: 10px;
  bottom: 10px;
}
.demo-color-picker-button {
  margin-bottom: 1em;
  text-transform: capitalize;
}
.demo-bars-picker {
  height: 200px;
  border-radius: 10px;
  box-shadow: 0px 5px 20px rgba(0,0,0,0.1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: var(--f7-page-bg-color);
  border: 1px solid rgba(255,255,255,0.2);
}
.demo-bars-picker .checkbox {
  position: absolute;
  left: 10px;
  bottom: 10px;
}

.demo-bars-picker .demo-navbar {
  position: absolute;
  left: 0;
  width: 100%;
  height: 30px;
  top: 0;
  border-bottom: 1px solid transparent;
}
.demo-bars-picker .demo-navbar:before {
  content: '';
  position: absolute;
  left: 10px;
  width: 20px;
  height: 10px;
  top: 50%;
  margin-top: -5px;
}
.demo-bars-picker .demo-navbar:after {
  content: '';
  position: absolute;
  right: 10px;
  width: 20px;
  height: 10px;
  top: 50%;
  margin-top: -5px;
}
.demo-bars-picker-empty .demo-navbar {
  background: #f7f7f8;
  border-color: rgba(0,0,0,0.1);
}
.theme-dark .demo-bars-picker-empty .demo-navbar {
  background: #1b1b1b;
  border-color: #282829;
}
.demo-bars-picker-empty .demo-navbar:before,
.demo-bars-picker-empty .demo-navbar:after {
  background: var(--f7-theme-color);
}
.demo-bars-picker-fill .demo-navbar {
  background: var(--f7-theme-color);
}
.demo-bars-picker-fill .demo-navbar:before,
.demo-bars-picker-fill .demo-navbar:after {
  background: #fff;
}
</style>