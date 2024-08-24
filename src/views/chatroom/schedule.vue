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
        placeholder="选择日期"
      />
      <el-button v-permission="['GET /admin/chatroom/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border style="width: 100%" highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="开始" prop="start" />
      <el-table-column align="center" min-width="100px" label="结束" prop="end" />
      <el-table-column align="center" min-width="200px" label="主持人人数" prop="numClasses">
        <template slot-scope="scope">
          <span v-if="scope.row.isSet">
            <el-input v-model="sel['numClasses']" size="mini" placeholder="请输入内容" />
          </span>
          <span v-else>{{ scope.row['numClasses'] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="200px" label="报酬等级" prop="paylevel">
        <template slot-scope="scope">
          <span v-if="scope.row.isSet">
            <el-select v-model="sel['paylevel']" placeholder="请选择">
              <el-option
                v-for="(item, index) in paylevelDic"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </span>
          <span v-else>{{ scope.row['paylevel'] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,true)">
            {{ scope.row.isSet?'保存':"修改" }}
          </span>

        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

 <style>
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
import { getScheduleForDay, updateScheduleForDay } from '@/api/chatroom'

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
      dataForm: {
        id: undefined,
        start: undefined,
        end: undefined,
        numClasses: undefined,
        paylevel: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      paylevelDic: ['基本', '一级', '二级'],
      rules: {
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      if (!this.listQuery.day) {
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
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 修改
    pwdChange(row, index, cg) {
      // 点击修改 判断是否已经保存所有操作
      const that = this
      for (const i of that.list) {
        if (i.isSet && i.id !== row.id) {
          that.$notify.error({
            title: '失败',
            message: '请先保存当前编辑项'
          })
          return false
        }
      }
      // 是否是取消操作
      if (!cg) {
        // return row.isSet = !row.isSet
        row.isSet = !row.isSet
        return row.isSet
      }
      // 提交数据
      if (row.isSet) {
        // 项目是模拟请求操作  自己修改下
        (function() {
          const data = JSON.parse(JSON.stringify(that.sel))
          that.updateData(data)
          row.isSet = false
        })()
      } else {
        that.sel = JSON.parse(JSON.stringify(row))
        row.isSet = true
      }
    },
    updateData(row) {
      updateScheduleForDay(row).then(() => {
        for (const v of this.list) {
          if (v.id === this.dataForm.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.dataForm)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify.success({
          title: '成功',
          message: '更新成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    }
  }
}
</script>
