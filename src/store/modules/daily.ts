import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  getNotCheckedToday,
  getNotCheckedTodayWithCid,
  findDailys,
  createDaily,
  editDaily,
  dailyDelete,
  findDailysWithCid,
  getAllQuarantine,
  getAllQuarantineWithCid
} from "/@/api/daily";
import { useRoleStoreHook } from "./role";
import { storageSession } from "/@/utils/storage";
export const useDailyStore = defineStore({
  id: "pure-daily",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: [],
    notChecked: [],
    allQuarantine: []
  }),
  actions: {
    // 查找用户姓名对应所有隔离检查记录
    async FIND_DAILYS(params: object) {
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
              findDailysWithCid(param).then(res => {
                this.pageData = res?.data?.records;
                this.total = res?.data?.total;
                resolve();
              });
            } else if (Number(role) === 2) {
              // 若为超级管理员，则获取所有用户
              findDailys(params).then(res => {
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
    // 添加隔离检查记录
    async DAILY_CREATE(data: object) {
      return new Promise<void>((resolve, reject) => {
        createDaily(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 编辑隔离检查记录
    async DAILY_EDIT(data: object) {
      return new Promise<void>((resolve, reject) => {
        editDaily(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 删除隔离检查记录
    async DELETE_DAILY(param: object) {
      return new Promise<void>((resolve, reject) => {
        dailyDelete(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取当前管理员所在小区的所有隔离中但今天未检查的用户，返回为一个列表，不分页，若为超管，则获取所有小区的
    async GET_NOT_CHECKED_TODAY() {
      return new Promise<any[]>((resolve, reject) => {
        useRoleStoreHook()
          .GET_CUR_ROLE(storageSession.getItem("info")?.id)
          .then(role => {
            const params = {
              cid: storageSession.getItem("info")?.cid
            };
            // 若为管理员
            if (Number(role) === 1) {
              getNotCheckedTodayWithCid(params).then(res => {
                this.notChecked = res?.data;
                resolve(res?.data);
              });
            } else if (Number(role) === 2) {
              // 若为超级管理员
              getNotCheckedToday().then(res => {
                this.notChecked = res?.data;
                resolve(res?.data);
              });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取当前管理员所在小区的所有隔离中的用户，返回为一个列表，不分页，若为超管，则获取所有小区的
    async GET_ALL_QUARANTINE() {
      return new Promise<any[]>((resolve, reject) => {
        useRoleStoreHook()
          .GET_CUR_ROLE(storageSession.getItem("info")?.id)
          .then(role => {
            const params = {
              cid: storageSession.getItem("info")?.cid
            };
            // 若为管理员
            if (Number(role) === 1) {
              getAllQuarantineWithCid(params).then(res => {
                this.allQuarantine = res?.data;
                resolve(res?.data);
              });
            } else if (Number(role) === 2) {
              // 若为超级管理员
              getAllQuarantine().then(res => {
                this.allQuarantine = res?.data;
                resolve(res?.data);
              });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useDailyStoreHook() {
  return useDailyStore(store);
}
