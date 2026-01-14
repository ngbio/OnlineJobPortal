import axios from "axios";

const BASE_URL = 'http://192.168.7.41:8000/';

export const endpoints = {
    'categories': '/categories/',
    'job_posts': '/job_post/',
    'applications': "/applications/",
    'applicationsid':(jobId) => `/job_post/${jobId}/applications/`,
    'register': '/users/',
    'login': '/o/token/',
    'current_user': '/users/current-user/',
    'add_job': '/job_post/add_job/',
    'update_job' : (jobId) => `/job_post/${jobId}/update_job/`, 
    'apply_job': (id) => `/job_post/${id}/apply/`,
    'comments': (applicationId) => `/applications/${applicationId}/comments/`,
    'delete_job': (jobId) => `/job_post/${jobId}/delete_job/`,
    'stats':'/stats/employer-stats'
};

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
};

export default axios.create({
    baseURL: BASE_URL
});