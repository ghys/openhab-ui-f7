<template>
  <f7-page @page:afterin="onPageAfterIn" @page:afterout="stopEventSource">
    <f7-navbar title="Schedule" back-link="Settings" back-link-url="/settings/" back-link-force>
      <f7-nav-right>
        <f7-link icon-md="material:done_all" @click="toggleCheck()"
        :text="(!$theme.md) ? ((showCheckboxes) ? 'Done' : 'Select') : ''"></f7-link>
      </f7-nav-right>
      <f7-subnavbar :inner="false" v-show="initSearchbar">
        <f7-searchbar
          v-if="initSearchbar"
          class="searchbar-items"
          :init="initSearchbar"
          search-container=".virtual-list"
          search-in=".item-title, .item-subtitle, .item-footer"
          remove-diacritics
        ></f7-searchbar>
      </f7-subnavbar>
    </f7-navbar>
    <f7-toolbar class="contextual-toolbar" :class="{ 'navbar': $theme.md }" v-if="showCheckboxes" bottom-ios bottom-aurora>
      <f7-link v-show="selectedItems.length" v-if="!$theme.md" class="delete" icon-ios="f7:trash" icon-aurora="f7:trash" @click="removeSelected">Remove {{selectedItems.length}}</f7-link>
      <f7-link v-if="$theme.md" icon-md="material:close" icon-color="white" @click="showCheckboxes = false"></f7-link>
      <div class="title" v-if="$theme.md">
        {{selectedItems.length}} selected
      </div>
      <div class="right" v-if="$theme.md">
        <f7-link icon-md="material:delete" icon-color="white" @click="removeSelected"></f7-link>
        <f7-link icon-md="material:more_vert" icon-color="white" @click="removeSelected"></f7-link>
      </div>
    </f7-toolbar>

    <div class="timeline timeline-horizontal col-33 tablet-15">
      <div class="timeline-year" v-for="(yearObj, year) in calendar" :key="year">
        <div class="timeline-year-title"><span>{{year}}</span></div>
        <div class="timeline-month" v-for="(monthObj, month) in yearObj" :key="month">
          <div class="timeline-month-title"><span>{{month}}</span></div>
          <div class="timeline-item" v-for="(dayObj, day) in monthObj" :key="day">
            <div class="timeline-item-date"><span>{{day}}</span></div>
            <div class="timeline-item-content">
              <div class="timeline-item-time">10:00</div>
              <div class="timeline-item-text">Task 1</div>
              <div class="timeline-item-time">13:00</div>
              <div class="timeline-item-text">Task 2</div>
              <div class="timeline-item-time">8:00</div>
              <div class="timeline-item-text">Task 3</div>
              <div class="timeline-item-text">Task 4</div>
              <div class="timeline-item-time">2:00</div>
              <f7-card>
                <f7-card-content>
                  Hey
                </f7-card-content>
              </f7-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <f7-fab position="right-bottom" slot="fixed" color="blue" href="add">
      <f7-icon ios="f7:add" md="material:add" aurora="f7:add"></f7-icon>
      <f7-icon ios="f7:close" md="material:close" aurora="f7:close"></f7-icon>
    </f7-fab>
  </f7-page>
</template>

<style lang="stylus">
.timeline-item-content
  scrollbar-width none /* Firefox */
  -ms-overflow-style none  /* IE 10+ */
.timeline-item-content::-webkit-scrollbar /* WebKit */
  width 0
  height 0

</style>

<script>
export default {
  data () {
    return {
      ready: false,
      loading: false,
      rules: [],
      calendar: {},
      initSearchbar: false,
      selectedItems: [],
      showCheckboxes: false,
      eventSource: null
    }
  },
  created () {

  },
  methods: {
    onPageAfterIn () {
      this.load()
    },
    load () {
      if (this.loading) return
      this.loading = true
      this.$oh.api.get('/rest/rules').then(data => {
        this.rules = data.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
        this.initSearchbar = true
        this.loading = false
        this.ready = true

        let start = new Date(), limit = new Date()
        limit.setDate(start.getDate() + 31)
        let day = start
        // eslint-disable-next-line no-unmodified-loop-condition
        while (day < limit) {
          const year = day.getFullYear()
          const month = day.toLocaleString('default', { month: 'long' })
          const dayofmonth = day.toLocaleString('default', { weekday: 'short' }) + ' ' + day.getDate()
          const cal = this.calendar
          if (!cal[year]) cal[year] = {}
          if (!cal[year][month]) cal[year][month] = {}
          if (!cal[year][month][dayofmonth]) cal[year][month][dayofmonth] = {}
          day.setDate(day.getDate() + 1)
        }

        if (!this.eventSource) this.startEventSource()
      })
    },
    startEventSource () {
      this.eventSource = this.$oh.sse.connect('/rest/events?topics=smarthome/rules/*/*', null, (event) => {
        console.log(event)
        const topicParts = event.topic.split('/')
        switch (topicParts[3]) {
          case 'added':
          case 'removed':
          case 'updated':
            this.load()
            break
        }
      })
    },
    stopEventSource () {
      this.$oh.sse.close(this.eventSource)
      this.eventSource = null
    },
    toggleCheck () {
      this.showCheckboxes = !this.showCheckboxes
    },
    isChecked (item) {
      return this.selectedItems.indexOf(item) >= 0
    },
    toggleItemCheck (event, item) {
      console.log('toggle check')
      if (this.isChecked(item)) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1)
      } else {
        this.selectedItems.push(item)
      }
    },
    removeSelected () {
      const vm = this

      this.$f7.dialog.confirm(
        `Remove ${this.selectedItems.length} selected rules?`,
        'Remove Rules',
        () => {
          vm.doRemoveSelected()
        }
      )
    },
    doRemoveSelected () {
      let dialog = this.$f7.dialog.progress('Deleting Rules...')

      const promises = this.selectedItems.map((i) => this.$oh.api.delete('/rest/rules/' + i))
      Promise.all(promises).then((data) => {
        this.$f7.toast.create({
          text: 'Rules removed',
          destroyOnClose: true,
          closeTimeout: 2000
        }).open()
        this.selectedItems = []
        dialog.close()
        this.load()
      }).catch((err) => {
        dialog.close()
        this.load()
        console.error(err)
        this.$f7.dialog.alert('An error occurred while deleting: ' + err)
      })
    }
  }
}
</script>
