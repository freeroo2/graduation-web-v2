import { http } from "../utils/http";

// 获取所有公告
export const getNotices = (params: object): resultType => {
  return http.request("get", "/notices", { params: params });
};
// 获取公告详情
export const getNoticeDetail = (params: object): resultType => {
  return http.request("get", "/noticeDetail", { params: params });
};
// 编辑公告
export const NoticeEdit = (data: object): resultType => {
  return http.request("post", "/notice/edit", { data: data });
};
// 新建公告
export const NoticeCreate = (data: object): resultType => {
  return http.request("post", "/notice/create", { data: data });
};
// 批量删除所选公告
export const NoticesDelete = (params: object): resultType => {
  return http.request("get", "/notice/deleteList", { params: params });
};
// 查找公告
export const findNotices = (params: object): resultType => {
  return http.request("get", "/notice/find", { params: params });
};
// 获取所有公告，返回为列表形式，不分页
export const getNoticesList = (): resultType => {
  return http.request("get", "/notice/list");
};
