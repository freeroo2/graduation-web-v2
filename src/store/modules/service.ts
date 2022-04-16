import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  findServices,
  createService,
  editService,
  deleteService,
  findServicesWithCid
} from "/@/api/service";
import { useRoleStoreHook } from "./role";
import { storageSession } from "/@/utils/storage";
export const useServiceStore = defineStore({
  id: "pure-service",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: []
  }),
  actions: {
    // 查找用户姓名对应所有隔离服务记录
    async FIND_SERVICES(params: object) {
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
              findServicesWithCid(param).then(res => {
                this.pageData = res?.data?.records;
                this.total = res?.data?.total;
                resolve();
              });
            } else if (Number(role) === 2) {
              // 若为超级管理员，则获取所有用户
              findServices(params).then(res => {
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
    // 添加隔离服务记录
    async SERVICE_CREATE(data: object) {
      return new Promise<void>((resolve, reject) => {
        createService(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 编辑隔离服务记录
    async SERVICE_EDIT(data: object) {
      return new Promise<void>((resolve, reject) => {
        editService(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 删除隔离服务记录
    async DELETE_SERVICE(param: object) {
      return new Promise<void>((resolve, reject) => {
        deleteService(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useServiceStoreHook() {
  return useServiceStore(store);
}
