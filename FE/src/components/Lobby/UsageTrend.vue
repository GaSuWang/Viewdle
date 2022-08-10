<template>
<div class="usageTrend">
  <Pie
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
    class="Piegraph"
    />
</div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import { useStore } from 'vuex';
import { computed } from 'vue';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
  name: 'PieChart',
  components: {
    Pie
  },
  props: {
    chartId: {
      type: String,
      default: 'pie-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
  },
  data() {
    const store = useStore()
    const HistoryList = computed(
      () => store.state.rhtModule.HistoryList
    );
    return {
      chartData: {
        labels: ['이용시간', '영상수'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651'],
            data: [HistoryList.value.userTotalTime, HistoryList.value.userTotalVideo]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },

}
</script>
<style>
.usageTrend{
  width:45%;
  height:95%; 
  margin:0 20px;
  border-radius: 20px;
  box-shadow: 1px 1px 1px 1px gray;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
.Piegraph{
  width:70%;
  height:70%
}
</style>