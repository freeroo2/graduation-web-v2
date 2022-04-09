<script setup name="noticeDetail" lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useNoticeStoreHook } from "/@/store/modules/notice";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import editor from "/@/components/ReEditor/Editor.vue";
import { detailType } from "/@/store/modules/types";
import { useRouter } from "vue-router";
import { functionsIn } from "lodash-unified";
const router = useRouter();
const noticeStore = useNoticeStoreHook();
const editFlag = ref(false);
let data: detailType = reactive({
  id: null,
  uid: null,
  title: "",
  content: "",
  nickName: "",
  pubTime: ""
});
const form = reactive({
  title: "",
  content: ""
});

function fetchData() {
  return new Promise(resolve => {
    const id = Number(router.currentRoute.value.params.id);
    noticeStore.GET_NOTICE_DETAIL(id).then((data: any) => {
      console.log(
        "%c [ data ]-27",
        "font-size:13px; background:pink; color:#bf2c9f;",
        data
      );
      resolve(data);
    });
  });
}
function onSubmit() {
  // noticeStore.updateNotice(form);
  // dialogVisible.value = false;
  console.log(
    "%c [ form.content ]-50",
    "font-size:13px; background:pink; color:#bf2c9f;",
    form.content
  );
}
function getWangEditorValue(str: string) {
  form.content = str;
}
// fetchData().then((res: detailType) => {
//   data.title = res.title;
//   data.content = res.content;
//   data.id = res.id;
//   data.uid = res.uid;
//   data.pubTime = res.pubTime;
//   data.nickName = res.nickName;
//   form.content = res.content;
//   form.title = res.title;
// });
onMounted(() => {
  fetchData().then((res: detailType) => {
    data.title = res.title;
    data.content = res.content;
    data.id = res.id;
    data.uid = res.uid;
    data.pubTime = res.pubTime;
    data.nickName = res.nickName;
    form.content = res.content;
    form.title = res.title;
  });
});
// onBeforeUnmount((): void => {
//   noticeStore.resetDetailData();
// });
</script>
<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium" style="text-align: center"> 通告详情 </span>
        <el-button round style="float: right" @click="editFlag = true">
          编辑
        </el-button>
      </div>
    </template>
    <div class="parent">
      <div class="div1">
        <el-row>
          <el-col :span="4" />
          <el-col :span="16">
            <h1
              style="
                font-size: x-large;
                font-weight: bolder;
                margin-top: 80px;
                width: 100%;
                text-align: center;
              "
            >
              {{ data.title }}
            </h1>
            <el-divider style="width: 100%" />
          </el-col>
          <el-col :span="4" />
        </el-row>
      </div>
      <div class="div2">
        <span style="font-size: 14px; color: darkgray"
          >发布人：{{ data.nickName }}</span
        >
        <br />
        <span style="font-size: 14px; color: darkgray"
          >发布时间：{{ data.pubTime }}</span
        >
      </div>

      <div class="div3">
        <div class="preview" v-html="data.content" />
      </div>
      <el-dialog v-model="editFlag" title="编辑公告">
        <el-form :model="form">
          <el-form-item label="标题" label-width="auto">
            <el-input
              v-model="form.title"
              autocomplete="off"
              style="width: auto"
            />
          </el-form-item>
          <el-form-item label="内容" label-width="50%">
            <editor
              :contentHtml="form.content"
              v-on:getWangEditorValue="getWangEditorValue"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editFlag = false">取 消</el-button>
            <el-button type="primary" @click="onSubmit()">保 存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </el-card>
</template>
<style lang="scss">
.parent {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr 0.3fr 3fr 5fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.div1 {
  grid-area: 1 / 1 / 2 / 6;
}
.div2 {
  grid-area: 2 / 5 / 3 / 6;
}
.div3 {
  grid-area: 3 / 2 / 4 / 5;
}
.preview {
  margin-top: 50px;
}
</style>
