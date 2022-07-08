/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import SpendingActionsService from '../../services/spending-actions-service';
import Modal from '../UI/modal';
import useSpending from '../../hooks/use-spending';

const formInputClass = 'outline-none dark:bg-dark bg-gray-100 p-2 rounded-md w-full mb-2';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const EditSpendingAction = ({
  type,
  spendingAction: lentData,
  close,
  updateSpendingAction,
  setRequestState
}) => {
  const { user } = useContext(AuthContext);
  const [showModal] = useState(true);
  const [spendingAction] = useState(Object.assign({}, lentData));

  const {
    date,
    spending: spendingObject,
    initialEditSetup,
    inputChangeHandler,
    dateChangeHandler,
    reset,
    validateSpendingAction
  } = useSpending(user);

  useEffect(() => {
    if (user) {
      initialEditSetup({ [`${capitalizeFirstLetter(type)}s`]: [spendingAction] });
    }
  }, [initialEditSetup, spendingAction, type, user]);

  const editSpendingAction = async () => {
    const form = {
      ...spendingObject[`${capitalizeFirstLetter(type)}s`][0]
    };

    setRequestState(() => true);
    if (!validateSpendingAction(form)) {
      setRequestState(() => false);
      return;
    }

    try {
      let response;
      if (type.toLowerCase() === 'borrowed') {
        response = await SpendingActionsService.editBorrowed(form, form.id);
      } else {
        response = await SpendingActionsService.editLent(form, form.id);
      }

      if (response.status === 200) {
        close();
        toast.success('Successfully edited your {type} record');
        updateSpendingAction(response.data);
        reset();
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setRequestState(() => false);
    }
  };

  const closeModal = () => {
    // setShowModal(false);
    close();
  };

  return (
    <div>
      {showModal && (
        <Modal closeModal={closeModal}>
          <div>
            <div className="text-left font-bold text-lg ">
              Edit {`${capitalizeFirstLetter(type)}`}
            </div>
            <input
              onChange={dateChangeHandler}
              value={date}
              type="date"
              className={`${formInputClass} mt-4 mb-2`}
              placeholder="Enter Date *"
            />
            <div style={{ minWidth: '300px', overlayY: 'auto' }}>
              {spendingObject[`${capitalizeFirstLetter(type)}s`].map((spendingAction, index) => (
                <div key={index}>
                  <div className="" style={{ maxWidth: '500px' }}>
                    <input
                      type="number"
                      value={spendingAction.amount}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          spendingAction.pageId,
                          `${capitalizeFirstLetter(type)}s`,
                          'amount',
                          spendingAction.id
                        )
                      }
                      className={formInputClass}
                      placeholder="Enter Amount *"
                    />
                    <input
                      value={spendingAction.description}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          spendingAction.pageId,
                          `${capitalizeFirstLetter(type)}s`,
                          'description',
                          spendingAction.id
                        )
                      }
                      className={formInputClass}
                      placeholder="Enter Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex mt-4 gap-2">
            <div className="w-1/2">
              <button
                type="button"
                onClick={editSpendingAction}
                className="dark:bg-primary bg-main w-full rounded-sm py-1">
                Record
              </button>
            </div>
            <div className="w-1/2">
              <button
                type="button"
                onClick={closeModal}
                className="dark:bg-secondary bg-primary w-full rounded-sm py-1">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditSpendingAction;
