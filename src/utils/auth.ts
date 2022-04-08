import Cookies from "js-cookie";
import { useUserStoreHook } from "/@/store/modules/user";
import { storageSession } from "/@/utils/storage";

const TokenKey = "authorized-token";

type paramsMapType = {
  account_status: number;
  account_username: string;
  account_nickName: string;
  account_id: number;
  account_cid: number;
  accessToken: string;
  expires: number;
};

// 获取token
export function getToken() {
  // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
  return Cookies.get("authorized-token");
}

// 设置token以及过期时间（cookies、sessionStorage各一份）
// 后端需要将用户信息和token以及过期时间都返回给前端，过期时间主要用于刷新token
export function setToken(data) {
  const {
    account_status,
    account_username,
    account_nickName,
    account_id,
    account_cid,
    accessToken,
    expires
  } = data;
  // 提取关键信息进行存储
  const paramsMap: paramsMapType = {
    account_status,
    account_username,
    account_nickName,
    account_id,
    account_cid,
    accessToken,
    expires: Date.now() + parseInt(expires)
  };
  const dataString = JSON.stringify(paramsMap);
  useUserStoreHook().SET_ID(account_id);
  useUserStoreHook().SET_TOKEN(accessToken);
  useUserStoreHook().SET_NAME(account_username);
  useUserStoreHook().SET_NICKNAME(account_nickName);
  useUserStoreHook().SET_CID(account_cid);
  useUserStoreHook().SET_STATUS(account_status);

  expires > 0
    ? Cookies.set(TokenKey, dataString, {
        expires: expires / 86400000
      })
    : Cookies.set(TokenKey, dataString);
  sessionStorage.setItem(TokenKey, dataString);

  storageSession.setItem("info", {
    username: account_username,
    accessToken: accessToken,
    id: account_id
  });
}

// 删除token
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.removeItem(TokenKey);
}
