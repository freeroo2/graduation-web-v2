import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  findReports,
  createReport,
  editReport,
  deleteReport,
  findReportsWithCid,
  isChecked,
  findReportsToList
} from "/@/api/report";
import { useRoleStoreHook } from "./role";
import { storageSession } from "/@/utils/storage";
export const useReportStore = defineStore({
  id: "pure-report",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: [],
    myChecks: []
  }),
  actions: {
    // 查找用户姓名对应所有健康上报记录
    async FIND_REPORTS(params: object) {
      return new Promise<void>((resolve, reject) => {
        useRoleStoreHook()
          .GET_CUR_ROLE(storageSession.getItem("info")?.id)
          .then(role => {
            // 若为管理员，则获取当前管理员所在小区的所有用户
            if (Number(role) === 1) {
              const param = {
                ...params,
                cid: storageSession.getItem("info")?.cid
              };
              findReportsWithCid(param).then(res => {
                this.pageData = res?.data?.records;
                this.total = res?.data?.total;
                resolve();
              });
            } else if (Number(role) === 2) {
              // 若为超级管理员，则获取所有用户
              findReports(params).then(res => {
                this.pageData = res?.data?.records;
                this.total = res?.data?.total;
                resolve();
              });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 查找用户姓名对应所有健康上报记录列表，不分页
    async FIND_LIST(params: object) {
      return new Promise<void>((resolve, reject) => {
        findReportsToList(params)
          .then(res => {
            this.myChecks = res?.data;
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 添加健康上报记录
    async REPORT_CREATE(data: object) {
      return new Promise<void>((resolve, reject) => {
        createReport(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 编辑健康上报记录
    async REPORT_EDIT(data: object) {
      return new Promise<void>((resolve, reject) => {
        editReport(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 删除健康上报记录
    async REPORT_DELETE(param: object) {
      return new Promise<void>((resolve, reject) => {
        deleteReport(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 检查用户当天是否已经打卡
    async IS_CHECKED(param: object) {
      return new Promise<void>((resolve, reject) => {
        isChecked(param)
          .then(res => {
            resolve(res?.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useReportStoreHook() {
  return useReportStore(store);
}
