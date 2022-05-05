<script setup lang="ts">
import { onBeforeMount } from "vue";
import { ReNormalCountTo, ReboundCountTo } from "/@/components/ReCountTo";
import { useReportStoreHook } from "/@/store/modules/report";
const reportStore = useReportStoreHook();
onBeforeMount(() => {
  reportStore.QUERY_TODAY();
});
</script>

<template>
  <div class="flex items-center" style="width: 100%; height: 35vh">
    <div style="margin: 0 auto">
      <ReNormalCountTo
        :duration="2000"
        :color="'#409EFF'"
        :fontSize="'8em'"
        :startVal="1"
        :endVal="reportStore.checkNum"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
}

:deep(.el-card) {
  text-align: center;
  margin-bottom: 10px;
}
</style>
