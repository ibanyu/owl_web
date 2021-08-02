// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function task(data, options){
  return request('/dbinjection-open/db-injection/task/history', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}
