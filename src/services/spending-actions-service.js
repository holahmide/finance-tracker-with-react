import api from './api'

const SpendingService = {
    // Lents
    createLent(payload) {
        return api.post('spendings/lents/create', payload)
    },
    fetchLents() {
        return api.get('spendings/lents/all')
    },
    editLent(payload, id) {
        return api.put(`spendings/lents/edit/${id}`, payload)
    },
    deleteLent(payload) {
        return api.delete(`spendings/lents/delete/${payload.id}`, payload)
    },

    // Borroweds
    createBorrowed(payload) {
        return api.post('spendings/borroweds/create', payload)
    },
    fetchBorroweds() {
        return api.get('spendings/borroweds/all')
    },
    editBorrowed(payload, id) {
        return api.put(`spendings/borroweds/edit/${id}`, payload)
    },
    deleteBorrowed(payload) {
        return api.delete(`spendings/borroweds/delete/${payload.id}`, payload)
    },

    // Limits
    fetchLimitOvershoots() {
        return api.get('limits/overshoots');
    },
    createLimit(payload) {
        return api.post('limits/create', payload)
    },
    editLimit(payload, id) {
        return api.put(`limits/edit/${id}`, payload)
    },
}

export default SpendingService;
