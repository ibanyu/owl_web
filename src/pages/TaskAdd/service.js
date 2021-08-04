import { request } from 'umi';

export async function dataBase(params = {}) {
  return request('/db-injection/db/list', {
    method: 'POST',
    data: { ...params },
  }).then((data) => ({data}));
}

export async function addTask(params = {}) {
  return request('/db-injection/task/add', {
    method: 'POST',
    data: { ...params },
  }).then((data) => ({data}));
}
