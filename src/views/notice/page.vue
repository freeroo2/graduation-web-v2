<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import {
  VxeGridProps,
  VxeGridEvents,
  VxeGridListeners,
  VxeTablePropTypes,
  VxeFormEvents,
  VXETable
} from "vxe-table";
import router from "/@/router";
import { useNoticeStoreHook } from "/@/store/modules/notice";
import { storageSession } from "/@/utils/storage";
import editor from "/@/components/ReEditor/Editor.vue";
export default defineComponent({
  name: "noticePage",
  components: {
    editor
  },
  setup() {
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
        custom: true,
        // slots: {
        //   buttons: "add_button"
        // },
        buttons: [
          {
            // code: "insert_actived",
            code: "my_add_button",
            name: "新增",
            status: "perfect",
            icon: "fa fa-plus"
          },
          {
            code: "delete",
            name: "删除",
            status: "perfect",
            icon: "fa fa-trash-o"
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
          type: "html",
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
    const formDemo = reactive({
      loading: false,
      createFlag: false,
      formData: {
        title: "",
        content: ""
      }
    });
    const editDisabledEvent: VxeGridEvents.EditDisabled = () => {
      console.log("禁止编辑");
    };
    const cellClassName: VxeTablePropTypes.CellClassName = ({ column }) => {
      if (column.field === "title") {
        return "col-red";
      }
      return null;
    };
    const gridEvents: VxeGridListeners = {
      cellClick({ column, row }) {
        if (column.field === "title") {
          showDetails.value = true;
          noticeStore.detailData = row;
          router.push({ path: `/notice/detail/${row.id}` });
        }
      },
      toolbarButtonClick(button) {
        console.log(
          "%c [ button ]-175",
          "font-size:13px; background:pink; color:#bf2c9f;",
          button
        );
        if (button.code === "my_add_button") {
          formDemo.createFlag = true;
        }
      }
    };
    const submitEvent = async () => {
      console.log("submit!");
      formDemo.loading = true;
      setTimeout(() => {
        formDemo.loading = false;
        VXETable.modal.message({ content: "保存成功", status: "success" });
      }, 1000);

      formDemo.createFlag = false;
    };
    const resetEvent: VxeFormEvents.Reset = () => {
      VXETable.modal.message({ content: "重置事件", status: "info" });
    };
    function getWangEditorValue(str: string) {
      formDemo.formData.content = str;
    }
    return {
      showDetails,
      formDemo,
      gridOptions,
      editDisabledEvent,
      cellClassName,
      gridEvents,
      submitEvent,
      resetEvent,
      getWangEditorValue
    };
  }
});
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="font-medium">通告信息 </span>
        </div>
      </template>
      <vxe-grid
        v-bind="gridOptions"
        show-overflow="ellipsis"
        v-on="gridEvents"
        :cell-class-name="cellClassName"
      >
        <template #title_edit="{ row }">
          <vxe-input v-model="row.title" />
        </template>
        <template #content_edit="{ row }">
          <vxe-input v-model="row.content" />
        </template>
      </vxe-grid>
    </el-card>
    <vxe-modal
      v-model="formDemo.createFlag"
      id="myModal"
      width="800"
      height="600"
      min-width="460"
      min-height="320"
      show-zoom
      resize
      remember
      storage
      transfer
    >
      <template #title>
        <span>新建公告</span>
      </template>
      <template #default>
        <vxe-form
          :data="formDemo.formData"
          @submit="submitEvent"
          @reset="resetEvent"
          title-width="80"
          align="left"
          custom-layout
        >
          <div class="parent">
            <div class="div1">
              <vxe-form-item
                title="标题"
                field="title"
                style="width: 95%"
                :item-render="{}"
                :title-prefix="{ message: '标题', icon: 'fa fa-edit' }"
              >
                <template #default="{ data }">
                  <vxe-input
                    v-model="data.title"
                    placeholder="请输入标题"
                    clearable
                  />
                </template>
              </vxe-form-item>
            </div>
            <div class="div2">
              <vxe-form-item
                title="内容"
                field="content"
                style="width: 95%"
                :item-render="{}"
                :title-prefix="{ message: '内容', icon: 'fa fa-edit' }"
              >
                <template #default="{ data }">
                  <editor
                    :contentHtml="data.content"
                    v-on:getWangEditorValue="getWangEditorValue"
                  />
                </template>
              </vxe-form-item>
            </div>
            <div class="div3">
              <vxe-form-item align="center" style="width: 100%">
                <template #default>
                  <vxe-button type="submit" status="primary" content="确认" />
                  <vxe-button type="reset" content="重置" />
                </template>
              </vxe-form-item>
            </div>
          </div>
        </vxe-form>
      </template>
    </vxe-modal>
  </div>
</template>

<style lang="scss">
.col-red {
  cursor: pointer;
  color: rgb(12, 67, 169);
  text-decoration: underline;
}
.parent {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.5fr 3fr 0.5fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;
}
.div2 {
  grid-area: 2 / 1 / 3 / 2;
}
.div3 {
  grid-area: 3 / 1 / 4 / 2;
}
.preview {
  margin-top: 50px;
}
</style>
