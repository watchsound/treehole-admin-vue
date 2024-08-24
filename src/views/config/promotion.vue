/* eslint-disable no-irregular-whitespace */
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
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />
      <el-table-column align="center" min-width="100px" label="名称" prop="name" />
      <el-table-column align="center" min-width="300px" label="备注" prop="comment" />
      <el-table-column align="center" label="类别" prop="promtype">
        <template slot-scope="scope">
          <el-tag>{{ categoryDic[scope.row.promtype] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" label="打折" prop="discount" />

      <el-table-column align="center" min-width="100px" label="开始时间" :formatter="dateFormat" prop="startTime" />
      <el-table-column align="center" min-width="100px" label="结束时间" :formatter="dateFormat" prop="endTime" />
      <el-table-column align="center" min-width="100px" label="创建时间" :formatter="dateFormat" prop="addTime" />
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="dataForm.comment" />
        </el-form-item>
        <el-form-item label="类别" prop="promtype">
          <el-select v-model="dataForm.promtype" placeholder="请选择"><el-option v-for="(item, index) in categoryDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>

        <el-form-item label="打折" prop="discount">
          <el-input v-model="dataForm.discount" />
        </el-form-item>
        <el-form-item label="促销开始时间" prop="startTime">
          <el-date-picker
            v-model="dataForm.startTime"
            clearable
            style="width: 100%"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item label="促销结束时间" prop="endTime">
          <el-date-picker
            v-model="dataForm.endTime"
            clearable
            style="width: 100%"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listPromotion, createPromotion, updatePromotion } from '@/api/config'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import moment from 'moment'

export default {
  name: 'TimeslotPlan',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        start: undefined,
        end: undefined,
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        startTime: undefined,
        endTime: undefined,
        name: undefined,
        comment: undefined,
        promtype: 0,
        discount: 0,
        enabled: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      categoryDic: ['时间卡打折', '其他'],
      rules: {
        discount: [{ required: true, message: 'discount不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: 'startTime不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: 'endTime不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === undefined) { return '' }
      return moment(date).format('YYYY-MM-DD')
      // return moment(date).subtract(1, 'months').format("YYYY-MM-DD")
      // return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    getList() {
      if (!this.listQuery.start || !this.listQuery.end) { return }
      this.listLoading = true
      listPromotion(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
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
    resetForm() {
      this.dataForm = {
        id: undefined,
        startTime: undefined,
        endTime: undefined,
        discount: undefined
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createPromotion(this.dataForm).then(response => {
            this.list.unshift(response.data.data)
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '创建成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      try {
        this.dataForm['effectiveDate'] = moment(this.dataForm['effectiveDate']).toDate()
      } catch (e) { console.log(e) }

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePromotion(this.dataForm).then(() => {
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
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '打折', '开始时间', '结束时间', '创建时间']
        const filterVal = ['id', 'discount', 'startTime', 'endTime', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '促销设置信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
