import { defineStore } from "pinia";
import { store } from "/@/store";
export const useVisitorStore = defineStore({
  id: "pure-visitor",
  state: () => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    visitors: [],
    form: {
      id: null,
      name: "",
      phone: "",
      idcard: "",
      visitedUid: null,
      passFlag: false,
      banDesc: "",
      passDesc: "",
      arriveTime: "",
      pubTime: null
    }
  }),
  actions: {
    // // 创建访客记录
    // createVisitor(data) {
    //   return new Promise((resolve, reject) => {
    //     api
    //       .post("/visitor/create", data)
    //       .then(res => {
    //         resolve(res.data.data);
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    // // 获取所有访客记录
    // visitors() {
    //   return new Promise((resolve, reject) => {
    //     api
    //       .get("/visitor/fetchAll", {
    //         params: {
    //           currentPage: this.currentPage,
    //           pageSize: this.pageSize
    //         }
    //       })
    //       .then(res => {
    //         this.total = res.data.data.total;
    //         this.pageData = res.data.data.records;
    //         resolve(res.data.data.records);
    //         // console.log(res.data.data.records)
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },

    // // 查询访客记录
    // visitorSearch(data) {
    //   return new Promise<void>((resolve, reject) => {
    //     api
    //       .get("/visitor/find", {
    //         params: {
    //           currentPage: this.currentPage,
    //           pageSize: this.pageSize,
    //           search: data
    //         }
    //       })
    //       .then(res => {
    //         this.total = res.data.data.total;
    //         this.pageData = res.data.data.records;
    //         resolve();
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    // // 删除公告
    // visitorDelete(id) {
    //   return new Promise<void>((resolve, reject) => {
    //     api
    //       .get("/visitor/delete", {
    //         params: {
    //           id: id
    //         }
    //       })
    //       .then(() => {
    //         resolve();
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // }
  }
});
export function useVisitorStoreHook() {
  return useVisitorStore(store);
}
