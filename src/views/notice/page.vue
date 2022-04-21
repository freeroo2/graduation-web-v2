<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import {
  VxeGridProps,
  VxeGridEvents,
  VxeGridListeners,
  VxeTablePropTypes,
  VxeFormEvents,
  VXETable,
  VxeGridInstance,
  VxePagerEvents
} from "vxe-table";
import router from "/@/router";
import { useNoticeStoreHook } from "/@/store/modules/notice";
import { storageSession } from "/@/utils/storage";
import editor from "/@/components/ReEditor/Editor.vue";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { useRoute } from "vue-router";
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
    const route = useRoute();
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
      formConfig: {
        items: [
          {
            field: "title",
            title: "标题",
            itemRender: {},
            slots: { default: "title_item" }
          },
          { itemRender: {}, slots: { default: "submit_item" } }
        ]
      },
      toolbarConfig: {
        custom: true,
        enabled:
          storageSession.getItem("role").role == 1 ||
          storageSession.getItem("role").role == 2,
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
        form: true,
        props: {
          result: "result",
          total: "total"
        },
        ajax: {
          // 接收 Promise
          query: ({ form }) => {
            return new Promise(resolve => {
              let search = form.title === null ? "" : form.title;
              let params = reactive({
                pageSize: tablePage.pageSize,
                currentPage: tablePage.currentPage,
                search: search
              });
              noticeStore.FIND_NOTICES(params).then(() => {
                console.log(
                  "%c [ noticeStore.pageData ]-141",
                  "font-size:13px; background:pink; color:#bf2c9f;",
                  noticeStore.pageData
                );
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
              let deleteIds = [] as any[];
              for (let i = 0; i < checkboxData.selectRecords.length; i++) {
                deleteIds.push(checkboxData.selectRecords[i].id);
              }
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
        {
          type: "checkbox",
          width: 50,
          visible:
            storageSession.getItem("role").role == 1 ||
            storageSession.getItem("role").role == 2
        },
        { type: "seq", width: 60 },
        {
          field: "id",
          title: "ID",
          width: 60,
          visible:
            storageSession.getItem("role").role == 1 ||
            storageSession.getItem("role").role == 2
        },
        {
          field: "type",
          title: "通告类型",
          width: 150,
          slots: {
            default: "type_default"
          }
        },
        {
          field: "title",
          title: "标题"
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
          slots: { edit: "content_edit" },
          visible: false
        },
        {
          field: "pubTime",
          title: "发布时间",
          width: 160,
          sortable: true
        }
      ]
    });
    const formDemo = reactive({
      loading: false,
      createFlag: false,
      formData: {
        title: "",
        content: "",
        type: null
      },
      formRules: {
        title: [
          { required: true, message: "请输入标题" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符"
          }
        ],
        type: [{ required: true, message: "请选择类别" }],
        content: [{ required: true, message: "请输入内容" }]
      }
    });
    const findList = () => {
      let page = reactive({
        pageSize: tablePage.pageSize,
        currentPage: tablePage.currentPage
      });
      noticeStore.GET_NOTICES(page).then((res: any) => {
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
          //noticeStore.detailData = row;
          useMultiTagsStoreHook().handleTags("push", {
            path: `/notice/detail`,
            parentPath: route.matched[0].path,
            name: "noticeDetail",
            query: { id: row.id },
            meta: {
              title: `详情信息`,
              showLink: false
              //dynamicLevel: 3
            }
          });
          //router.push({ path: `/notice/detail/${row.id}` });
          router.push({ name: "noticeDetail", query: { id: row.id } });
        }
      },
      toolbarButtonClick(button) {
        // console.log(
        //   "%c [ button ]-175",
        //   "font-size:13px; background:pink; color:#bf2c9f;",
        //   button
        // );
        if (button.code === "my_add_button") {
          formDemo.createFlag = true;
        }
      }
    };
    function submitEvent() {
      console.log("submit!");
      formDemo.loading = true;
      console.log(
        "%c [ formDemo.formData ]-299",
        "font-size:13px; background:pink; color:#bf2c9f;",
        formDemo.formData
      );
      noticeStore.NOTICE_CREATE(formDemo.formData).then(() => {
        findList();
        formDemo.loading = false;
        VXETable.modal.message({ content: "保存成功", status: "success" });
        formDemo.createFlag = false;
        formDemo.formData.content = "";
        formDemo.formData.title = "";
        formDemo.formData.type = null;
      });
    }
    const resetEvent: VxeFormEvents.Reset = () => {
      getWangEditorValue("");
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
      findList();
    };

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
      checkboxChangeEvent,
      formatType
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
        align="center"
      >
        <template #title_item="{ data }">
          <vxe-input
            v-model="data.title"
            type="text"
            placeholder="请输入标题关键字"
          />
        </template>
        <template #submit_item>
          <vxe-button type="submit" status="primary" content="查询" />
        </template>
        <template #content_edit="{ row }">
          <vxe-input v-model="row.content" />
        </template>
        <template #type_default="{ row }">
          <div
            :style="{
              color: `${
                row.type == 0
                  ? '#FF6B6B'
                  : row.type == 1
                  ? '#FFB319'
                  : '#6BCB77'
              }`
            }"
          >
            {{ formatType(row.type) }}
          </div>
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
          :rules="formDemo.formRules"
          @submit="submitEvent"
          align="left"
          custom-layout
        >
          <vxe-form-item
            title="标题"
            field="title"
            :item-render="{}"
            :title-prefix="{ message: '标题', icon: 'fa fa-edit' }"
            style="width: 500px"
            span="24"
          >
            <template #default="{ data }">
              <vxe-input
                v-model="data.title"
                placeholder="请输入标题"
                clearable
              />
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="类别"
            field="type"
            :span="24"
            :item-render="{}"
            :title-prefix="{ message: '类别', icon: 'fa fa-edit' }"
          >
            <template #default="{ data }">
              <el-select
                v-model="data.type"
                placeholder="请选择类别"
                align="center"
              >
                <el-option :key="0" label="疫情通告" :value="0" />
                <el-option :key="1" label="疫苗接种通告" :value="1" /><el-option
                  :key="2"
                  label="疫苗存量通告"
                  :value="2"
                />
              </el-select>
            </template>
          </vxe-form-item>
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
          <vxe-form-item align="center" style="width: 100%">
            <template #default>
              <vxe-button type="submit" status="primary" content="确认" />
            </template>
          </vxe-form-item>
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
</style>
