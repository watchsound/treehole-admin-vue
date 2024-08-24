import request from '@/utils/request'

export function listClinic(query) {
  return request({
    url: '/admin/clinic/list',
    method: 'get',
    params: query
  })
}

export function deleteClinic(data) {
  return request({
    url: '/admin/clinic/delete',
    method: 'post',
    data
  })
}

export function createClinic(data) {
  return request({
    url: '/admin/clinic/create',
    method: 'post',
    data
  })
}
 

export function editClinic(data) {
  return request({
    url: '/admin/clinic/update',
    method: 'post',
    data
  })
}
 
