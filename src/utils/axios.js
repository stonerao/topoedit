import axios from 'axios'
axios.interceptors.response.use(res => {
    const result = res || {}
    if (result.status === 200) {
        return result.data
    }
})
export default axios;