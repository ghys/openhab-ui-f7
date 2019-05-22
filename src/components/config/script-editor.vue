<template>
  <codemirror v-model="code" ref="cm" class="code-editor-fit" :options="cmOptions"></codemirror>
</template>

<style lang="stylus">
.code-editor-fit
  position absolute
  left 0
  top var(--f7-navbar-height)
  height calc(100% - var(--f7-navbar-height))
  width 100%
  display flex
  background white
  align-items center
  justify-content center
  .CodeMirror
    height 100%
</style>

<script>
// require component
import { codemirror } from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'

// language js
import 'codemirror/mode/javascript/javascript.js'
// theme css
// import 'codemirror/theme/base16-dark.css'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'

export default {
  components: {
    codemirror
  },
  props: ['code'],
  data () {
    return {
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/javascript',
        // theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        viewportMargin: Infinity
      }
    }
  },
  methods: {
    onCmReady (cm) {
      console.log('the editor is readied!', cm)
    },
    onCmFocus (cm) {
      console.log('the editor is focus!', cm)
    },
    onCmCodeChange (newCode) {
      console.log('this is new code', newCode)
      this.code = newCode
    }
  },
  computed: {
    codemirror () {
      return this.$refs.cm.codemirror
    }
  },
  mounted () {
    console.log('codemirror ready: ', this.codemirror)
  }
}
</script>
