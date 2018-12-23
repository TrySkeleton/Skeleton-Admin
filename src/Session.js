import { decorate, observable } from 'mobx'

class Session {

    authenticated = false
    token = ''

    clearSession() {
        this.authenticated = false
        this.token = ''
    }
}

decorate(Session, {
    authenticated: observable,
    token: observable
})

export { Session }
export default new Session()