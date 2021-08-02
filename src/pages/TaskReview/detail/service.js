import { request } from 'umi';

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryTaskProfile(id, options){
  return request('/dbinjection-open/db-injection/task/get', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  }).then((data) => ({data}))
}
