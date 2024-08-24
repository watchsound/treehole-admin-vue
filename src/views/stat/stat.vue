<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <el-select v-model="listQuery.typeOne" placeholder="请选择比较"><el-option v-for="(item, index) in statDic" :key="index" :label="item" :value="index" /></el-select>
    <el-select v-model="listQuery.typeTwo" placeholder="请选择比较"><el-option v-for="(item, index) in statDic" :key="index" :label="item" :value="index" /></el-select>

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
import { statByTwoTypes } from '@/api/stat'
import VeLine from 'v-charts/lib/line'

export default {
  components: { VeLine },
  data() {
    return {
      chartData: {},
      chartSettings: {},
      chartExtend: {},
      listQuery: {
        typeOne: undefined,
        typeTwo: undefined,
        start: undefined,
        end: undefined
      },
      statDic: ['聊天群标签', '打开小程序次数', '购买一小时卡', '购买三小时卡', '打开小程序人次',
        '聊天总时间/秒', '新用户', '新购买小时卡用户', '推荐来源的用户', '分享次数'],
      labmap: { '0': '聊天群标签', '1': '打开小程序次数', '2': '购买一小时卡', '3': '购买三小时卡', '4': '打开小程序人次',
        '5': '聊天总时间/秒', '6': '新用户', '7': '新购买小时卡用户', '8': '推荐来源的用户', '9': '分享次数' }

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
      statByTwoTypes(this.listQuery).then(response => {
        this.chartData = response.data.data
        this.chartSettings = {
          labelMap: this.labmap,
          metrics: [this.listQuery.typeOne, this.listQuery.typeTwo],
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
