<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="input" clearable class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="tianjiaGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
        <el-table-column  label="创建时间" width="180">
            <template slot-scope="info">
                <span>{{info.row.add_time | dataFormat}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="querycdt.pageize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getTableData()
  },
  data() {
    return {
      input: '',
      total: 0,
      tableData: [],
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: '5'
      }
    }
  },
  methods: {
    // 添加商品按钮
    tianjiaGoods() {
      this.$router.push('/goodsadd')
    },
    async getTableData() {
      const { data: dt } = await this.$http.get('/goods', {
        params: this.querycdt
      })
      console.log(dt)
      this.tableData = dt.data.goods
      this.total = dt.data.total
    },
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
