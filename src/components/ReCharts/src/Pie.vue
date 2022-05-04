<script lang="ts">
export default {
  name: "Pie"
};
</script>

<script setup lang="ts">
import { ECharts } from "echarts";
import echarts from "/@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";
import { useEchartStoreHook } from "/@/store/modules/echart";
import { useBackStoreHook } from "/@/store/modules/back";

const echartStore = useEchartStoreHook();
onBeforeMount(() => {
  echartStore.QUERY_QUARANTINE_AND_CONTACT().then(() => {
    console.log(
      "%c [ echartStore.quarantineNum ]-18",
      "font-size:13px; background:pink; color:#bf2c9f;",
      echartStore.quarantineNum
    );
  });
});

let echartInstance: ECharts;

const props = defineProps({
  index: {
    type: Number,
    default: 0
  }
});

async function initData() {
  await echartStore.QUERY_QUARANTINE_AND_CONTACT();
  await useBackStoreHook().QUERY_BACKNUM();
}

function initechartInstance() {
  const echartDom = document.querySelector(".pie" + props.index);
  if (!echartDom) return;
  // @ts-ignore
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption({
    tooltip: {
      trigger: "item"
    },
    legend: {
      orient: "vertical",
      right: true
    },
    series: [
      {
        name: "今日统计",
        type: "pie",
        radius: "60%",
        center: ["40%", "50%"],
        data: [
          { value: echartStore.quarantineNum, name: "隔离人数" },
          { value: echartStore.contactNum, name: "密接人数" },
          { value: useBackStoreHook().backNum, name: "今日返乡" }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });
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
  <div :class="'pie' + props.index" style="width: 100%; height: 35vh" />
</template>
