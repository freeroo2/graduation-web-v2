import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  findBacks,
  createBack,
  editBack,
  deleteBack,
  findBacksWithCid,
  findBacksToList,
  queryBackToday
} from "/@/api/back";
import { useRoleStoreHook } from "./role";
import { storageSession } from "/@/utils/storage";
export const useBackStore = defineStore({
  id: "pure-back",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: [],
    myChecks: [],
    backNum: null
  }),
  actions: {
    // 查找用户姓名对应所有健康上报记录
    async FIND_BACKS(params: object) {
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
              findBacksWithCid(param).then(res => {
                this.pageData = res?.data?.records;
                this.total = res?.data?.total;
                resolve();
              });
            } else if (Number(role) === 2) {
              // 若为超级管理员，则获取所有用户
              findBacks(params).then(res => {
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
        findBacksToList(params)
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
    async BACK_CREATE(data: object) {
      return new Promise<void>((resolve, reject) => {
        createBack(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 编辑健康上报记录
    async BACK_EDIT(data: object) {
      return new Promise<void>((resolve, reject) => {
        editBack(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 删除健康上报记录
    async BACK_DELETE(param: object) {
      return new Promise<void>((resolve, reject) => {
        deleteBack(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 查询今日返乡人数
    async QUERY_BACKNUM() {
      return new Promise<void>((resolve, reject) => {
        queryBackToday()
          .then((res: any) => {
            this.backNum = res?.data?.backNum;
            console.log(
              "%c [ res?.data?.backNum ]-112",
              "font-size:13px; background:pink; color:#bf2c9f;",
              res
            );
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useBackStoreHook() {
  return useBackStore(store);
}
