// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function rules(data, options){
  return request('/dbinjection-open/db-injection/rule/list', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}

/** 新建规则 PUT /api/rule */

export async function updateRules(data, options) {
  return request('/dbinjection-open/db-injection/rule/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
