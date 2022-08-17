// 임현탁
<template>
  <div class="GrassShow"> 
    <div>
      <section class="calendertop">
        <i class="fas fa-angle-left"  @click="controlMonth('prev')" ></i>
        <div class="calendertoptext">{{year}}.{{month}}</div>
        <i class="fas fa-angle-right" @click="controlMonth('next')"></i>
      </section>
    </div>
    <div v-if="HistoryList.usingDates.length">
    <table>
      <thead>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </thead>
      <tbody>
        <tr v-for="(date, idx) in dates" :key="idx">
        <td v-for="(day, index) in date" :key="index">
          <div v-for="usingdate in HistoryList.usingDates" :key="usingdate.seq">
            <div v-if="usingdate!=year+':'+0+month+':'+day">
              {{day}}
            </div>
            <div v-if="usingdate==year+':'+0+month+':'+day">
              <div class="calendardate">
                {{day}}
              </div>
            </div>
          </div>
        </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="!HistoryList.usingDates.length">
    <table>
      <thead>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </thead>
      <tbody>
        <tr v-for="(date, idx) in dates" :key="idx">
        <td v-for="(day, index) in date" :key="index">
          {{day}}
        </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
    setup(){
    const store = useStore()
    const HistoryList = computed(
      () => store.state.rhtModule.HistoryList
    );
    return{
      HistoryList
    }
  },
  data: function() {
    return {
      days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      dates: [],
      currentYear: 0,
      currentMonth: 0,
      year: 0,
      month: 0,
      currentDate: new Date().getDate(),
      prevDate: [],
      previewDate: [],
    }
  },
  computed: {
    isCurrentDate: function() {
      let status = false;
      if (this.currentYear === 0 && this.currentMonth === 0) {
        status = true;
      } else {
        status =
          this.currentYear === new Date().getFullYear() &&
          this.currentMonth === new Date().getMonth() + 1;
      }
      return status;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init(param) {
      if (param) {
        this.year = param[0];
        this.month = param[1];
        this.calendarDate();
      } else {
        const date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.calendarDate();
      }
    },
    calendarDate() {
      const [
        monthFirstDay,
        monthLastDate,
        prevMonthLastDate
      ] = this.getFirstDayLastDate(this.year, this.month);
      this.dates = this.getDaysOfMonth(
        monthFirstDay,
        monthLastDate,
        prevMonthLastDate
      );
    },
    getFirstDayLastDate(year, month) {
      const firstDay = new Date(year, month - 1, 1).getDay();
      const lastDate = new Date(year, month, 0).getDate();
      let lastMonth = month - 1;
      if (month === 1) {
        lastMonth = 12;
        year -= 1;
      }
      const prevLastDate = new Date(year, lastMonth, 0).getDate();
      return [firstDay, lastDate, prevLastDate];
    },
    getDaysOfMonth(monthFirstDay, monthLastDate, prevMonthLastDate) {
      let day = 1;
      let prevDay = prevMonthLastDate - monthFirstDay + 1;
      let dates = [];
      let daysOfWeek = [];
      while (day <= monthLastDate) {
        if (day === 1) {
          this.getPrevDates(monthFirstDay, daysOfWeek, prevDay);
          this.padDates(daysOfWeek);
        }
        if (daysOfWeek.length === 7) {
          dates.push(daysOfWeek);
          day = daysOfWeek[daysOfWeek.length - 1];
          daysOfWeek = [];
        } else if (
          daysOfWeek.length < 7 &&
          daysOfWeek.indexOf(monthLastDate) > -1
        ) {
          this.padDates(daysOfWeek);
          dates.push(daysOfWeek);
          break;
        }
        day++;
        if (daysOfWeek.length <= 7) {
          daysOfWeek.push(day);
        }
      }
      return dates;
    },
    getPrevDates(monthFirstDay, daysOfWeek, prevDay) {
      for (let j = 0; j < monthFirstDay; j++) {
        daysOfWeek.push(prevDay);
        this.prevDate.push(prevDay);
        prevDay += 1;
      }
    },
    padDates(daysOfWeek) {
      const len = daysOfWeek.length;
      const leftDays = 7 - len;
      if (len >= 0 && len < 7) {
        for (let i = 1; i <= leftDays; i++) {
          daysOfWeek.push(i);
          if (this.previewDate.length < leftDays) this.previewDate.push(i);
        }
      }
    },
    controlMonth(p) {
      if (p === "prev") {
        this.currentMonth = this.month - 1;
        this.currentYear = this.year;
        if (this.month === 1) {
          this.currentMonth = 12;
          this.currentYear = this.year -= 1;
        }
      } else {
        this.currentMonth = this.month + 1;
        this.currentYear = this.year;
        if (this.month === 12) {
          this.currentMonth = 1;
          this.currentYear = this.year += 1;
        }
      }
      const param = [this.currentYear, this.currentMonth];
      this.init(param);
    },
  }
}
</script>

<style>
.GrassShow{
  width:45%;
  height:95%; 
  margin: 0 20px;
  border-radius: 20px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 2.5px 6px #fff;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.calendertop {
  text-align: center;
  display: flex;
  justify-content: space-around;
}
table {
  margin: 0 auto;
  text-align: center;
  border-collapse: collapse;
  width: 80%;
  height: 70%;
  /* border-spacing: 20px 30px; */
}
th {
  border-bottom: 1px solid;
  /* background-color: ; */
  /* vertical-align: top; */
}
 td {
  border-bottom: 1px solid;
  /* padding: 20px;
  font-size: 20px; */
  vertical-align: top;
  text-align: center;
}
.calendardate{
    width:30px;
    height:30px;
    background-color: rgb(153, 172, 230);;
    border-radius: 70%;
    overflow: hidden;
}
.calendertoptext{
  font-size: 20px;
}
</style>