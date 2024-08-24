<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <span class="demonstration">选择时间</span>
      <el-date-picker
        v-model="listQuery.day"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        clearable
        type="date"
        :picker-options="pickerOptions"
        placeholder="选择日期"
      />

      <el-button v-permission="['GET /admin/chatroom/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border style="width: 100%" highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="开始" prop="start" />
      <el-table-column align="center" min-width="100px" label="结束" prop="end" />
      <el-table-column align="center" min-width="200px" label="计划主持人人数" prop="numClasses" />
      <el-table-column align="center" min-width="200px" label="已经报名人数" prop="numClaimed" />

      <el-table-column align="center" min-width="100px" label="报酬等级" prop="paylevel">
        <template slot-scope="scope">
          <span>{{ scope.row['paylevel'] }}</span>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

 <style>
  .red span{
    border:1px solid red;
    border-radius:50%;
  }
  .el-table-add-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
}</style>

<script>
import { getScheduleForDay, getUnfinishedDateInMonth } from '@/api/chatroom'

import moment from 'moment'

export default {
  name: 'Schedule',
  data() {
    return {
      sel: null, // 选中行
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        day: undefined
      },
      curYear: 0,
      curMonth: 0,
      curUnfinishedDays: [],
      paylevelDic: ['基本', '一级', '二级'],
      rules: {
      },
      pickerOptions: {
        // 限制日期只能选择给定的日期
        disabledDate: function(time) {
          return false
        },
        // 修改给定日期的样式
        cellClassName: (time) => {
          return this.getCellClassName(time)
        }
      },
      downloadLoading: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    getCellClassName: function(time) {
      const tdate = moment(time)
      const dayOfMonth = tdate.date()
      console.log('tdate dayOfMonth = ' + dayOfMonth + ' ' + (typeof dayOfMonth))
      console.log(' ' + this.curMonth + ':' + tdate.month() + ':' + this.curUnfinishedDays)
      if (this.curYear !== tdate.year() || this.curMonth !== tdate.month()) {
        return ''
      }
      console.log(typeof this.curUnfinishedDays[0])
      if (this.curUnfinishedDays.indexOf(dayOfMonth) >= 0) {
        console.log('red')
        return 'red'
      }
      return ''
    },
    getUnfinished(day) {
      if (!day) { return }
      const tdate = moment(day)
      if (this.curYear === tdate.year() && this.curMonth === tdate.month()) { return }
      getUnfinishedDateInMonth({ 'day': tdate.format('YYYY-MM-DD') }).then(response => {
        this.curUnfinishedDays = response.data.data.list
        this.curYear = tdate.year()
        this.curMonth = tdate.month() // month() start with 0
        this.$forceUpdate()
      }).catch(() => {
        this.curUnfinishedDays = []
        console.log('getUnfinished return error')
      })
    },
    getList() {
      if (!this.listQuery.day) {
        this.getUnfinished(new Date())
        return
      }
      this.listLoading = true
      getScheduleForDay(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
        this.list.map(i => {
          i.isSet = false// 给后台返回数据添加`isSet`标识
          return i
        })
        this.getUnfinished(this.listQuery.day)
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>
