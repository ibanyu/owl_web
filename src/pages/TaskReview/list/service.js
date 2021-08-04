// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function task(data, options){
  return request('/db-injection/task/reviewer/list', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}

/** 新建规则 PUT /api/rule */

export async function updateTask(data, options) {
  return request('/db-injection/task/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
