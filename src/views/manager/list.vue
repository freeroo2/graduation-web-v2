<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import {
  VxeGridProps,
  VxeGridListeners,
  VxeTablePropTypes,
  VxeFormEvents,
  VXETable,
  VxeGridInstance,
  VxePagerEvents
} from "vxe-table";
import { useNoticeStoreHook } from "/@/store/modules/notice";
import { useUserStoreHook } from "/@/store/modules/user";
import editor from "/@/components/ReEditor/Editor.vue";
export default defineComponent({
  name: "noticePage",
  components: {
    editor
  },
  setup() {
    const showDetails = ref(false);
    const xGrid = ref({} as VxeGridInstance);
    const ruleFormRef = ref(null);
    const checkboxData = reactive({
      selectRecords: ref([] as any[]),
      isAllChecked: false,
      isIndeterminate: false
    });
    const sexList = ref([
      { value: "1", label: "男" },
      { value: "2", label: "女" }
    ]);
    const roleList = ref([
      { value: "0", label: "用户" },
      { value: "1", label: "管理员" },
      { value: "2", label: "超级管理员" }
    ]);

    const noticeStore = useNoticeStoreHook();
    const userStore = useUserStoreHook();
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
        //width: 200
      },
      pagerConfig: {
        perfect: true,
        total: noticeStore.total
      },
      editConfig: {
        trigger: "click",
        mode: "row",
        showStatus: true
        // activeMethod({ columnIndex }) {
        //   // TODO 禁用编辑的逻辑部分，后续待修改
        //   if (storageSession.getItem("info").id > 0) {
        //     return false;
        //   }
        //   return true;
        // }
      },
      formConfig: {
        items: [
          {
            field: "nickName",
            title: "姓名",
            itemRender: {},
            slots: { default: "name_item" }
          },
          { itemRender: {}, slots: { default: "submit_item" } }
        ]
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
              let search = form.nickName === null ? "" : form.nickName;
              let params = reactive({
                pageSize: tablePage.pageSize,
                currentPage: tablePage.currentPage,
                search: search
              });
              userStore.FIND_MANAGERS(params).then(() => {
                resolve({
                  result: userStore.pageData,
                  total: userStore.total
                });
              });
            });
          }
        }
      },
      columns: [
        { type: "seq", width: 60 },
        {
          field: "id",
          title: "ID",
          width: 60
        },
        {
          field: "username",
          title: "用户名"
        },
        {
          field: "nickName",
          title: "姓名",
          editRender: {},
          slots: { edit: "name_edit" },
          width: 150
        },
        {
          field: "role",
          title: "角色",
          slots: { default: "role_default" }
        },
        {
          field: "gender",
          title: "性别",
          width: 100,
          editRender: {},
          slots: { default: "gender_default", edit: "gender_edit" }
        },
        {
          field: "phone",
          title: "电话",
          width: 150,
          editRender: {},
          slots: { edit: "phone_edit" }
        },
        {
          title: "操作",
          width: 200,
          slots: { default: "operate" }
        }
      ]
    });
    const formDemo = reactive({
      loading: false,
      createFlag: false,
      formData: {
        username: null,
        password: null,
        checkPassword: null,
        nickName: null,
        cid: null,
        court: null,
        age: null,
        gender: null,
        phone: null,
        address: null
        // username: "ttest",
        // password: "123456",
        // checkPassword: "123456",
        // nickName: "null1",
        // cid: 1,
        // court: "null111",
        // age: 10,
        // gender: 1,
        // phone: "12345678911",
        // address: "null111"
      },
      formItem: [
        {
          span: 2
        },
        {
          title: "左侧",
          span: 10,
          titleAlign: "center",
          children: [
            {
              field: "username",
              title: "用户名",
              span: 24,
              itemRender: {
                name: "$input",
                props: { placeholder: "请输入用户名" }
              }
            },
            {
              field: "password",
              title: "密码",
              span: 24,
              itemRender: {
                name: "$input",
                props: { placeholder: "请输入密码，至少为6位" }
              }
            },
            {
              field: "checkPassword",
              title: "确认密码",
              span: 24,
              itemRender: {
                name: "$input",
                props: { placeholder: "请再次输入密码" }
              }
            },
            {
              field: "cid",
              title: "小区",
              span: 24,
              slots: { default: "myregion" }
            }
          ]
        },
        {
          title: "右侧",
          span: 10,
          children: [
            {
              field: "nickName",
              title: "姓名",
              span: 24,
              itemRender: {
                name: "$input",
                props: { placeholder: "请输入姓名" }
              }
            },
            {
              field: "gender",
              title: "性别",
              span: 10,
              itemRender: {
                name: "$select",
                options: [
                  { value: "1", label: "男" },
                  { value: "2", label: "女" }
                ],
                props: { placeholder: "请选择性别" }
              }
            },
            {
              field: "age",
              title: "年龄",
              span: 10,
              itemRender: {
                name: "$input",
                props: { type: "number", placeholder: "请输入年龄", min: 0 }
              }
            },
            {
              field: "phone",
              title: "电话",
              span: 24,
              itemRender: {
                name: "$input",
                props: { type: "text", placeholder: "请输入电话" }
              }
            },
            {
              field: "address",
              title: "地址",
              span: 24,
              itemRender: {
                name: "$input",
                props: { type: "text", placeholder: "请输入地址" }
              }
            }
          ]
        },
        {
          align: "center",
          span: 24,
          itemRender: {
            name: "$buttons",
            children: [
              {
                props: {
                  type: "submit",
                  content: "提交",
                  status: "primary"
                }
              },
              { props: { type: "reset", content: "重置" } }
            ]
          }
        },
        {
          span: 2
        }
      ],
      //TODO
      formRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          { min: 2, max: 10, trigger: "blur" }
        ],
        nickName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          },
          {
            min: 2,
            max: 5,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            min: 6,
            message: "请输入密码，至少为6位"
          },
          {
            validator({ itemValue }) {
              if (itemValue === "") {
                return new Error("请输入密码");
              } else {
                if (
                  formDemo.formData.checkPassword !== "" &&
                  formDemo.formData.checkPassword !== null
                ) {
                  if (!ruleFormRef.value) return;
                }
              }
            }
          }
        ],
        checkPassword: [
          {
            required: true,
            trigger: "blur"
          },
          {
            validator({ itemValue }) {
              if (itemValue === "") {
                return new Error("请再次输入密码");
              } else if (itemValue !== formDemo.formData.password) {
                return new Error("两次输入密码不一致!");
              }
            }
          }
        ],
        cid: [
          {
            required: true,
            message: "请选择小区",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址，格式为“小区名+楼栋+门牌号”",
            trigger: "blur"
          }
        ]
      }
    });
    const findList = () => {
      // 刷新表格
      xGrid.value.commitProxy("query");
    };
    // const editDisabledEvent: VxeGridEvents.EditDisabled = () => {
    //   console.log("禁止编辑");
    // };
    const cellClassName: VxeTablePropTypes.CellClassName = ({ column }) => {
      if (column.field === "title") {
        return "col-red";
      }
      return null;
    };
    const gridEvents: VxeGridListeners = {
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
    const submitEvent = async () => {
      console.log("submit!");
      formDemo.loading = true;
      await userStore.MANAGER_CREATE(formDemo.formData).then(() => {
        findList();
        formDemo.loading = false;
        VXETable.modal.message({ content: "创建成功", status: "success" });
        formDemo.createFlag = false;
      });
    };
    const resetEvent: VxeFormEvents.Reset = () => {
      VXETable.modal.message({ content: "重置事件", status: "info" });
      for (let key in formDemo.formData) {
        formDemo.formData[key] = null;
      }
    };
    // 分页插件翻页触发
    const handlePageChange: VxePagerEvents.PageChange = ({
      currentPage,
      pageSize
    }) => {
      tablePage.currentPage = currentPage;
      tablePage.pageSize = pageSize;
      findList();
    };
    // 性别格式化显示
    const formatSex = (value: any) => {
      if (value === 1) {
        return "男";
      }
      if (value === 2) {
        return "女";
      }
      return "未知";
    };
    // 角色格式化显示
    const formatRole = (value: any) => {
      if (value === 1) {
        return "管理员";
      }
      if (value === 2) {
        return "超级管理员";
      }
      return "用户";
    };
    const editRowEvent = (row: any) => {
      const $grid = xGrid.value;
      if ($grid) {
        $grid.setActiveRow(row);
      }
    };

    const saveRowEvent = async (row: any) => {
      const $grid = xGrid.value;
      if ($grid) {
        await $grid.clearActived();
        gridOptions.loading = true;
        userStore.MANAGER_EDIT(row).then(() => {
          gridOptions.loading = false;
          VXETable.modal.message({
            content: "保存成功！",
            status: "success"
          });
          findList();
        });
      }
    };
    const removeRowEvent = async (row: any) => {
      const type = await VXETable.modal.confirm("您确定要删除该数据?");
      const $grid = xGrid.value;
      if ($grid) {
        if (type === "confirm") {
          await $grid.remove(row).then(() => {
            userStore.DELETE_USER({ id: row.id }).then(() => {
              VXETable.modal.message({
                content: "删除成功！",
                status: "success"
              });
              findList();
            });
          });
        }
      }
    };
    const cancleManager = async (row: any) => {
      const type = await VXETable.modal.confirm("您确定要取消管理员身份?");
      const $grid = xGrid.value;
      if ($grid) {
        if (type === "confirm") {
          await $grid.remove(row).then(() => {
            row.role = 0;
            userStore.MANAGER_CANCLE({ id: row.id }).then(() => {
              VXETable.modal.message({
                content: "取消成功！",
                status: "success"
              });
              findList();
            });
          });
        }
      }
    };
    return {
      showDetails,
      formDemo,
      gridOptions,
      //editDisabledEvent,
      cellClassName,
      gridEvents,
      submitEvent,
      resetEvent,
      xGrid,
      handlePageChange,
      tablePage,
      checkboxData,
      sexList,
      formatSex,
      formatRole,
      editRowEvent,
      saveRowEvent,
      removeRowEvent,
      roleList,
      ruleFormRef,
      cancleManager
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
        style="width: 85%; margin: 0 auto"
        align="center"
      >
        <template #name_item="{ data }">
          <vxe-input
            v-model="data.nickName"
            type="text"
            placeholder="请输入姓名"
          />
        </template>
        <template #submit_item>
          <vxe-button type="submit" status="primary" content="查询" />
        </template>
        <template #operate="{ row }">
          <template v-if="xGrid.isActiveByRow(row)">
            <vxe-button
              icon="fa fa-save"
              status="primary"
              title="保存"
              circle
              @click="saveRowEvent(row)"
            />
          </template>
          <template v-else>
            <vxe-button
              icon="fa fa-edit"
              title="编辑"
              circle
              @click="editRowEvent(row)"
            />
          </template>
          <vxe-button
            icon="fa fa-gear"
            title="取消管理员"
            circle
            @click="cancleManager(row)"
          />
          <vxe-button
            icon="fa fa-trash"
            title="删除"
            circle
            @click="removeRowEvent(row)"
          />
        </template>
        <template #name_edit="{ row }">
          <vxe-input v-model="row.nickName" />
        </template>
        <template #gender_default="{ row }">
          <el-tag
            :effect="
              row.gender == 1 ? 'dark' : row.gender == 2 ? 'light' : 'light'
            "
            type="info"
            :color="
              row.gender == 1
                ? '#6FB2D2'
                : row.gender == 2
                ? '#FFEEEE'
                : '#DDDDDD'
            "
            round
            size="large"
            >{{ formatSex(row.gender) }}</el-tag
          >
        </template>
        <template #gender_edit="{ row }">
          <vxe-select
            v-model="row.gender"
            transfer
            style="width: 50%; margin: 0 auto"
          >
            <vxe-option
              v-for="item in sexList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </vxe-select>
        </template>
        <template #role_default="{ row }">
          <span>{{ formatRole(row.role) }}</span>
        </template>
        <template #phone_edit="{ row }">
          <vxe-input
            v-model="row.phone"
            type="text"
            placeholder="请输入电话号码"
          />
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

      <vxe-form
        :data="formDemo.formData"
        :items="formDemo.formItem"
        :rules="formDemo.formRules"
        @submit="submitEvent"
        ref="ruleFormRef"
        align="center"
      >
        <template #myregion="{ data }">
          <vxe-input v-model="data.cid" placeholder="自定义插槽模板" />
        </template>
      </vxe-form>
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
