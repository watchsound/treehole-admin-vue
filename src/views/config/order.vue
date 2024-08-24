<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-width="300px">
      <el-form-item label="聊天一小时费用" prop="treehole_order_costperhour">
        <el-input v-model="dataForm.treehole_order_costperhour" class="input-width">
          <template slot="append">元</template>
        </el-input>
        <span class="info"> </span>
      </el-form-item>
     <el-form-item label="推荐一个人，换多少点积分" prop="treehole_order_referpoint">
        <el-input v-model="dataForm.treehole_order_referpoint" class="input-width">
          <template slot="append"> 积分</template>
        </el-input>
        <span class="info"> </span>
      </el-form-item>
      <el-form-item label="主持人一小时的报酬" prop="treehole_order_wageperhour">
        <el-input v-model="dataForm.treehole_order_wageperhour" class="input-width">
          <template slot="append"> 元</template>
        </el-input>
        <span class="info"> </span>
      </el-form-item>
      <el-form-item label="录取稿件的报酬" prop="treehole_order_articlefee">
        <el-input v-model="dataForm.treehole_order_articlefee" class="input-width">
          <template slot="append">元</template>
        </el-input>
        <span class="info">未录取，无报酬</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="update">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { orderlist, orderupdate } from '@/api/config'

export default {
  name: 'ConfigOrder',
  data() {
    return {
      dataForm: {
        treehole_order_costperhour: 0,
        treehole_order_referpoint: 0,
        treehole_order_wageperhour: 0,
        treehole_order_articlefee:0
      },
      rules: {
        treehole_order_costperhour: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        treehole_order_referpoint: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        treehole_order_wageperhour: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        treehole_order_articlefee: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init: function() {
      orderlist().then(response => {
        this.dataForm = response.data.data
      })
    },
    cancel() {
      this.init()
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.doUpdate()
      })
    },
    doUpdate() {
      orderupdate(this.dataForm)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '订单参数配置成功'
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
<style scoped>
  .input-width {
    width: 50%;
  }
  .info {
    margin-left: 15px;
  }
</style>
