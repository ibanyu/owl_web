// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

export async function cluster(data, options){
  return request('/dbinjection-open/db-injection/cluster/list', {
    method: 'POST',
    data,
    ...(options || {}),
  })
}

/** 新建规则 PUT /api/rule */

export async function updateCluster(data, options) {
  return request('/dbinjection-open/db-injection/cluster/update', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function addCluster(data, options) {
  return request('/dbinjection-open/db-injection/cluster/add', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function removeCluster(data, options) {
  return request(`/dbinjection-open/db-injection/cluster/del?id=${data.id}`, {
    method: 'POST',
    params: {},
    ...(options || {}),
  });
}
