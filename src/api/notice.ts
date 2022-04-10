import { detailType } from "../store/modules/types";
import { http } from "../utils/http";

interface noticeType extends Promise<any> {
  code?: number;
  msg?: string;
  data?: object;
}
// 获取所有公告
export const getNotices = (params: object): noticeType => {
  return http.request("get", "/notices", { params: params });
};
// 获取公告详情
export const getNoticeDetail = (params: object): noticeType => {
  return http.request("get", "/noticeDetail", { params: params });
};
// 编辑公告
export const NoticeEdit = (data: object): noticeType => {
  return http.request("post", "/notice/edit", { data: data });
};
// 新建公告
export const NoticeCreate = (data: object): noticeType => {
  return http.request("post", "/notice/create", { data: data });
};
// 批量删除所选公告
export const NoticesDelete = (params: object): noticeType => {
  return http.request("get", "/notice/deleteList", { params: params });
};
