<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{two}}管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
    </el-breadcrumb>

    <slot city="我"></slot>

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['name', 'two']
}
</script>

<style lang="less" scoped>
</style>
