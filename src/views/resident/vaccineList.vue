<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import {
  VxeGridProps,
  VxeGridListeners,
  VXETable,
  VxeGridInstance,
  VxePagerEvents
} from "vxe-table";
import manager1 from "/@/assets/manager1.png";
import { useVaccineStoreHook } from "/@/store/modules/vaccine";
export default defineComponent({
  name: "vaccineList",
  setup() {
    const managerImg = manager1;
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
    const shortcuts = [
      {
        text: "今天",
        value: new Date()
      },
      {
        text: "昨天",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        }
      },
      {
        text: "一周前",
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return date;
        }
      }
    ];
    const vaccineStore = useVaccineStoreHook();
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
        total: vaccineStore.total
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
        buttons: [],
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
              vaccineStore.FIND_VACCINE_RECORDS(params).then(() => {
                resolve({
                  result: vaccineStore.pageData,
                  total: vaccineStore.total
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
          width: 60,
          sortable: true
        },
        {
          title: "个人信息",
          children: [
            {
              field: "nickName",
              title: "姓名",
              width: 80,
              sortable: true
            },
            {
              field: "gender",
              title: "性别",
              width: 50,
              slots: { default: "gender_default" }
            },
            {
              field: "age",
              title: "年龄",
              width: 50
            },
            {
              field: "phone",
              title: "电话",
              width: 100
            },
            {
              field: "address",
              title: "地址",
              width: 200
            }
          ]
        },
        {
          field: "vid",
          title: "疫苗种类",
          editRender: {},
          slots: { default: "type_default", edit: "type_edit" },
          width: 150,
          sortable: true
        },
        {
          field: "vaccineTime",
          title: "接种日期",
          width: 120,
          editRender: {},
          slots: { edit: "vaccineTime_edit" },
          sortable: true
        },
        {
          field: "mydescription",
          title: "备注",
          width: 200,
          editRender: {},
          slots: { edit: "mydescription_edit" }
        },
        {
          title: "操作",
          width: 150,
          slots: { default: "operate" },
          fixed: "right"
        }
      ]
    });
    const formDemo = reactive({
      loading: false,
      createFlag: false
    });
    const findList = () => {
      // 刷新表格
      xGrid.value.commitProxy("query");
    };
    const gridEvents: VxeGridListeners = {
      toolbarButtonClick(button) {
        // console.log(
        //   "%c [ button ]-175",
        //   "font-size:13px; background:pink; color:#bf2c9f;",
        //   button
        // );
        if (button.code === "my_add_button") {
          //formDemo.createFlag = true;
        }
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
    // 采样方式格式化显示
    const formatType = (value: any) => {
      if (value === true) {
        return "口咽拭子";
      } else {
        return "鼻咽拭子";
      }
    };
    // 角色格式化显示
    const formatGender = (value: any) => {
      if (value === 1) {
        return "男";
      } else if (value === 2) {
        return "女";
      } else return "未知";
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
        vaccineStore.EDIT_VACCINE_RECORD(row).then(() => {
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
            vaccineStore.DELETE_VACCINE_RECORD({ id: row.id }).then(() => {
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
    onMounted(() => {
      vaccineStore.GET_VACCINES();
    });
    return {
      showDetails,
      formDemo,
      gridOptions,
      gridEvents,
      xGrid,
      handlePageChange,
      tablePage,
      checkboxData,
      sexList,
      formatType,
      formatGender,
      editRowEvent,
      saveRowEvent,
      removeRowEvent,
      ruleFormRef,
      managerImg,
      shortcuts,
      vaccineStore
    };
  }
});
</script>

<template>
  <div>
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
        ><el-card style="height: auto; width: 100%" shadow="never">
          <div style="text-align: center">
            <vxe-grid
              v-bind="gridOptions"
              ref="xGrid"
              show-overflow="ellipsis"
              v-on="gridEvents"
              :total="tablePage.total"
              v-model:current-page="tablePage.currentPage"
              v-model:page-size="tablePage.pageSize"
              @page-change="handlePageChange"
              class="mytable"
              align="center"
            >
              <template #name_item="{ data }">
                <vxe-input
                  v-model="data.nickName"
                  type="text"
                  placeholder="请输入姓名"
                />
              </template>
              <template #type_edit="{ row }">
                <vxe-select
                  v-model="row.vid"
                  style="width: auto; margin: 0 auto"
                >
                  <vxe-option
                    v-for="item in vaccineStore.vaccines"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </vxe-select>
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
                  icon="fa fa-trash"
                  title="删除"
                  circle
                  @click="removeRowEvent(row)"
                />
              </template>
              <template #type_default="{ row }">
                {{
                  vaccineStore.vaccines.find(item => item.id === row.vid)
                    ?.name
                }}
              </template>
              <template #gender_default="{ row }">
                {{ formatGender(row.gender) }}
              </template>
              <template #mydescription_edit="{ row }">
                <vxe-input
                  v-model="row.mydescription"
                  type="text"
                  placeholder="请输入备注"
                />
              </template>
              <template #vaccineTime_edit="{ row }">
                <el-date-picker
                  v-model="row.vaccineTime"
                  type="datetime"
                  placeholder="请选择时间"
                  :shortcuts="shortcuts"
                  format="YYYY-MM-DD hh:mm:ss"
                  value-format="YYYY-MM-DD hh:mm:ss"
                  style="width: auto; margin: 0 auto"
                />
              </template>
            </vxe-grid>
          </div>
        </el-card> </el-col
    ></el-row>
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
.mytable {
  width: 100%;
  margin: "0 auto";
  align: "center";
  height: "1000px";
}
.mytable ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/*滚动条的轨道*/
.mytable ::-webkit-scrollbar-track {
  background-color: #ffffff;
}
/*滚动条里面的小方块，能向上向下移动*/
.mytable ::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.mytable ::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
.mytable ::-webkit-scrollbar-thumb:active {
  background-color: #787878;
}
/*边角，即两个滚动条的交汇处*/
.mytable ::-webkit-scrollbar-corner {
  background-color: #ffffff;
}
</style>
