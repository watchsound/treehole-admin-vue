import request from '@/utils/request'

export function listTag(query) {
  return request({
    url: '/admin/tag/list',
    method: 'get',
    params: query
  })
}
 

export function createTag(data) {
  return request({
    url: '/admin/tag/create',
    method: 'post',
    data
  })
}
 
export function updateTag(data) {
  return request({
    url: '/admin/tag/update',
    method: 'post',
    data
  })
}

export function deleteTag(data) {
  return request({
    url: '/admin/tag/delete',
    method: 'post',
    data
  })
}
