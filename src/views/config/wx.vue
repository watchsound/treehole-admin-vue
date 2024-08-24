<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="dataForm"
      status-icon
      label-width="300px"
    >
      <el-tabs tab-position="left">
        <el-tab-pane label="首页配置">
          <el-form-item label="关于我们" prop="treehole_wx_aboutme">
            <el-input v-model="dataForm.treehole_wx_aboutme" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="服务介绍" prop="treehole_wx_aboutservice">
            <el-input v-model="dataForm.treehole_wx_aboutservice" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="申请主持人宣传语" prop="treehole_wx_aboutanchor">
            <el-input v-model="dataForm.treehole_wx_aboutanchor" type="textarea" :rows="5" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="解压小提示内容配置" />
        <el-tab-pane label="聊天配置">
          <el-form-item label="聊天群最多人数" prop="treehole_wx_chatroom_max_cap">
            <el-input v-model="dataForm.treehole_wx_chatroom_max_cap" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="其他配置">
          <el-form-item label="分享功能" prop="treehole_wx_share">
            <el-switch v-model="dataForm.treehole_wx_share" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="update">确定</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { listWx, updateWx } from '@/api/config'

export default {
  name: 'ConfigWx',
  data() {
    return {
      dataForm: {
        treehole_wx_chatroom_max_cap: 10,
        treehole_wx_share: false
      },
      rules: {
        treehole_wx_chatroom_max_cap: [
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
      listWx().then(response => {
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
      updateWx(this.dataForm)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '小程序配置成功'
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
