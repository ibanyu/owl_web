// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function task(data, options){
  return request('/db-injection/task/history', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}

export async function rollBack(data, options) {
  return request('/db-injection/backup/rollback', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}

export async function backUpInfo(data, options) {
  return request('/db-injection/backup/data', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}
