const store = {
    _token: '',
    set token(str) {
        this._token = str
        localStorage.setItem('token', str)
    },
    get token() {
        return this._token || localStorage.getItem('token')
    }
}
export default store