<template>
  <div>
    <!-- 面包屑 -->
    <com-crumb two="商品" name="商品分类"/>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
      <span v-for="(item,k) in dtt" :key="k">{{k}}aaa</span>
      <!-- <el-table-column type :index="indexMethod" label="序号" width="180">{{querycdt.pagesize}}</el-table-column> -->
      <el-table :data="catList" style="width: 100%;margin-bottom: 20px;" row-key="cat_id">
        <el-table-column type="index" :index="indexMethod" label="序号" width="180">
          <template slot-scope="info">
            <el-col v-if="info.row.cat_level===0">{{info.$index+1}}</el-col>
          </template>
        </el-table-column>

        <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
        <el-table-column label="是否有效" width="180">
          <i class="el-icon-circle-check"></i>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level===0">一级</el-tag>
            <el-tag v-else-if="info.row.cat_level===1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialog" width="50%" @close="resetForm">
      <el-form ref="addCatRefs" :model="addCat" label-width="80px" :rules="addCatRules">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addCat.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="分类上级">
          <el-cascader
            expand-trigger="hover"
            :options="catTwoList"
            v-model="selectedCatTwo"
            :props="catTwoListProps"
            @change="catTwoChange"
            change-on-select
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatList()
  },
  data() {
    return {
      no: 1,
      dtt: [],
      dts: [],
      catList: [],
      querycdt: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 显示添加分类[级联选择器]
      // 表单数据对象
      addCat: {
        cat_name: '', // 新分类名称
        cat_pid: 0, // 新分类直接父id
        cat_level: 0 // 新分类的等级
      },
      addCatDialog: false,
      // 级联选择器
      catTwoListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCatTwo: [],
      catTwoList: [],
      // 表单验证
      addCatRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    indexMethod(index) {
      return (index = 1)
    },
    //  indexMethod(index) {
    //   return index * 2;
    // },
    // 关闭对话框重置表单
    resetForm() {
      // 重置form表单
      this.$refs.addCatRefs.resetFields()
      // 重置父分类 级联菜单
      this.selectedCatTwo = []
      // 重置表单对象设置过的分类pid和分类level
      this.addCat.cat_pid = 0
      this.addCat.cat_level = 0
    },
    // 确认表单验证的信息
    tianjia() {
      this.$refs.addCatRefs.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post('categories', this.addCat)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 添加分类成功：提示、关闭对话框、数据刷新
          this.$message.success(dt.meta.msg)
          this.addCatDialog = false
          this.getCatList()
        }
      })
    },
    // 级联选择器内容变化的回调处理[也就是cat_pid和cat_level的数据来源]
    catTwoChange() {
      //   console.log(this.selectedCatTwo) // [52, 64, __ob__: Observer]
      // 计算当前新分类的pid和level
      var len = this.selectedCatTwo.length
      if (len === 0) {
        // 没有选取上级分类
        this.addCat.cat_pid = 0
        this.addCat.cat_level = 0
      } else {
        // 有选取上级的分类
        this.addCat.cat_pid = this.selectedCatTwo[len - 1]
        this.addCat.cat_level = len
      }
    },
    // 获取级联选择器的数据
    async showAddCatDialog() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      console.log(dt)
      this.catTwoList = dt.data
      // 显示添加分类的对话框
      this.addCatDialog = true
    },
    async getCatList() {
      const { data: dt } = await this.$http.get('categories', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.catList = dt.data.result
      this.dtt = dt.data.result
      // // 循环遍历dtt
      // dt.data.result.forEach((ele, a) => {
      //   console.log(a)
      //   return a
      // })
      console.log(dt.data.result)
      // this.dtt = dt.data.result.length
      // console.log(this.dtt)
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-circle-check {
  font-size: 12px;
  color: rgb(68, 178, 170);
}
</style>
