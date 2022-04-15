import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  getNotCheckedToday,
  getNotCheckedTodayWithCid,
  findDailys,
  createDaily,
  editDaily,
  dailyDelete
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
    notChecked: []
  }),
  actions: {
    // 查找用户姓名对应所有pcr检测记录
    async FIND_DAILYS(params: object) {
      return new Promise<void>((resolve, reject) => {
        findDailys(params)
          .then((res: any) => {
            if (res) {
              this.pageData = res?.data?.records;
              this.total = res?.data?.total;
            }
            console.log(
              "%c [ res ]-44",
              "font-size:13px; background:pink; color:#bf2c9f;",
              res
            );
            resolve(res);
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
    }
  }
});

export function useDailyStoreHook() {
  return useDailyStore(store);
}
