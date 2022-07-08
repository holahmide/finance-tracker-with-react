import api from './api';

const AuthService = {
  register (credentials) {
    return api.post('auth/register', credentials);
  },
  login (credentials) {
    return api.post('auth/login', credentials);
  },
  getUser () {
    return api.get('auth/state');
  },
  logout () {
    return api.get('auth/logout');
  },
  update (credentials, id) {
    return api.put(`auth/edit/${id}`, credentials);
  },
  changePassword (credentials) {
    return api.post('auth/change_password', credentials);
  }
};

export default AuthService;
