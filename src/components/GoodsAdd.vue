<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>

      <el-steps
        :space="200"
        :active="activeName-1"
        finish-status="success"
        align-center
        class="step"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form ref=" formGoodsAddRef" :model=" formGoodsAdd" label-width="80px" :rules="rules">
        <el-tabs
          tab-position="left"
          v-model="activeName"
          @tab-click="handleClick"
          :before-leave="beforeTab"
        >
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model=" formGoodsAdd.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model=" formGoodsAdd.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model=" formGoodsAdd.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model=" formGoodsAdd.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_jilian">
              {{selectedOptions2}}
              <el-cascader
                expand-trigger="hover"
                :options="options"
                :props="catProps"
                v-model="selectedOptions2"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item :label="item1.attr_name" v-for="(item1,i) in manyParams" :key="i">
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox border :label="item2" v-for="(item2,j) in item1.attr_vals" :key="j"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,i) in onlyParams"
              :key="i"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <quill-editor v-model="formGoodsAdd.goods_introduce"></quill-editor>
            <el-button type="primary" @click="goodsAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  created() {
    this.getData()
  },
  data() {
    return {
      // 添加商品（最后）
      formGoodsAdd: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 文件上传
      fileList: [],
      // 设置文件上传的请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // name=2
      checkList: [],
      // 获取静态数据
      manyParams: [],
      // 获取动态数据
      onlyParams: [],
      activeName: '1',
      Infoform: {},
      //  级联选择器循环的数据
      options: [],
      // 选中项绑定的值
      selectedOptions2: [],
      threeCatId: '',
      // 级联选择器
      catProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_jilian: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加商品（最后）
    async goodsAdd() {
      this.formGoodsAdd.goods_cat = this.selectedOptions2.join(',')
      // 商品参数[动态参数]
      this.manyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.formGoodsAdd.attrs.push(obj)
        }
      })
      // [静态参数]
      this.onlyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.formGoodsAdd.attrs.push(obj)
        }
      })

      // 所有的数据都准备齐全发送ajax请求
      // this.$refs.formGoodsAddRef.validate(async valid => {
      // if (valid) {
      const { data: dt } = await this.$http.post('goods', this.formGoodsAdd)
      if (dt.meta.status !== 201) {
        // 提示
        return this.$message({
          message: dt.meta.msg,
          type: 'error',
          duration: 1500
        })
      }
      // }
      // })
      // 回到列表->改变页面的内容->改变组件->1.router-link 2.js编程式导航
      this.$router.push('/goods')
    },
    // 文件上传
    handleSuccess(response) {
      // console.log(response)
      // 图片的临时保存路径,将来会用
      const tmpPath = response.data.tmp_path
      this.formGoodsAdd.pics.push({ pic: tmpPath })
    },
    handleRemove(file) {
      // console.log(file)
      // 图片的临时保存路径,将来会用
      const tmpPath = file.response.data.tmp_path
      const index = this.formGoodsAdd.pics.findIndex((item, i) => {
        return item.pic === tmpPath
      })
      this.formGoodsAdd.pics.splice(index, 1)
    },
    // tab生效之前的函数
    beforeTab(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)
      // console.log(this.selectedOptions2)
      if (oldActiveName === '1' && this.selectedOptions2.length !== 3) {
        // 提示框:提示选择三级分类
        this.$message({
          message: '请选取第三级商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
    },
    // @tab-click="handleClick" 标签页 tab 被选中时触发
    async handleClick() {
      if (this.activeName === '2') {
        const { data: dt } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          { params: { sel: 'many' } }
        )
        // console.log(dt)

        if (dt.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }

        // 处理动态参数数组中的attr_vals
        dt.data.forEach((item, i) => {
          item.attr_vals = item.attr_vals.split(',')
        })
        // console.log(dt.data)
        this.manyParams = dt.data
        // console.log(this.manyParams)
      }
      if (this.activeName === '3') {
        // 判断点击了“商品属性”标签，就获取对应的属性信息
        const { data: res } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取商品属性失败',
            type: 'error',
            duration: 1500
          })
        }
        this.onlyParams = res.data
        // console.log(this.onlyParams)
      }
    },
    // 当绑定值变化时触发的事件
    handleChange() {
      this.threeCatId = this.selectedOptions2[2]
    },
    // 获取级联选择器的数据
    async getData() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      //   console.log(dt)
      this.options = dt.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 25px;
}
.el-button {
  margin-top: 15px;
}
</style>
