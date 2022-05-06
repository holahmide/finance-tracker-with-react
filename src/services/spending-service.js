import api from './api'

const SpendingService = {
    create(payload) {
        return api.post('spendings/create', payload)
    },
    fetchAll() {
        return api.get('spendings/all')
    },
    edit(payload, id) {
        return api.put(`spendings/edit/${id}`, payload)
    },
    delete(payload) {
        return api.post(`spendings/delete/${payload.id}`, payload)
    },

    createBorrowed(payload) {
        return api.post('spendings/borroweds/create', payload)
    },
    editBorrowed(payload, id) {
        return api.put(`spendings/borroweds/edit/${id}`, payload)
    },
    fetchAllBorroweds() {
        return api.get('spendings/borroweds/all')
    },

    createLent(payload) {
        return api.post('spendings/lents/create', payload)
    },
    editLent(payload, id) {
        return api.put(`spendings/lents/edit/${id}`, payload)
    },
    fetchAllLents() {
        return api.get('spendings/lents/all')
    },

    fetchOvershoots() {
        return api.get('limits/overshoots')
    },
    createLimit(payload) {
        return api.post('limits/create', payload)
    },
    editLimit(payload, id) {
        return api.put(`limits/edit/${id}`, payload)
    },

    fetchChartData() {
        return api.get('spendings/chart')
    },

    deleteAction(id, type) {
        return api.get(`spendings/delete/${type}/${id}`)
    }
}

export default SpendingService;
