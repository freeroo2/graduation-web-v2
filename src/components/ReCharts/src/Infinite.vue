<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { templateRef } from "@vueuse/core";
import SeamlessScroll from "/@/components/ReSeamlessScroll";
import { useNoticeStoreHook } from "/@/store/modules/notice";

const scroll = templateRef<ElRef | null>("scroll", null);
const mylistData = ref([]);
onMounted(() => {
  useNoticeStoreHook()
    .GET_NOTICES_LIST()
    .then((res: any) => {
      mylistData.value = res.data;
    });
});
// 类型格式化显示，0为疫情通告，1为疫苗接种通告，2为疫苗存量通告
const formatType = (value: any) => {
  if (value === 0) {
    return "疫情通告";
  }
  if (value === 1) {
    return "疫苗接种通告";
  }
  if (value === 2) return "疫苗存量通告";
};
let listData = ref([
  {
    date: "2021-09-01",
    name: "vue-pure-admin",
    star: "1000"
  },
  {
    date: "2021-09-02",
    name: "vue-pure-admin",
    star: "1100"
  },
  {
    date: "2021-09-03",
    name: "vue-pure-admin",
    star: "1200"
  },
  {
    date: "2021-09-04",
    name: "vue-pure-admin",
    star: "1300"
  },
  {
    date: "2021-09-05",
    name: "vue-pure-admin",
    star: "1400"
  },
  {
    date: "2021-09-06",
    name: "vue-pure-admin",
    star: "1500"
  },
  {
    date: "2021-09-07",
    name: "vue-pure-admin",
    star: "1600"
  },
  {
    date: "2021-09-08",
    name: "vue-pure-admin",
    star: "1700"
  },
  {
    date: "2021-09-09",
    name: "vue-pure-admin",
    star: "1800"
  },
  {
    date: "2021-09-10",
    name: "vue-pure-admin",
    star: "1900"
  }
]);

let classOption = reactive({
  direction: "top"
});
</script>

<template>
  <div class="infinite">
    <ul class="top">
      <li>发布日期</li>
      <li>通告类型</li>
      <li>标题</li>
    </ul>
    <SeamlessScroll
      ref="scroll"
      :data="listData"
      :class-option="classOption"
      class="warp"
    >
      <ul class="item">
        <li v-for="(item, index) in mylistData" :key="index">
          <span v-text="item.pubTime" />
          <span v-text="formatType(item.type)" />
          <span v-text="item.title" />
        </li>
      </ul>
    </SeamlessScroll>
  </div>
</template>

<style lang="scss" scoped>
.infinite {
  .top {
    width: 95%;
    height: 40px;
    line-height: 40px;
    display: flex;
    margin: 0 auto;
    font-size: 14px;
    color: #909399;
    font-weight: 400;
    background: #fafafa;

    li {
      width: 34%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .warp {
    width: 95%;
    height: 215px;
    margin: 0 auto;
    overflow: hidden;

    li {
      height: 30px;
      line-height: 30px;
      display: flex;
      font-size: 15px;
    }

    span {
      width: 34%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
