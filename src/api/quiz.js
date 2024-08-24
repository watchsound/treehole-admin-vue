import request from '@/utils/request'

export function listQuiz(query) {
  return request({
    url: '/admin/quiz/list',
    method: 'get',
    params: query
  })
} 

export function getQuizDetail(query) {
  return request({
    url: '/admin/quiz/quizbyid',
    method: 'get',
    params: query
  })
} 

export function deleteQuiz(data) {
  return request({
    url: '/admin/quiz/delete',
    method: 'post',
    data
  })
}

export function createQuiz(data) {
  return request({
    url: '/admin/quiz/create',
    method: 'post',
    data
  })
}
 

export function updateQuiz(data) {
  return request({
    url: '/admin/quiz/update',
    method: 'post',
    data
  })
}
 
export function listQuizGrade(query) {
  return request({
    url: '/admin/quiz/listgrade',
    method: 'get',
    params: query
  })
}  

export function deleteQuizGrade(data) {
  return request({
    url: '/admin/quiz/deletegrade',
    method: 'post',
    data
  })
}

export function createQuizGrade(data) {
  return request({
    url: '/admin/quiz/creategrade',
    method: 'post',
    data
  })
}


export function editQuizGrade(data) {
  return request({
    url: '/admin/quiz/updategrade',
    method: 'post',
    data
  })
}

export function editQuizProblem(data) {
  return request({
    url: '/admin/quiz/updateproblem',
    method: 'post',
    data
  })
}