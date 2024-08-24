import request from '@/utils/request'

export function listRawArticle(query) {
  return request({
    url: '/admin/article/listraw',
    method: 'get',
    params: query
  })
}

export function updateRawArticle(data) {
  return request({
    url: '/admin/article/updateraw',
    method: 'post',
    data
  })
}

export function listArticle(query) {
  return request({
    url: '/admin/article/list',
    method: 'get',
    params: query
  })
}
export function getArticleById(query) {
  return request({
    url: '/admin/article/getarticledetailbyid',
    method: 'get',
    params: query
  })
}

export function updateArticle(data) {
  return request({
    url: '/admin/article/update',
    method: 'post',
    data
  })
}
export function createArticle(data) {
  return request({
    url: '/admin/article/create',
    method: 'post',
    data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/admin/article/delete',
    method: 'post',
    data
  })
}

export function listTips(query) {
  return request({
    url: '/admin/article/listtip',
    method: 'get',
    params: query
  })
}

export function updateTip(data) {
  return request({
    url: '/admin/article/updatetip',
    method: 'post',
    data
  })
}
export function createTip(data) {
  return request({
    url: '/admin/article/createtip',
    method: 'post',
    data
  })
}
