<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.city" clearable class="filter-item" style="width: 200px;" placeholder="请输入城市名" />
       <el-input v-model="listQuery.phoneNumber" clearable class="filter-item" style="width: 200px;" placeholder="请输入电话号码" />
     <el-button v-permission="['GET /admin/clinic/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/clinic/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
 
       <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="ID" prop="id" sortable /> 
      <el-table-column align="center" min-width="200px" label="机构名称" prop="name" /> 
      <el-table-column align="center" min-width="400px" label="联系电话" prop="phoneNumber" />
      <el-table-column align="center" min-width="200px" label="地址" prop="addressDetail" />  
      <el-table-column align="center" min-width="400px" label="城市" prop="city" />
      <el-table-column align="center" min-width="200px" label="省份" prop="province" /> 
      <el-table-column align="center" min-width="400px" label="邮编" prop="postalCode" />
      <el-table-column align="center" min-width="200px" label="联系人" prop="primaryContact" />  
        
      <el-table-column align="center" min-width="400px" label="创建时间" prop="addTime" />

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/clinic/manage']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/clinic/manage']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>  
        <el-form-item label="地址" prop="addressDetail">
          <el-input v-model="dataForm.addressDetail"/>
        </el-form-item>  
           <el-form-item label="城市" prop="city">
          <el-input v-model="dataForm.city"/>
        </el-form-item>  
           <el-form-item label="省份" prop="province">
          <el-input v-model="dataForm.province"/>
        </el-form-item>  
           <el-form-item label="邮编" prop="postalCode">
          <el-input v-model="dataForm.postalCode"/>
        </el-form-item>  
       <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="dataForm.phoneNumber"/>
        </el-form-item>  
       <el-form-item label="联系人" prop="primaryContact">
          <el-input v-model="dataForm.primaryContact"/>
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
import { listClinic, createClinic, updateClinic, deleteClinic } from '@/api/clinic'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Clinic',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        city: undefined, 
        phoneNumber: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        phoneNumber: undefined,
        areaCode: '',
        addressDetail:'',
        city:'',
        province:'',
        postalCode:'',
        primaryContact:'' 
      }, 
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
         city: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
         phoneNumber: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
         name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listClinic(this.listQuery).then(response => {
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
        city: undefined,
        phoneNumber:undefined,
        name:undefined
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
          createClinic(this.dataForm).then(response => {
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateClinic(this.dataForm).then(() => {
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
      deleteClinic(row).then(response => {
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
        const tHeader = ['ID', '机构名称', '城市','省份','邮编','电话','联系人','创建时间' ]
        const filterVal = ['id', 'name','city','province','postalCode','phoneNumber','primaryContact', 'addTime']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '心理咨询机构信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
