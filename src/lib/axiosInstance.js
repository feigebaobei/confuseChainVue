import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:9800', // 本地服务端
  // baseURL: 'http://lixiaodan.org:9800', // 远程服务端
  // baseURL: 'http://127.0.0.1:9765/', // 模拟链节点的服务器
  // baseURL: 'https://34cd046f.ngrok.io',
  timeout: 5000
})

axios.defaults.withCredentials = true
// axios.defaults.headers['Content-Type'] = 'application/json'
// instance.interceptors.request.use(config => {}, error => Promise.reject(error))
// instance.interceptors.response.use(response => {}, error => Promise.reject(error))

// export default {instance: instance.instance}
export default instance
