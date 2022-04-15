<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, reactive, ref } from "vue";
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
import { useRoleStoreHook } from "/@/store/modules/role";
import { useUserStoreHook } from "/@/store/modules/user";
import { storageSession } from "/@/utils/storage";
import resident2 from "/@/assets/resident2.png";
export default defineComponent({
  name: "residentList",
  setup() {
    const residentImg = ref(resident2);
    const showDetails = ref(false);
    const xGrid = ref({} as VxeGridInstance);
    const ruleFormRef = ref(null);
    const selectCourtVisible = ref(false);
    const selectCourtDisable = ref(false);
    onMounted(() => {
      // 当前用户为管理员
      if (Number(useRoleStoreHook().role) === 1) {
        selectCourtDisable.value = true;
        selectCourtVisible.value = false;
      } else if (Number(useRoleStoreHook().role) === 2) {
        selectCourtDisable.value = false;
        selectCourtVisible.value = true;
      }
    });
    console.log(
      "%c [ selectCourtVisible.value ]-32",
      "font-size:13px; background:pink; color:#bf2c9f;",
      selectCourtVisible.value
    );
    const checkboxData = reactive({
      selectRecords: ref([] as any[]),
      isAllChecked: false,
      isIndeterminate: false
    });
    const sexList = ref([
      { $value: 1, $label: "男" },
      { $value: 2, $label: "女" }
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
              userStore.FIND_RESIDENTS(params).then(() => {
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
          field: "gender",
          title: "性别",
          width: 100,
          editRender: {},
          slots: { default: "gender_default", edit: "gender_edit" }
        },
        {
          field: "age",
          title: "年龄",
          width: 100,
          editRender: {},
          slots: { edit: "age_edit" }
        },
        {
          field: "phone",
          title: "电话",
          width: 150,
          editRender: {},
          slots: { edit: "phone_edit" }
        },
        {
          field: "address",
          title: "地址",
          width: 200,
          editRender: {},
          slots: { edit: "address_edit" }
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
        // username: null,
        // password: null,
        // checkPassword: null,
        // nickName: null,
        // cid: null,
        // court: null,
        // age: null,
        // gender: null,
        // phone: null,
        // address: null
        username: "ttest",
        password: "123456",
        checkPassword: "123456",
        nickName: "null1",
        cid: 1,
        court: "null111",
        age: 10,
        gender: 1,
        phone: "12345678911",
        address: "null111"
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
              visible: selectCourtVisible.value,
              span: 24,
              itemRender: {
                name: "$select",
                optionProps: {
                  options: [
                    {
                      label: "选择小区",
                      value: 1
                    }
                  ]
                },
                defaultValue: storageSession.getItem("info").cid,
                props: { placeholder: "请再次输入密码" }
              }
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
          console.log(
            "%c [ row ]-491",
            "font-size:13px; background:pink; color:#bf2c9f;",
            row
          );
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
    const resetKey = async (row: any) => {
      const type = await VXETable.modal.confirm("您确定要重置其密码?");
      const $grid = xGrid.value;
      if ($grid) {
        if (type === "confirm") {
          await $grid.remove(row).then(() => {
            row.role = 0;
            userStore.RESET_KEY({ id: row.id }).then(() => {
              VXETable.modal.message({
                content: "重置成功！",
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
      editRowEvent,
      saveRowEvent,
      removeRowEvent,
      ruleFormRef,
      resetKey,
      residentImg
    };
  }
});
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="font-medium">居民信息 </span>
        </div>
      </template>
      <el-row :gutter="24" style="margin: 20px">
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
          style="margin-bottom: 20px"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 200
            }
          }"
        >
          <div style="margin-top: 50px">
            <span>
              面对复杂的疫情形势，把病毒阻挡在社区门外，守护好居民健康安全，解决好居民生活需求，是我们社区的一线防疫人员坚守岗位的共同信念。
              <br /><br />
              劝导居民戴口罩、勤洗手、不聚集，做好个人防护。测温、扫码、戴口罩等各项疫情防控工作落细到位。</span
            >
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
          style="margin-bottom: 20px"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 200
            }
          }"
        >
          <img :src="residentImg" class="IMG" /> </el-col
      ></el-row>
      <el-row :gutter="24" style="margin: 20px">
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="24"
          style="margin-bottom: 20px"
          v-motion
          :initial="{
            opacity: 0,
            y: 100
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              delay: 200
            }
          }"
          ><el-card style="height: auto; width: auto" shadow="never">
            <template #header>
              <span style="font-size: 16px; font-weight: 500">居民列表</span>
            </template>
            <div style="text-align: center">
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
                align="center"
                height="800px"
                max-height="800px"
              >
                <template #name_item="{ data }">
                  <vxe-input
                    v-model="data.nickName"
                    type="text"
                    placeholder="请输入姓名"
                  />
                </template>
                <template #age_edit="{ row }">
                  <vxe-input
                    v-model="row.age"
                    type="number"
                    placeholder="请输入年龄"
                  />
                </template>
                <template #address_edit="{ row }">
                  <vxe-input
                    v-model="row.address"
                    type="text"
                    placeholder="请输入地址"
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
                    icon="fa fa-key"
                    title="重置密码"
                    circle
                    @click="resetKey(row)"
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
                  {{ formatSex(row.gender) }}
                </template>
                <template #gender_edit="{ row }">
                  <vxe-select
                    v-model="row.gender"
                    style="width: 80%; margin: 0 auto"
                  >
                    <vxe-option
                      v-for="item in sexList"
                      :key="item.$value"
                      :value="item.$value"
                      :label="`${item.$label}`"
                    />
                  </vxe-select>
                </template>
                <template #phone_edit="{ row }">
                  <vxe-input
                    v-model="row.phone"
                    type="text"
                    placeholder="请输入电话号码"
                  />
                </template>
              </vxe-grid>
            </div>
          </el-card> </el-col
      ></el-row>
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
        <!-- <template #myregion="{ data }">
          <vxe-select
            v-model="data.cid"
            visible="selectCourtVisible.value"
            placeholder="请选择小区"
          />
        </template> -->
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
.IMG {
  width: 80%;
  height: auto;
  display: block;
  margin: 0 10% 0 10;
  margin-left: auto;
}
</style>
