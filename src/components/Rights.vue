<template>
  <div>
    <!-- 面包屑 -->
    <com-crumb two="权利" name="权限列表"/>

    <el-card class="box-card">
      <el-table :data="rightsList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="200"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="info.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    // 获取用于显示的权限数据
    async getRightsList() {
      const { data: dt } = await this.$http.get('rights/list')
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightsList = dt.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
