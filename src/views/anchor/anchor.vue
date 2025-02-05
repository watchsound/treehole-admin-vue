<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名" />
      <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户Id" />
      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="用户ID" prop="id" sortable />

      <el-table-column align="center" label="用户名" prop="username" />

      <el-table-column align="center" label="手机号码" prop="mobile" />

      <el-table-column align="center" label="性别" prop="gender">
        <template slot-scope="scope">
          <el-tag>{{ genderDic[scope.row.gender] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总评分" prop="totalRating" />
      <el-table-column align="center" label="被评价次数" prop="numRating" />
      <el-table-column align="center" label="可工作时间段" prop="preferTimeslot" />
      <el-table-column align="center" label="创建时间" prop="addTime" />

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 用户编辑对话框 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="userDialogVisible" title="用户编辑">
      <el-form ref="userDetail" :model="userDetail" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="userDetail.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userDetail.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input v-model="userDetail.mobile" />
        </el-form-item>

        <el-form-item label="用户性别" prop="gender">
          <el-select v-model="userDetail.gender" placeholder="请选择"><el-option v-for="(item, index) in genderDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
        <el-form-item label="总得分" prop="totalRating">
          <el-input v-model="userDetail.totalRating" :disabled="true" />
        </el-form-item>
        <el-form-item label="评价次数" prop="numRating">
          <el-input v-model="userDetail.numRating" :disabled="true" />
        </el-form-item>
        <el-form-item label="可工作时间段" prop="preferTimeslot">
          <el-input v-model="userDetail.preferTimeslot" />
        </el-form-item>
        <el-form-item label="创建时间" prop="addTime">
          <el-input v-model="userDetail.addTime" :disabled="true" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="userDetail.status" placeholder="请选择"><el-option v-for="(item, index) in statusDic" :key="index" :label="item" :value="index" /></el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUserUpdate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchAnchorList, anchorDetail, updateAnchor } from '@/api/anchor'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        username: undefined,
        mobile: undefined,
        page: 1,
        limit: 20,
        sort: 'add_time',
        order: 'desc'
      },
      downloadLoading: false,
      genderDic: ['未知', '男', '女'],
      statusDic: ['可用', '禁用', '注销'],
      userDialogVisible: false,
      userDetail: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.userId) {
        anchorDetail(this.listQuery.userId).then(response => {
          this.list = []
          if (response.data.data) {
            this.list.push(response.data.data)
            this.total = 1
            this.listLoading = false
          } else {
            this.list = []
            this.total = 0
            this.listLoading = false
          }
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      } else {
        fetchAnchorList(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    },
    handleDetail(row) {
      this.userDetail = row
      this.userDialogVisible = true
    },
    handleUserUpdate() {
      updateAnchor(this.userDetail)
        .then((response) => {
          this.userDialogVisible = false
          this.$notify.success({
            title: '成功',
            message: '更新用户成功'
          })
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    }
  }
}
</script>
