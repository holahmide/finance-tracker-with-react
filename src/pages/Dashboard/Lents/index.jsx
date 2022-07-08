import React, { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Moment from 'react-moment';
import SpendingActionsService from '../../../services/spending-actions-service';
import toast from 'react-hot-toast';
import Loader from '../../../components/UI/loader';
import CreateSpendingAction from '../../../components/SpendingAction/CreateSpendingAction';
import EditSpendingAction from '../../../components/SpendingAction/EditSpendingAction';
import Modal from '../../../components/UI/modal';
import usePagination from '../../../hooks/use-pagination';

let currentDate = new Date();
currentDate =
  currentDate.getFullYear() +
  '-' +
  ('0' + (currentDate.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + currentDate.getDate()).slice(-2);
const dateFormat = 'Do ddd YYYY HH:mm';

const Lents = () => {
  // const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [lents, setLents] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeEditLent, setActiveEditLent] = useState(false);
  const [activeDeleteLent, setActiveDeleteLent] = useState(false);
  const [requestState, setRequestState] = useState(false);

  // Quick Add
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(currentDate);

  const {
    paginationHTML,
    pageData: tableData,
    lastRowIndex: tableLastIndex
  } = usePagination({ data: lents, size: 10, span: 10 });

  useEffect(() => {
    const initialSetup = async () => {
      try {
        const response = await SpendingActionsService.fetchLents();
        setLents(response.data.lents.reverse());
      } catch (error) {
        toast(error?.response?.data?.message || "Couldn't fetch lent record. Reload the page.");
      } finally {
        setLoading(() => false);
      }
    };
    initialSetup();
  }, []);

  // const searchHandler = (event) => {
  //   setSearchText(() => event.target.value);
  // };

  const addLents = useCallback((data) => {
    const lentRecords = data.lents;
    setLents((oldValue) => {
      return [...lentRecords, ...oldValue];
    });
  }, []);

  const updateLent = useCallback((data) => {
    const lentRecord = data.lent;
    setLents((oldValue) => {
      const findIndex = oldValue.findIndex((el) => el.id === Number(lentRecord.id));
      oldValue[findIndex] = lentRecord;
      return [...oldValue];
    });
  }, []);

  const showEditLent = useCallback((lent) => {
    setActiveEditLent(() => lent);
    setEditModal(() => true);
  }, []);

  const hideEditLent = useCallback(() => {
    setEditModal(() => false);
    setActiveEditLent(() => null);
  }, []);

  const confirmDeleteSpending = useCallback(
    (id) => {
      const findIndex = lents.findIndex((el) => el.id === id);
      setActiveDeleteLent(() => lents[findIndex]);
      setDeleteModal(true);
    },
    [lents]
  );

  const hideDeleteModal = useCallback(() => {
    setDeleteModal(false);
  }, []);

  const deleteLent = useCallback(
    async (id) => {
      const findIndex = lents.findIndex((el) => el.id === id);

      setRequestState(() => true);
      // Backend
      try {
        await SpendingActionsService.deleteSpendingAction(lents[findIndex].id, 'lent');
        setLents((oldValue) => {
          oldValue.splice(findIndex, 1);
          return [...oldValue];
        });
        toast.success('Successfully deleted lent record');
        hideDeleteModal();
      } catch (error) {
        toast.error("Couldn't delete record");
      } finally {
        setRequestState(() => false);
      }
    },
    [hideDeleteModal, lents]
  );

  const amountInputHandler = useCallback((event) => {
    setAmount(() => event.target.value);
  }, []);

  const descriptionInputHandler = useCallback((event) => {
    setDescription(() => event.target.value);
  }, []);

  const dateInputHandler = useCallback((event) => {
    setDate(() => event.target.value);
  }, []);

  const quickAdd = useCallback(
    async (event) => {
      event.preventDefault();

      if (!amount || !date) {
        return toast('The amount and date fields are required!');
      }

      setRequestState(() => true);

      const lent = [
        {
          amount,
          date,
          description
        }
      ];

      try {
        const response = await SpendingActionsService.createLent(lent);
        addLents(response.data);
        toast.success('Successfully added lent record');
        setAmount(() => '');
        setDescription(() => '');
        setDate(() => currentDate);
      } catch (error) {
        toast.error('An error occurred');
      } finally {
        setRequestState(() => false);
      }
    },
    [addLents, amount, date, description]
  );

  return (
    <div>
      {<Loader show={requestState}></Loader>}
      {editModal && (
        <EditSpendingAction
          type={'Lent'}
          spendingAction={activeEditLent}
          updateSpendingAction={updateLent}
          close={hideEditLent}
          setRequestState={setRequestState}
        />
      )}
      {deleteModal && (
        <Modal closeModal={hideDeleteModal}>
          <div className="text-left font-bold text-lg ">Delete Lent Record</div>
          <div className="mt-3">
            Are you sure you want to remove this lent record of ₦{' '}
            {activeDeleteLent.amount.toLocaleString()} on{' '}
            <Moment format={dateFormat}>{activeDeleteLent.date}</Moment>?
          </div>
          <div className="flex justify-end mt-4">
            <div>
              <button
                onClick={hideDeleteModal}
                className="mx-2 bg-transparent border-2 dark:border-red-900 border-black  px-4 py-1.5 rounded-md">
                Cancel
              </button>
              <button
                onClick={() => deleteLent(activeDeleteLent.id)}
                className="mx-2 bg-red-900 text-white border-2 border-red-900 px-4 py-1.5 rounded-md">
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="mb-3">
        <div className="text-left font-bold text-xl mb-1 text-main dark:text-primary w-full">
          ALL YOUR LENT RECORDS
        </div>
        <div className="text-left">
          <form>
            {/* <div
              className="flex bg-gray-300 text-black dark:text-white dark:bg-dark rounded-lg "
              style={{ maxWidth: '700px' }}>
              <input
                onChange={searchHandler}
                value={searchText}
                type="text"
                placeholder="Search for any record by date (12-12-2022), description or amount"
                className="p-2 bg-transparent outline-none w-full"
              />
              <span style={{ width: '50px' }}>
                <FaSearch
                  onClick={searchHandler}
                  className="mt-3 text-black dark:text-gray-400 text-xl cursor-pointer"
                />
              </span>
            </div> */}
          </form>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 w-full justify-around gap-6">
        {/* <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-4" style={{ width: '100vw', maxWidth: '600px' }}> */}
        {!loading && (
          <div className="md:col-span-4 bg-gray-300 dark:bg-dark rounded-sm p-4">
            <table className="w-full table-auto border-collapse border-black">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((lent, index) => (
                  <tr className="text-center" key={index}>
                    <td className="border-b p-2 border-r">{tableLastIndex + (index + 1)}</td>
                    <td className="border-b">₦ {lent.amount.toLocaleString()}</td>
                    <td className="border-b">
                      <Moment format={dateFormat}>{lent.date}</Moment>
                    </td>
                    <td className="border-b">{lent.description}</td>
                    <td className="border-b text-right">
                      <FaEdit
                        onClick={() => showEditLent(lent)}
                        className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer text-center inline mx-2"
                      />
                      <FaTrash
                        onClick={() => confirmDeleteSpending(lent.id)}
                        className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer text-center inline mx-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paginationHTML}
          </div>
        )}
        {loading && <p>Loading lent records. please wait</p>}
        <div className="md:col-span-2">
          <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-4 mb-3">
            <div className="text-left dark:text-primary text-main mb-2">Quick Add</div>
            <div className="flex justify-left">
              <form onSubmit={quickAdd} className="">
                <div className="text-left mb-3">
                  <label className="">Amount *</label>
                  <input
                    value={amount}
                    onChange={amountInputHandler}
                    type="number"
                    className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full"
                  />
                </div>
                <div className="text-left mb-3">
                  <label className="">Description</label>
                  <input
                    value={description}
                    onChange={descriptionInputHandler}
                    type="text"
                    className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full"
                  />
                </div>
                <div className="text-left mb-3">
                  <label className="">Date *</label>
                  <input
                    value={date}
                    onChange={dateInputHandler}
                    type="date"
                    className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full dark:bg-primary text-white bg-main px-2 py-2 rounded-md mb-2 opacity-90 hover:opacity-100">
                  Submit
                </button>
                <CreateSpendingAction
                  type={'Lent'}
                  addSpendingAction={addLents}
                  setRequestState={setRequestState}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lents;
