<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import {
  VxeGridProps,
  VxeGridEvents,
  VxeGridListeners,
  VxeTablePropTypes,
  VxeFormEvents,
  VXETable,
  VxeFormPropTypes,
  VxeGridInstance,
  VxePagerEvents
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
    const xGrid = ref({} as VxeGridInstance);
    const checkboxData = reactive({
      selectRecords: ref([] as any[]),
      isAllChecked: false,
      isIndeterminate: false
    });

    const noticeStore = useNoticeStoreHook();
    const tablePage = reactive({
      total: 0,
      currentPage: 1,
      pageSize: 10
    });
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
        total: noticeStore.total
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
              let page = reactive({
                pageSize: tablePage.pageSize,
                currentPage: tablePage.currentPage
              });
              noticeStore.GET_NOTICES(page).then(() => {
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
              console.log(
                "%c [ xGrid.value.getCheckboxRecords() ]-126",
                "font-size:13px; background:pink; color:#bf2c9f;",
                //xGrid.value.getCheckboxRecords()
                checkboxData.selectRecords
              );
              let deleteIds = [] as any[];
              for (let i = 0; i < checkboxData.selectRecords.length; i++) {
                deleteIds.push(checkboxData.selectRecords[i].id);
              }
              // let param = reactive({
              //   ids: deleteIds
              // });
              noticeStore.DELETE_NOTICES({ ids: deleteIds }).then(() => {
                resolve(xGrid.value.getRecordset().removeRecords);
              });
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
      },
      formRules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            min: 2,
            max: 200,
            message: "长度在 2 到 200 个字符",
            trigger: "blur"
          }
        ]
      }
    });
    const findList = () => {
      let page = reactive({
        pageSize: tablePage.pageSize,
        currentPage: tablePage.currentPage
      });
      noticeStore.GET_NOTICES(page).then((res: any) => {
        console.log(
          "%c [ res ]-203",
          "font-size:13px; background:pink; color:#bf2c9f;",
          res
        );
        // 刷新表格
        xGrid.value.commitProxy("query");
      });
    };
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
      await noticeStore.NOTICE_CREATE(formDemo.formData).then(() => {
        findList();
        formDemo.loading = false;
        VXETable.modal.message({ content: "保存成功", status: "success" });
        formDemo.createFlag = false;
      });
    };
    const resetEvent: VxeFormEvents.Reset = () => {
      VXETable.modal.message({ content: "重置事件", status: "info" });
      formDemo.formData.content = "";
      formDemo.formData.title = "";
    };
    // 复选框触发
    const checkboxChangeEvent = () => {
      const $grid = xGrid.value;
      checkboxData.isAllChecked = $grid.isAllCheckboxChecked();
      checkboxData.isIndeterminate = $grid.isAllCheckboxIndeterminate();
      checkboxData.selectRecords = $grid.getCheckboxRecords();
    };
    function getWangEditorValue(str: string) {
      formDemo.formData.content = str;
    }
    // 分页插件翻页触发
    const handlePageChange: VxePagerEvents.PageChange = ({
      currentPage,
      pageSize
    }) => {
      tablePage.currentPage = currentPage;
      tablePage.pageSize = pageSize;
      console.log(
        "%c [ tablePage ]-258",
        "font-size:13px; background:pink; color:#bf2c9f;",
        tablePage
      );
      findList();
    };

    return {
      showDetails,
      formDemo,
      gridOptions,
      editDisabledEvent,
      cellClassName,
      gridEvents,
      submitEvent,
      resetEvent,
      getWangEditorValue,
      xGrid,
      handlePageChange,
      tablePage,
      checkboxData,
      checkboxChangeEvent
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
        ref="xGrid"
        show-overflow="ellipsis"
        v-on="gridEvents"
        :cell-class-name="cellClassName"
        :total="tablePage.total"
        v-model:current-page="tablePage.currentPage"
        v-model:page-size="tablePage.pageSize"
        @page-change="handlePageChange"
        @checkbox-change="checkboxChangeEvent"
        @checkbox-all="checkboxChangeEvent"
      >
        <template #title_edit="{ row }">
          <vxe-input v-model="row.title" />
        </template>
        <template #content_edit="{ row }">
          <vxe-input v-model="row.content" />
        </template>
        <!-- <template #pager>
          <vxe-pager
            :layouts="[
              'Sizes',
              'PrevJump',
              'PrevPage',
              'Number',
              'NextPage',
              'NextJump',
              'FullJump',
              'Total'
            ]"
            v-model:current-page="tablePage.currentPage"
            v-model:page-size="tablePage.pageSize"
            :total="tablePage.total"
            @page-change="handlePageChange"
          />
        </template> -->
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
          :rules="formDemo.formRules"
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
