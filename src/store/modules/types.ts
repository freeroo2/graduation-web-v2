import { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Hamburger
    isClickHamburger: boolean;
  };
  layout: string;
  device: string;
};

export type multiType = {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
  query?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  id: number;
  token: string;
  name?: string;
  nickName?: string;
  cid?: number;
  // age?: number;
  // gender?: number;
  // phone?: string;
  // address?: string;
  status?: number;
  currentPage?: number;
  total?: number;
  pageSize?: number;
  detailData?: userDetailType;
  pageData?: object;
};

export type noticeDetailType = {
  id: number;
  uid: number;
  title?: string;
  content?: string;
  pubTime?: string;
  nickName?: string;
};
export type userDetailType = {
  id: number;
  username: string;
  password: string;
  nickName: string;
  age: number;
  gender: number;
  phone: string;
  court: string;
  address: string;
  curStatus: number;
  cid: number;
};

export type noticeStoreType = {
  currentPage: number;
  total: number;
  pageSize?: number;
  detailData?: noticeDetailType;
  pageData?: object;
};
