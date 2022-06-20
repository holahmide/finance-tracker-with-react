import { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import loginSVG from '../../images/login.svg';
import loginDarkSVG from '../../images/login_dark.svg';
import AuthService from '../../services/auth-service';
import toast from 'react-hot-toast';
import { ThemeContext } from '../../context/ThemeContext';

const Regsiter = () => {
    const { theme } = useContext(ThemeContext)
    const navigate = useNavigate();
    const email = useRef('olami02bj@gmail.com');
    const firstName = useRef('k');
    const lastName = useRef('k');
    const confirmPassword = useRef('k');
    const password = useRef('k');
    const [loading, setLoading] = useState(false);

    const submitFormHandler = async (event) => {
        event.preventDefault();
        setLoading(() => true);

        if (password.current.value.length < 8) {
            return toast.error("The password must be 8 or more characters long")
        }

        if (password.current.value !== confirmPassword.current.value) {
            return toast.error("Password and confirmation field mismatch!")
        }

        try {
            const response = await AuthService.register({ lastname: lastName.current.value, firstname: firstName.current.value, email: email.current.value, password: password.current.value });
            toast.success(response.data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'An error occurred. Try again.');
        } finally {
            setLoading(() => false);
        }

    }

    return (
        <>
            <div className="min-h-screen flex flex-wrap justify-center gap-12 items-center p-4">
                <div>
                    <img src={theme === 'dark' ? loginDarkSVG : loginSVG} width="400px" alt="login SVG" />
                </div>
                <div>
                    <div className="text-left mb-2 text-main dark:text-primary font-bold text-xl">BTrack <span className='text-md'>Login</span></div>
                    <form onSubmit={submitFormHandler}>
                        <div className='text-left mb-3'>
                            <label className="text-left dark:text-white" htmlFor='firstName'>First Name</label> <br />
                            <input ref={firstName} required type="text" name="firstName" className="bg-gray-200 dark:bg-gray-900 p-2 outline-none focus:border-l-main dark:focus:border-l-primary shadow-lg border-2 border-transparent border-b-main dark:border-b-primary rounded-sm" />
                        </div>
                        <div className='text-left mb-3'>
                            <label className="text-left dark:text-white" htmlFor='lastName'>Last Name</label> <br />
                            <input ref={lastName} required type="text" name="lastName" className="bg-gray-200 dark:bg-gray-900 p-2 outline-none focus:border-l-main dark:focus:border-l-primary shadow-lg border-2 border-transparent border-b-main dark:border-b-primary rounded-sm" />
                        </div>
                        <div className='text-left mb-3'>
                            <label className="text-left dark:text-white" htmlFor='email'>Email</label> <br />
                            <input ref={email} required type="email" name="email" className="bg-gray-200 dark:bg-gray-900 p-2 outline-none focus:border-l-main dark:focus:border-l-primary shadow-lg border-2 border-transparent border-b-main dark:border-b-primary rounded-sm" />
                        </div>
                        <div className='text-left mb-3'>
                            <label className="text-left dark:text-white" htmlFor='password'>Password</label> <br />
                            <input ref={password} required type="password" name="password" className="bg-gray-200 dark:bg-gray-900 dark:text-white p-2 outline-none focus:border-l-main dark:focus:border-l-primary shadow-lg border-2 border-transparent border-b-main dark:border-b-primary rounded-sm" />
                        </div>
                        <div className='text-left mb-3'>
                            <label className="text-left dark:text-white" htmlFor='confirmPassword'>Confirm Password</label> <br />
                            <input ref={confirmPassword} required type="password" name="confirmPassword" className="bg-gray-200 dark:bg-gray-900 dark:text-white p-2 outline-none focus:border-l-main dark:focus:border-l-primary shadow-lg border-2 border-transparent border-b-main dark:border-b-primary rounded-sm" />
                        </div>
                        <div>
                            <button disabled={loading} type="submit" className='bg-main dark:bg-primary w-full px-4 py-2 text-white hover:opacity-90 transition-all'>{loading ? 'Loading' : 'Register'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Regsiter;