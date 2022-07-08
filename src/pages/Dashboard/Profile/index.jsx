import React, { useState, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';
import AuthService from '../../../services/auth-service';

const formInputClass = 'outline-none dark:bg-black bg-gray-100 p-2 rounded-md w-full mb-2 mt-1';

const Profile = () => {
  const context = useContext(AuthContext);
  const [firstname, setFirstname] = useState(context.user.firstname);
  const [lastname, setLastname] = useState(context.user.lastname);
  const [email, setEmail] = useState(context.user.email);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [updateState, setUpdateState] = useState(false);
  const [changePasswordState, setChangePasswordState] = useState(false);

  const firstNameChangeHandler = (event) => {
    setFirstname(event.target.value);
  };

  const lastNameChangeHandler = (event) => {
    setLastname(event.target.value);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const currentPasswordChangeHandler = (event) => {
    setCurrentPassword(event.target.value);
  };

  const newPasswordChangeHandler = (event) => {
    setNewPassword(event.target.value);
  };

  const confirmNewPasswordChangeHandler = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const updateProfile = useCallback(
    async (event) => {
      event.preventDefault();

      const user = {
        firstname,
        lastname,
        email
      };

      setUpdateState(() => true);

      try {
        const response = await AuthService.update(user, context.user.id);
        toast.success('Successfully edited your profile!');
        context.loginUser(response.data);
      } catch (error) {
        toast.error("An error occurred, Couldn't update your profile.");
      } finally {
        setUpdateState(() => false);
      }
    },
    [context, email, firstname, lastname]
  );

  const changePassword = async (event) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      return toast.error('The password must be 8 or more characters long');
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error('Password and confirmation field mismatch!');
    }

    setChangePasswordState(() => true);

    try {
      await AuthService.changePassword({ newPassword, currentPassword });
      toast.success('Successfully changed your password! Logging out...');
      context.logoutUser();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setChangePasswordState(() => false);
    }
  };

  return (
    <div>
      <div className="">
        <h4 className="text-left font-bold text-main dark:text-primary mb-4">Edit Profile</h4>
        <div className="dark:bg-dark bg-gray-300 p-5 w-full">
          <form onSubmit={updateProfile} className="flex flex-wrap gap-4 w-full">
            <div className="md:w-1/4 w-full text-left">
              <label htmlFor="firstname">Firstname *</label> <br />
              <input
                required
                value={firstname}
                onChange={firstNameChangeHandler}
                className={`${formInputClass}`}
                type="text"
              />
            </div>
            <div className="md:w-1/4 w-full text-left">
              <label htmlFor="lastname">Lastname *</label>
              <br />
              <input
                required
                value={lastname}
                onChange={lastNameChangeHandler}
                className={`${formInputClass}`}
                type="text"
              />
            </div>
            <div className="md:w-1/4 w-full text-left">
              <label htmlFor="email">Email *</label>
              <br />
              <input
                required
                value={email}
                onChange={emailChangeHandler}
                className={`${formInputClass}`}
                type="email"
              />
            </div>

            <div className="w-full text-left">
              <button
                disabled={updateState}
                className="dark:bg-primary bg-main text-white px-4 py-2 rounded-md hover:opacity-90 disabled:cursor-not-allowed">
                {updateState ? 'Updating' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <h4 className="text-left font-bold text-main dark:text-primary mb-2 mt-5">Change Password</h4>
      <div className="dark:bg-dark bg-gray-300 p-5">
        <form onSubmit={changePassword} className="flex flex-wrap gap-4">
          <div className="md:w-1/4 w-full text-left">
            <label htmlFor="current_password">Current Password *</label>
            <input
              required
              value={currentPassword}
              onChange={currentPasswordChangeHandler}
              className={`${formInputClass}`}
              type="password"
            />
          </div>
          <div className="md:w-1/4 w-full text-left">
            <label htmlFor="new_password">New Password *</label>
            <input
              required
              value={newPassword}
              onChange={newPasswordChangeHandler}
              className={`${formInputClass}`}
              type="password"
            />
          </div>
          <div className="md:w-1/4 w-full text-left">
            <label htmlFor="confirm_new_password">Confirm Password *</label>
            <input
              required
              value={confirmNewPassword}
              onChange={confirmNewPasswordChangeHandler}
              className={`${formInputClass}`}
              type="password"
            />
          </div>

          <div className="w-full text-left">
            <button
              disabled={changePasswordState}
              className="dark:bg-primary bg-main text-white px-4 py-2 rounded-md hover:opacity-90 disabled:cursor-not-allowed">
              {changePasswordState ? 'Changing...' : 'Change'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
