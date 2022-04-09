<script setup name="noticePage" lang="ts">
import { reactive, ref } from "vue";
import { VxeGridProps, VxeGridEvents, VxeGridListeners } from "vxe-table";
import router from "/@/router";
import { useNoticeStoreHook } from "/@/store/modules/notice";
import { storageSession } from "/@/utils/storage";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

const showDetails = ref(false);
const noticeStore = useNoticeStoreHook();
const gridOptions = reactive<VxeGridProps>({
  border: true,
  keepSource: true,
  height: 500,
  printConfig: {},
  importConfig: {},
  exportConfig: {},
  columnConfig: {
    resizable: true
  },
  pagerConfig: {
    perfect: true,
    pageSize: noticeStore.pageSize
  },
  editConfig: {
    trigger: "click",
    mode: "row",
    showStatus: true,
    activeMethod({ columnIndex }) {
      // TODO 禁用编辑的逻辑部分，后续待修改
      if (storageSession.getItem("info").id > 0) {
        return false;
      }
      return true;
    }
  },
  toolbarConfig: {
    buttons: [
      {
        code: "insert_actived",
        name: "新增",
        status: "perfect",
        icon: "fa fa-plus"
      },
      {
        code: "mark_cancel",
        name: "标记/取消",
        status: "perfect",
        icon: "fa fa-trash-o"
      },
      {
        code: "save",
        name: "保存",
        status: "perfect",
        icon: "fa fa-save"
      }
    ],
    perfect: true,
    refresh: {
      icon: "fa fa-refresh",
      iconLoading: "fa fa-spinner fa-spin"
    },
    import: {
      icon: "fa fa-upload"
    },
    export: {
      icon: "fa fa-download"
    },
    print: {
      icon: "fa fa-print"
    },
    zoom: {
      iconIn: "fa fa-arrows-alt",
      iconOut: "fa fa-expand"
    },
    custom: {
      icon: "fa fa-cog"
    }
  },
  proxyConfig: {
    props: {
      result: "result",
      total: "total"
    },
    ajax: {
      // 接收 Promise
      query: () => {
        return new Promise(resolve => {
          noticeStore.GET_NOTICES().then(() => {
            resolve({
              result: noticeStore.pageData,
              total: noticeStore.total
            });
          });
        });
      },
      // body 对象： { removeRecords }
      delete: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({});
          }, 100);
        });
      },
      // body 对象： { insertRecords, updateRecords, removeRecords, pendingRecords }
      save: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({});
          }, 100);
        });
      }
    }
  },
  columns: [
    { type: "checkbox", width: 50 },
    { type: "seq", width: 60 },
    {
      field: "id",
      title: "ID",
      width: 60
    },
    {
      field: "title",
      title: "标题",
      editRender: { autofocus: ".vxe-input--inner" },
      slots: { edit: "title_edit" }
    },
    {
      field: "nickName",
      title: "发布人",
      width: 100
    },
    {
      field: "content",
      title: "内容",
      editRender: {},
      slots: { edit: "content_edit" }
    },
    {
      field: "pubTime",
      title: "发布时间",
      width: 160
    }
  ]
});
const editDisabledEvent: VxeGridEvents.EditDisabled = () => {
  console.log("禁止编辑");
};
const gridEvents: VxeGridListeners = {
  cellClick({ row }) {
    console.log(`单元格点击${row.title}`);
    showDetails.value = true;
    noticeStore.detailData = row;
    router.push({ path: `/notice/detail/${row.id}` });
  }
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">通告信息 </span>
      </div>
    </template>
    <vxe-grid v-bind="gridOptions" show-overflow="ellipsis" v-on="gridEvents">
      <template #title_edit="{ row }">
        <vxe-input v-model="row.title" />
      </template>
      <template #content_edit="{ row }">
        <vxe-input v-model="row.content" />
      </template>
    </vxe-grid>
  </el-card>
</template>
