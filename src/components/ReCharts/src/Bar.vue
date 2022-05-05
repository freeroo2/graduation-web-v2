<script lang="ts">
export default {
  name: "Bar"
};
</script>

<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";
import { useReportStoreHook } from "/@/store/modules/report";

const reportStore = useReportStoreHook();

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  }
});

function initechartInstance() {
  const echartDom = document.querySelector(".bar" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      bottom: "20%",
      height: "68%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0
          // width: "70",
          // overflow: "truncate"
        },
        data: ["发烧", "咳嗽", "乏力", "呼吸困难"]
      }
    ],
    yAxis: [
      {
        type: "value",
        minInterval: 1
      }
    ],
    series: [
      {
        name: "今日健康统计",
        type: "bar",
        data: [
          reportStore.feverNum,
          reportStore.coughNum,
          reportStore.tiredNum,
          reportStore.hardBreathNum
        ]
      }
    ]
  });
}
async function initData() {
  await useReportStoreHook().QUERY_TODAY();
}
onBeforeMount(() => {
  nextTick(() => {
    initData().then(() => {
      initechartInstance();
    });
  });
});

onMounted(() => {
  nextTick(() => {
    useEventListener("resize", () => {
      if (!echartInstance) return;
      useTimeoutFn(() => {
        echartInstance.resize();
      }, 180);
    });
  });
});

tryOnUnmounted(() => {
  if (!echartInstance) return;
  echartInstance.dispose();
  echartInstance = null;
});
</script>

<template>
  <div :class="'bar' + props.index" style="width: 100%; height: 35vh" />
</template>
