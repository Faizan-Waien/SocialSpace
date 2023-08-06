export default (url, options) => {
    const token = localStorage.getItem('token')
    let newOptions = {}

    if(options.headers) {
        newOptions = { ...options, headers: { ...options.headers, 'Authorization': `Bearer ${token}` }}
    } else {
        newOptions = { ...options, headers: { 'Authorization': `Bearer ${token}` }}
    }

    return fetch(url, newOptions)
}