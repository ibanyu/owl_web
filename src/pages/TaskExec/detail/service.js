import { request } from 'umi';

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryTaskProfile(id, options){
  return request('/db-injection/task/get', {
    method: 'POST',
    params: { id },
    ...(options || {}),
  })
}
