<script setup></script>

<template>
  <el-menu ellipsis class="el-menu-popper-demo" mode="horizontal" :popper-offset="16" :router="true">
    <el-menu-item index="1" route="/demo1">초기화면</el-menu-item>
    <el-sub-menu index="2" :popper-offset="0">
      <template #title>LogicFlow demo</template>
      <el-sub-menu index="2-0" :popper-offset="0">
        <template #title>basic</template>
        <el-menu-item index="2-0-1" route="/demo1">demo1</el-menu-item>
        <el-menu-item index="2-0-2" route="/demo2">demo2</el-menu-item>
        <el-menu-item index="2-0-3" route="/demo3">demo3</el-menu-item>
        <el-menu-item index="2-0-4" route="/demo4">demo4</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2-1" :popper-offset="0">
        <template #title>mvp</template>
        <el-menu-item index="2-1-1" route="/mvp1">mvp1</el-menu-item>
        <el-menu-item index="2-1-2" route="/mvp2">mvp2</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2-2" :popper-offset="0">
        <template #title>Vue Demo</template>
        <el-menu-item index="2-2-3" route="/LF2">LF</el-menu-item>
        <el-menu-item index="2-2-4" route="/TurboAdapter2">TurboAdapter</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-sub-menu index="3" :popper-offset="0">
      <template #title>Element-Plus demo</template>
      <el-menu-item index="3-1">Table</el-menu-item>
      <el-menu-item index="3-2">Dialog</el-menu-item>
      <el-menu-item index="3-3">item three</el-menu-item>
      <el-sub-menu index="3-4" :popper-offset="0">
        <template #title>Form</template>
        <el-menu-item index="3-4-1">item one</el-menu-item>
        <el-menu-item index="3-4-2">item two</el-menu-item>
        <el-menu-item index="3-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="4">Konva demo</el-menu-item>
    <el-menu-item index="5">Fabric.js demo</el-menu-item>
  </el-menu>
  <router-view />
</template>
