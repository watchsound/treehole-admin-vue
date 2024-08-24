<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <span class="demonstration">选择开始时间</span>
      <el-date-picker
        v-model="listQuery.start"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        clearable
        type="date"
        placeholder="选择日期"
      />
      <span class="demonstration">选择结束时间</span>
      <el-date-picker
        v-model="listQuery.end"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        clearable
        type="date"
        placeholder="选择日期"
      />
      <el-button v-permission="['GET /admin/stat/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <div class="app-container">
      <ve-line :extend="chartExtend" :data="chartData" :settings="chartSettings" />
    </div>
  </div>
</template>

<script>
import { statUser } from '@/api/stat'
import VeLine from 'v-charts/lib/line'

export default {
  components: { VeLine },
  data() {
    return {
      chartData: {},
      chartSettings: {},
      chartExtend: {},
      listQuery: {
        start: undefined,
        end: undefined
      }
    }
  },
  created() {

  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      statUser(this.listQuery).then(response => {
        this.chartData = response.data.data
        this.chartSettings = {
          labelMap: {
            'users': '用户增长数'
          },
          metrics: ['users'],
          dimension: ['day']
        }
        this.chartExtend = {
          xAxis: { boundaryGap: true },
          series: {
            label: { show: true, position: 'top' }
          }
        }
      })
    }
  }

}
</script>
