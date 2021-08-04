// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function admin(data, options){
  return request('/db-injection/admin/list', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}

export async function addAdmin(data, options) {
  return request('/db-injection/admin/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function removeAdmin(id, options) {
  return request(`/db-injection/admin/del`, {
    method: 'POST',
    params: { id },
    ...(options || {}),
  });
}
