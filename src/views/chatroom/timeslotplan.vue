<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-button v-permission="['GET /admin/chatroom/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/chatroom/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
 
       <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable />  
      <el-table-column align="center" min-width="400px" label="工作日规划" prop="weekdayPlan" />
      <el-table-column align="center" min-width="400px" label="周末规划" prop="weekendPlan" />
      <el-table-column align="center" min-width="150px" label="开始有效时间"  :formatter="dateFormat" prop="effectiveDate" />  
      <el-table-column align="center" min-width="150px" label="创建时间"   :formatter="dateFormat"  prop="addTime" />

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/chatroom/manage']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/chatroom/manage']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="工作日时间规划，比如：0,3,3,6,6,9,9,12.."  prop="weekdayPlan">
          <el-input v-model="dataForm.weekdayPlan"/>
        </el-form-item>  
        <el-form-item label="周末时间规划，比如：0,3,3,6,6,9,9,12.."  prop="weekendPlan">
          <el-input v-model="dataForm.weekendPlan"/>
        </el-form-item>  
         <el-form-item label="规则开始时间" prop="effectiveDate" >
              <el-date-picker v-model="dataForm.effectiveDate"  clearable style="width: 100%"
                     format="yyyy 年 MM 月 dd 日"  value-format="yyyy-MM-dd"  type="date"></el-date-picker>
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
import { listTimeslotplan, addTimeslotplan, updateTimeslotplan, deleteTimeslotplan } from '@/api/chatroom'
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
        page: 1,
        limit: 20, 
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        weekdayPlan: undefined,
        weekendPlan: undefined,
        effectiveDate: undefined
      },  
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
         weekdayPlan: [{ required: true, message: 'TimeSlot不能为空', trigger: 'blur' }],
         weekendPlan: [{ required: true, message: 'TimeSlot不能为空', trigger: 'blur' }],
         effectiveDate: [{ required: true, message: '有效时间不能为空', trigger: 'blur' }] 
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dateFormat:function(row,column){ 
        var date = row[column.property]; 
        if(date == undefined){return ''}; 
        return moment(date).format("YYYY-MM-DD") 
       // return moment(date).subtract(1, 'months').format("YYYY-MM-DD") 
       // return moment(date).format("YYYY-MM-DD HH:mm:ss") 

    }, 
    getList() {
      this.listLoading = true
      listTimeslotplan(this.listQuery).then(response => {
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
        weekdayPlan: undefined,
        weekendPlan:undefined,
        effectiveDate:undefined
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
        console.log("after validate of createData " + valid)
        if (valid) {
          addTimeslotplan(this.dataForm).then(response => {
             console.log("after addTimeslotplan " + response.data)
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
      try{
          this.dataForm['effectiveDate'] = moment(this.dataForm['effectiveDate']).toDate()
      }catch(e){}
          console.log(" handleUpdate " + this.dataForm['effectiveDate'])
          console.log(" handleUpdate " + (typeof this.dataForm['effectiveDate']))
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
         console.log("after validate of updateData " + valid)
        if (valid) {
          updateTimeslotplan(this.dataForm).then(() => {
              console.log("after updateTimeslotplan " + valid)
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
    handleDelete(row) {
      deleteTimeslotplan(row).then(response => {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        this.getList()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '工作日Time Slot计划', '周末Time Slot计划',  '有效时间',  '创建时间' ]
        const filterVal = ['id', 'weekdayPlan','weekendPlan','effectiveDate', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '每日时间段设置信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
