<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="tableDataList" border stripe style="width: 100%">
          <el-table-column type="index" label="#" width="60"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
          <el-table-column label="是否付款" width="100">
            <template slot-scope="info">
              <el-tag type="danger">{{info.row.order_pay ==0?'未付款':'已付款'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
          <el-table-column label="下单时间" width="180">
            <template slot-scope="info">
              <span>{{info.row.update_time | dataFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="getWuLiu"></el-button>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="querycdt.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </el-card>
    <el-dialog title="物流管理" :visible.sync="dialogVisible" width="30%">
      <el-steps direction="vertical" :active="1">
        <el-step :title="item.ftime" :description="item.context" v-for="(item,i) in params" :key="i"></el-step>
      </el-steps>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getTableDataList()
  },
  data() {
    return {
      // 地理位置开始
      dialogVisible: false,
      // 地理位置结束
      input: '',
      tableDataList: [],
      // 请求的参数
      params: [],
      //
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  methods: {
    // 查看物流信息
    async getWuLiu() {
      this.dialogVisible = true
      const { data: res } = await this.$http.get('kuaidi/81337523816')
      // console.log(res)
      this.params = res.data
      // console.log(this.params)
    },
    // 展示地理位置
    showDialog() {
      this.dialogVisible = true
    },
    // 分页
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getTableDataList()
    },
    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getTableDataList()
    },
    async getTableDataList() {
      const { data: dt } = await this.$http.get('orders', {
        params: this.querycdt
      })
      // console.log(dt)
      this.tableDataList = dt.data.goods
      this.total = dt.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
