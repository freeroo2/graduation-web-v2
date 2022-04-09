import { defineStore } from "pinia";
import { store } from "/@/store";
import { getNoticeDetail, getNotices } from "/@/api/notice";
import { noticeStoreType } from "./types";
export const useNoticeStore = defineStore({
  id: "pure-notice",
  state: (): noticeStoreType => ({
    currentPage: 1,
    total: 10,
    pageSize: 10,
    detailData: null,
    pageData: []
  }),
  actions: {
    SET_CURRENT_PAGE(currentPage) {
      this.currentPage = currentPage;
    },
    SET_TOTAL(total) {
      this.total = total;
    },
    SET_PAGE_SIZE(pageSize) {
      this.pageSize = pageSize;
    },
    SET_DETAIL_DATA(detailData) {
      this.detailData = detailData;
    },
    SET_PAGE_DATA(pageData) {
      this.pageData = pageData;
    },
    async GET_NOTICES() {
      return new Promise<void>((resolve, reject) => {
        const params = {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        };
        getNotices(params)
          .then((res: any) => {
            if (res) {
              this.pageData = res?.data?.records;
              this.total = res?.data?.total;
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GET_NOTICE_DETAIL(id: number) {
      return new Promise<void>((resolve, reject) => {
        const params = {
          id: id
        };
        getNoticeDetail(params)
          .then((res: any) => {
            if (res) {
              this.detailData = res?.data;
              console.log(
                "%c [ res?.data ]-55",
                "font-size:13px; background:pink; color:#bf2c9f;",
                res?.data
              );
            }
            resolve(res.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    resetDetailData() {
      this.detailData = null;
    }
  }
});

export function useNoticeStoreHook() {
  return useNoticeStore(store);
}