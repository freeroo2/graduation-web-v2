import { defineStore } from "pinia";
import { store } from "/@/store";
import {
  getNoticeDetail,
  getNotices,
  NoticeEdit,
  NoticeCreate,
  NoticesDelete,
  findNotices
} from "/@/api/notice";
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
    async GET_NOTICES(params) {
      return new Promise<void>((resolve, reject) => {
        // const params = {
        //   currentPage: param.currentPage,
        //   pageSize: param.pageSize
        // };
        getNotices(params)
          .then((res: any) => {
            if (res) {
              this.pageData = res?.data?.records;
              this.total = res?.data?.total;
            }
            // console.log(
            //   "%c [ res ]-44",
            //   "font-size:13px; background:pink; color:#bf2c9f;",
            //   res
            // );
            resolve(res);
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
    NOTICE_EDIT(data: object) {
      return new Promise<void>((resolve, reject) => {
        NoticeEdit(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    NOTICE_CREATE(data: object) {
      return new Promise<void>((resolve, reject) => {
        NoticeCreate(data)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    DELETE_NOTICES(param: object) {
      return new Promise<void>((resolve, reject) => {
        NoticesDelete(param)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    FIND_NOTICES(params: object) {
      return new Promise<void>((resolve, reject) => {
        findNotices(params)
          .then((res: any) => {
            if (res) {
              this.pageData = res?.data?.records;
              this.total = res?.data?.total;
            }
            // console.log(
            //   "%c [ res ]-44",
            //   "font-size:13px; background:pink; color:#bf2c9f;",
            //   res
            // );
            resolve(res);
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
