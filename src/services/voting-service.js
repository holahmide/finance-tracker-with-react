import api from '@/services/api'

export default {
    vote(credentials) {
        return api.post('session/category/vote/create', credentials)
    },
}
