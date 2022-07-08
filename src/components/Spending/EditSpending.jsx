/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import SpendingService from '../../services/spending-actions-service';
import Modal from '../UI/modal';
import useSpending from '../../hooks/use-spending';

const formInputClass = 'outline-none dark:bg-dark bg-gray-100 p-2 rounded-md w-full mb-2';

const EditSpending = ({ spending: spendingData, close, updateSpending, setRequestState }) => {
  const { user } = useContext(AuthContext);
  const [showModal] = useState(true);
  const [spending] = useState(Object.assign({}, spendingData));

  const {
    id,
    date,
    amount,
    spending: spendingObject,
    deleteField,
    addFields,
    initialEditSetup,
    inputChangeHandler,
    dateChangeHandler,
    validateForm,
    removedFields,
    reset
  } = useSpending(user);

  useEffect(() => {
    if (user) {
      initialEditSetup(spending);
    }
  }, [user]);

  const editSpending = async () => {
    let form = {
      id,
      date,
      amount,
      breakdowns: spendingObject.Breakdowns,
      borroweds: spendingObject.Borroweds,
      lents: spendingObject.Lents
    };

    setRequestState(() => true);
    form = validateForm(JSON.parse(JSON.stringify(form)));

    try {
      const response = await SpendingService.edit(
        {
          data: form,
          removed: {
            breakdowns: removedFields.Breakdowns,
            borroweds: removedFields.Borroweds,
            lents: removedFields.Lents
          }
        },
        form.id
      );
      if (response.status === 201) {
        close();
        toast.success('Successfully edited your spending record');
        updateSpending(response.data);
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
            <div className="text-left font-bold text-lg ">Edit Spending</div>
            <input
              onChange={dateChangeHandler}
              value={date}
              type="date"
              className={`${formInputClass} mt-4 mb-2`}
              placeholder="Enter Date *"
            />
            <div style={{ minWidth: '300px', overlayY: 'auto' }}>
              {spendingObject.Breakdowns.map((breakdown, index) => (
                <div key={index}>
                  <div className="mb-2 text-left">
                    Item {index + 1} &nbsp;
                    <FaTrash
                      onClick={() => deleteField('Breakdowns', breakdown.pageId, breakdown.id)}
                      className="text-red-500 dark:text-red-400 text-sm cursor-pointer inline"
                    />
                  </div>
                  <div className="pl-6" style={{ maxWidth: '500px' }}>
                    <input
                      type="number"
                      value={breakdown.price}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          breakdown.pageId,
                          'Breakdowns',
                          'price',
                          breakdown.id
                        )
                      }
                      className={formInputClass}
                      placeholder="Enter Price *"
                    />
                    <input
                      value={breakdown.item}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          breakdown.pageId,
                          'Breakdowns',
                          'item',
                          breakdown.id
                        )
                      }
                      className={formInputClass}
                      placeholder="Enter Item"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => addFields('Breakdowns')}
            className="w-full dark:bg-primary bg-main p-1.5 rounded-md">
            Add more spending records
          </button>
          <div className="mt-4">
            <div className="text-left font-bold text-lg ">Borrowed</div>
            <div style={{ minWidth: '300px', overlayY: 'auto' }}>
              {spendingObject.Borroweds.map((borrowed, index) => (
                <div key={index}>
                  <div className="mb-2 text-left">
                    Item {index + 1}&nbsp;
                    <FaTrash
                      onClick={() =>
                        deleteField('Borroweds', borrowed.pageId, borrowed.id, borrowed.id)
                      }
                      className="text-red-500 dark:text-red-400 text-sm cursor-pointer inline"
                    />
                  </div>
                  <div className="pl-6" style={{ maxWidth: '500px' }}>
                    <input
                      type="number"
                      value={borrowed.amount}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          borrowed.pageId,
                          'Borroweds',
                          'amount',
                          borrowed.id
                        )
                      }
                      className={formInputClass}
                      placeholder="Enter Amount *"
                    />
                    <input
                      value={borrowed.description}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          borrowed.pageId,
                          'Borroweds',
                          'description',
                          borrowed.id
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
          <button
            type="button"
            onClick={() => addFields('Borroweds')}
            className="w-full dark:bg-primary bg-main p-1.5 rounded-md">
            Add more borrowed records
          </button>
          <div className="mt-4">
            <div className="text-left font-bold text-lg ">Lent</div>
            <div style={{ minWidth: '300px', overlayY: 'auto' }}>
              {spendingObject.Lents.map((lent, index) => (
                <div key={index}>
                  <div className="mb-2 text-left">
                    Item {index + 1}&nbsp;
                    <FaTrash
                      onClick={() => deleteField('Lents', lent.pageId, lent.id)}
                      className="text-red-500 dark:text-red-400 text-sm cursor-pointer inline"
                    />
                  </div>
                  <div className="pl-6" style={{ maxWidth: '500px' }}>
                    <input
                      type="number"
                      value={lent.amount}
                      onChange={(e) =>
                        inputChangeHandler(e.target.value, lent.pageId, 'Lents', 'amount', lent.id)
                      }
                      className={formInputClass}
                      placeholder="Enter Amount *"
                    />
                    <input
                      value={lent.description}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          lent.pageId,
                          'Lents',
                          'description',
                          lent.id
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
          <button
            type="button"
            onClick={() => addFields('Lents')}
            className="w-full dark:bg-primary bg-main p-1.5 rounded-md">
            Add more lent records
          </button>
          <div className="mt-2">Total: ₦ {amount.toLocaleString()}</div>
          <div className="flex mt-4 gap-2">
            <div className="w-1/2">
              <button
                type="button"
                onClick={editSpending}
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

export default EditSpending;
