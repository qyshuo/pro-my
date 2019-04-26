<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dialog
      title="收货地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="$refs.editFormRef.resetFields()"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--卡片区-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog=true">
            <span>添加用户</span>
          </el-button>

          <el-dialog
            title="添加用户"
            :visible.sync="addUserDialog"
            width="50%"
            @close="$refs.addFormRef.resetFields()"
          >
            <el-form
              :model="addForm"
              :rules="addFormRules"
              ref="addFormRef"
              label-width="80px"
              class="demo-ruleForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addUserDialog = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="160"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <!-- <span slot-scope="info">{{info.row.mg_state?'显示':'不显示'}}</span> -->
          <el-switch slot-scope="info" v-model="info.row.mg_state"></el-switch>
        </el-table-column>

        <el-table-column label="操作" width="250">
          <template slot-scope="info">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(info.row.id)"
            ></el-button>

            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[2,3,4,5]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 自定义校验规则
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      // 正则表达式校验
      var reg = /^1[35789]\d{9}$/
      if (!reg.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error('手机号码不存在'))
      }
      // 校验成功，继续执行
      callback()
    }
    return {
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },

      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addUserDialog: false,
      editDialogVisible: false,
      tot: 0,
      userList: [],
      // 查询数据的条件
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
    // 修改--展示数据列表
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: dt } = await this.$http.get('users/' + id)
      this.editForm = dt.data
    },
    //修改---修改数据
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.editDialogVisible = false
          this.getUserList()
        }
      })
    },
    delUser(id) {
      this.$confirm('此操作将删除该文件, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('users/' + id)
          // console.log(dt)
          if (dt.meta.status !== 200) {
            this.$message.error('删除数据失败')
          }
          this.$message.success('删除数据成功')
          if (this.userList.length === 1) {
            this.querycdt.pagenum -= 1
            this.getUserList()
          }
        })
        .catch(() => {})
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post('users', this.addForm)
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt)
      this.userList = dt.data.users
      this.tot = dt.data.total
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.querycdt.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querycdt.pagenum = val
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
