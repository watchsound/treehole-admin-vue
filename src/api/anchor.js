import request from '@/utils/request'

export function fetchAnchorList(query) {
  return request({
    url: '/admin/anchor/list',
    method: 'get',
    params: query
  })
}

export function anchorDetail(id) {
  return request({
    url: '/admin/anchor/detail',
    method: 'get',
    params: { id }
  })
}

export function updateAnchor(data) {
  return request({
    url: '/admin/anchor/update',
    method: 'post',
    data
  })
}

export function listAccountHistory(query) {
  return request({
    url: '/admin/anchor/history',
    method: 'get',
    params: query
  })
}

export function listAnchorChatHistory(query) {
  return request({
    url: '/admin/chatroom/anchorchathistory',
    method: 'get',
    params: query
  })
}

export function listAnchorApplicant(query) {
  return request({
    url: '/admin/anchor/listapplicant',
    method: 'get',
    params: query
  })
}

export function updateAnchorApplicant(data) {
  return request({
    url: '/admin/anchor/updateapplicant',
    method: 'post',
    data
  })
}

export function updateAnchorApplicantStatus(data) {
  return request({
    url: '/admin/anchor/updateapplicantstatus',
    method: 'post',
    data
  })
}