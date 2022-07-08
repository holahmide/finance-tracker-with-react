import React, { useRef, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginSVG from '../../images/login.svg';
import loginDarkSVG from '../../images/login_dark.svg';
import AuthService from '../../services/auth-service';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const email = useRef('olami02bj@gmail.com');
  const password = useRef('k');
  const [loading, setLoading] = useState(false);

  const submitFormHandler = async (event) => {
    event.preventDefault();
    setLoading(() => true);

    try {
      const response = await AuthService.login({
        email: email.current.value,
        password: password.current.value
      });
      toast.success(response.data.message);
      loginUser(response.data);
      navigate('/dashboard/spendings');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred. Try again.');
    } finally {
      setLoading(() => false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-wrap justify-center gap-12 items-center p-4">
        <div>
          <img src={theme === 'dark' ? loginDarkSVG : loginSVG} width="400px" alt="login SVG" />
        </div>
        <div>
          <div className="text-left mb-2 text-main dark:text-primary font-bold text-xl">
            BTrack <span className="text-md">Login</span>
          </div>
          <form onSubmit={submitFormHandler}>
            <div className="text-left mb-3">
              <label className="text-left dark:text-white" htmlFor="email">
                Email
              </label>{' '}
              <br />
              <input
                ref={email}
                required
                type="text"
                name="email"
                className="bg-gray-200 dark:bg-gray-900 dark:focus:bg-gray-900 p-2 outline-none focus:border-l-main dark:focus:border-l-primary shadow-lg border-2 border-transparent border-b-main dark:border-b-primary rounded-sm"
              />
            </div>
            <div className="text-left mb-3">
              <label className="text-left dark:text-white" htmlFor="password">
                Password
              </label>{' '}
              <br />
              <input
                ref={password}
                required
                type="password"
                name="password"
                className="bg-gray-200 dark:bg-gray-900 dark:text-white p-2 outline-none focus:border-l-main dark:focus:border-l-primary shadow-lg border-2 border-transparent border-b-main dark:border-b-primary rounded-sm"
              />
            </div>
            <div>
              <button
                disabled={loading}
                type="submit"
                className="bg-main dark:bg-primary w-full px-4 py-2 text-white hover:opacity-90 transition-all">
                {loading ? 'Loading' : 'LOGIN'}
              </button>
            </div>
            <div className="mt-2">
              {"Don't have an account? "}
              <Link to="/register" className="text-secondary dark:text-primary">
                Create One
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
