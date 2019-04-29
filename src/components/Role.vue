<template>
  <div>
    <com-crumb two="权利" name="角色列表"/>
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column type="expand" width="60" label="222">
          <!--展开行的内容-->
          <template slot-scope="info">
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom':'1px solid rgb(235, 238, 245)','border-top':k===0?'1px solid rgb(235, 238, 245)':''}"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="delRights(info.row,v.id)"
                  disable-transitions="true"
                >{{v.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(vv,kk) in v.children"
                  :key="vv.id"
                  :style="{'border-top':kk===0?'':'1px solid rgb(235, 238, 245)'}"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="delRights(info.row,vv.id)"
                      disable-transitions="true"
                    >{{vv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      @close="delRights(info.row,vvv.id)"
                      disable-transitions="true"
                    >{{vvv.authName}}</el-tag>
                  </el-col>
                </el-row>
                <!-- <el-row v-for="vvv in v.children.children" :key="vvv.id"><el-tag>{{vvv.authName}}</el-tag></el-row> -->
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="240"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button size="mini" type="primary" icon="el-icon-edit">編輯</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">刪除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="fenpei(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="角色分配" :visible.sync="showFenpei" width="60%">
      <el-form ref="Fenpeiform" :model="role" label-width="120px">
        <el-form-item label="当前角色:">
          <!-- <el-input v-model="role.roleName"></el-input> -->
          <span>{{role.roleName}}</span>
        </el-form-item>
        <el-form-item label="分配权限:">
          <!-- 权限树树权限树树权限树树权限树树权限树树权限树树 -->
          <el-tree
            :data="rightsInfo"
            show-checkbox
            node-key="id"
            :props="treeProps"
            :default-expand-all="true"
            :default-checked-keys="treeShujuChecked"
            ref="treeRefs"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showFenpei = false">取 消</el-button>
        <el-button type="primary" @click="shoujiRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  data() {
    return {
      roleList: [],
      showFenpei: false,
      role: {},
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      rightsInfo: [],
      // 收集叶子节点的参数
      treeShujuChecked: []
    }
  },
  methods: {
    /** 收集分配的权限存储入库 */
    async shoujiRights() {
      var ids1 = this.$refs.treeRefs.getHalfCheckedKeys()
      var ids2 = this.$refs.treeRefs.getCheckedKeys()
      var id12 = ids1.concat(ids2).join(',')
      const { data: dt } = await this.$http.post(
        `roles/${this.role.id}/rights`,
        { rids: id12 }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 如果成功了，关闭弹窗，提示消息，重新刷新
      this.showFenpei = false
      this.$message.success('分配权限成功')
      this.getRoleList()
    },
    // 权限树
    async fenpei(role) {
      // const {data:dt} = await this.$http.get('roles/'+role.id)
      // this.role = dt.data
      // console.log(this.role)
      // 直接把传过来的数据info.row里面的所有数据传给role，就不用发送axios请求了
      this.role = role
      // 获取角色列表的信息树状图
      const { data: dt } = await this.$http.get('rights/tree')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightsInfo = dt.data
      // 把当前拥有的的第三级别权限的id获取到，并以数组的形式呈现
      // 具体从参数role中获取
      var idkeys = [] // 接收第三级别权限的id
      this.getHaveRights(role, idkeys)
      console.log(idkeys)
      // 把拥有的第三级别权限的id数组赋予给treeShujuChecked
      this.treeShujuChecked = idkeys
      // 展示对话框
      this.showFenpei = true
    },
    getHaveRights(node, arr) {
      // 给node的第一级设置children字段
      if (node.son) {
        node.children = node.son
      }
      // 如果没有children字段，就是最后一个级别，就是叶子级别，然后就可以添加到数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      // 循环每一个children里面的数据，然后重复执行getHaveRights()函数
      node.children.forEach(item => {
        return this.getHaveRights(item, arr)
      })
    },
    delRights(role, id) {
      this.$confirm('此操作将永久删除, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete(
            `roles/${role.id}/rights/${id}`
          )
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          // 删除成功：提示，页面刷新（数据更新）
          // this.getRoleList()// 展开行收起，全部更新
          role.son = dt.data
        })
        .catch(() => {})
    },
    async getRoleList() {
      const { data: dt } = await this.$http.get('roles')
      // console.log(dt)
      dt.data.forEach(item => {
        item.son = item.children
        delete item.children
      })
      this.roleList = dt.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
