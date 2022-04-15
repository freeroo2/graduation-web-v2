<script setup lang="ts">
import { ref } from "vue";
import pcrList from "./pcrList.vue";
import { Tabs, TabPane } from "@pureadmin/components";
const activeKey = ref(1);
</script>
<template>
  <div>
    <el-card
      ><Tabs
        v-model:activeKey="activeKey"
        tab-position="top"
        :style="{ height: 'auto', margin: '20px' }"
        ><TabPane :key="1" tab="核酸记录表">
          <div style="margin-top: 30px">所有已登记的核酸记录如下</div>
          <el-row :gutter="24" style="margin: 20px">
            <el-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="24"
              style="margin-bottom: 20px"
              v-motion
              :initial="{
                opacity: 0,
                y: 100
              }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 200
                }
              }"
            >
              <pcr-list /> </el-col
          ></el-row> </TabPane></Tabs
    ></el-card>
  </div>
</template>
