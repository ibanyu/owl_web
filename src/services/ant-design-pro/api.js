// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

export async function currentUser(options) {
  return request('/db-injection/user/role', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 登录接口 POST /db-injection/login */

export async function login(body, options) {
  return request('/db-injection/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
