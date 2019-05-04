<template>
  <div>
    <!-- 面包屑导航 -->
    <com-crumb two="商品" name="参数列表"/>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" :closable="false" type="warning" show-icon></el-alert>
      <!-- 级联选择器3级别分类 -->
      <el-row>
        <el-col>
          <span>选择商品的分类</span>
          <el-cascader
            expand-trigger="hover"
            :options="catThreeList"
            v-model="catThreeSelected"
            :props="catThreeProps"
            @change="catThreeChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 这里写动态切换的内容 -->
          <el-button type="primary" size="mini" :disabled="showButton">添加参数</el-button>
          <!-- 表格展示 -->
          <el-table :data="manyParamList" border stripe style="width: 100%">
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="180"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column prop label="操作">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="bianji">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="shanchu">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 这里写静态切换的内容 -->
          <el-button type="primary" size="mini" :disabled="showButton">添加属性</el-button>
          <!-- 表格展示 -->
          <el-table :data="onlyParamList" border stripe style="width: 100%">
            11
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k">{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop type="index" label="#" width="180"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column prop label="操作">
              <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="修改动态参数" :visible.sync="showbianji" width="50%">
      <!-- <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showbianji = false">取 消</el-button>
        <el-button type="primary" @click="showbianji = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title :visible.sync="showxiugai" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="showxiugai = false">取 消</el-button>
        <el-button type="primary" @click="showxiugai = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getThreeList()
  },
  data() {
    return {
      showbianji: false,
      showxiugai: false,
      // 级联选择器
      catThreeList: [], // 显示的数据
      catThreeSelected: [], // 设置 获取当前选中的数据的
      // 给级联选择器设置数据的属性
      catThreeProps: {
        value: 'cat_id', // 选择器有效地数据
        label: 'cat_name', // 选择器显示的信息
        children: 'children' // 父子级衔接的字段
      },
      // tabs
      activeName: 'many',
      catThreeId: 0, // 选取好的第3级别分类id
      // 参数列表的数据
      manyParamList: [],
      onlyParamList: [],
      showButton: true
    }
  },
  methods: {
    // 编辑按钮
    bianji() {
      this.showbianji = true
    },
    shanchu() {
      this.showxiugai = true
    },

    // 删除按钮
    handleClick() {
      this.getParamList()
    },
    // 专门 根据分类、参数类型 获得对应的参数列表数据
    async getParamLists() {
      const { data: dt } = await this.$http.get(
        `categories/${this.catThreeId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      //
    },
    // 级联选择器
    // 选取的内容发生改变时出发的回调[判断是否选取第3级别分类信息]
    catThreeChange() {
      var len = this.catThreeSelected.length
      if (len !== 3) {
        // 如果没有选取第3级别分类
        this.catThreeSelected = []
        this.showButton = true
        this.catThreeId = 0
        // 收回获得好的"参数列表"数据
        this.manyParamList = []
        this.onlyParamList = []
      } else {
        // 按钮激活， 第三级别的id给与， 获得用于展示的参数列表
        this.showButton = false
        this.catThreeId = this.catThreeSelected[2]
        this.getParamList()
      }
    },
    // 获取级联选择器的数据
    async getThreeList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      //   console.log(dt)
      this.catThreeList = dt.data
    },
    // 获取对应的参数列表表格的数据
    async getParamList() {
      const { data: dt } = await this.$http.get(
        `categories/${this.catThreeId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // cosnole.log(dt)
      dt.data.forEach(item => {
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      if (this.activeName === 'many') {
        this.manyParamList = dt.data
      } else {
        this.onlyParamList = dt.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin: 10px 5px;
}
</style>
