import { useCallback, useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Moment from "react-moment";
import CreateSpending from "../../../components/Spending/CreateSpending";
import SpendingService from "../../../services/spending-service";
import EditSpending from "../../../components/Spending/EditSpending";
import Modal from "../../../components/UI/modal";
import toast from "react-hot-toast";
import Loader from "../../../components/UI/loader";
import usePagination from "../../../hooks/use-pagination";

let currentDate = new Date();
currentDate =
    currentDate.getFullYear() +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentDate.getDate()).slice(-2);
const dateFormat = "Do ddd YYYY HH:mm";

const Spendings = () => {
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [spendings, setSpendings] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [activeEditSpending, setActiveEditSpending] = useState(false);
    const [activeDeleteSpending, setActiveDeleteSpending] = useState(false);
    const [requestState, setRequestState] = useState(false);

    const { paginationHTML, pageData: tableData, lastRowIndex: tableLastIndex } = usePagination({ data: spendings, size: 10, span: 10 });

    // Quick Add
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(currentDate);

    useEffect(() => {
        const initialSetup = async () => {
            try {
                const response = await SpendingService.fetchAll();
                setSpendings(response.data.spendings.reverse());
            } catch (error) {
                toast(error?.response?.data?.message || 'Couldn\'t fetch spending record. Reload the page.')
            } finally {
                setLoading(() => false);
            }
        };
        initialSetup();
    }, []);

    const searchHandler = (event) => {
        setSearchText(() => event.target.value);
    };

    const getDescriptionText = useCallback((breakdowns) => {
        let items = "";
        breakdowns.map((breakdown, index) => {
            if (breakdown.item) {
                if (index === breakdowns.length - 1) {
                    items += breakdown.item;
                } else items += breakdown.item + ", ";
            }
            return true;
        });
        return items;
    }, []);

    const addSpending = useCallback((data) => {
        let spendingRecord = data.spending;
        spendingRecord.Breakdowns = data.Breakdowns;
        spendingRecord.Borroweds = data.Borroweds;
        spendingRecord.Lents = data.Lents;
        setSpendings((oldValue) => {
            return [spendingRecord, ...oldValue];
        });
    }, []);

    const updateSpending = useCallback((data) => {
        let spendingRecord = data.spending;
        spendingRecord.Breakdowns = data.Breakdowns;
        spendingRecord.Borroweds = data.Borroweds;
        spendingRecord.Lents = data.Lents;
        setSpendings((oldValue) => {
            let findIndex = oldValue.findIndex(
                (el) => el.id === Number(spendingRecord.id)
            );
            oldValue[findIndex] = spendingRecord;
            return [...oldValue];
        });
    }, []);

    const showEditSpending = useCallback((spending) => {
        setActiveEditSpending(() => spending);
        setEditModal(() => true);
    }, []);

    const hideEditSpending = useCallback(() => {
        setEditModal(() => false);
        setActiveEditSpending(() => null);
    }, []);

    const confirmDeleteSpending = useCallback(
        (id) => {
            const findIndex = spendings.findIndex((el) => el.id === id);
            setActiveDeleteSpending(() => spendings[findIndex])
            setDeleteModal(true);
        },
        [spendings]
    );

    const hideDeleteModal = useCallback(() => {
        setDeleteModal(false)
    }, [])

    const deleteSpending = useCallback(async (id) => {
        const findIndex = spendings.findIndex((el) => el.id === id);

        setRequestState(() => true)
        // Backend
        try {
            await SpendingService.delete(spendings[findIndex]);
            setSpendings((oldValue) => {
                oldValue.splice(findIndex, 1);
                return [
                    ...oldValue
                ]
            })
            toast.success("Successfully deleted spending record")
            hideDeleteModal()
        } catch (error) {
            toast.error("Couldn't delete record")
        } finally {
            setRequestState(() => false)
        }
    }, [hideDeleteModal, spendings])

    const amountInputHandler = useCallback((event) => {
        setAmount(() => event.target.value)
    }, [])

    const descriptionInputHandler = useCallback((event) => {
        setDescription(() => event.target.value)
    }, [])

    const dateInputHandler = useCallback((event) => {
        setDate(() => event.target.value)
    }, [])

    const quickAdd = useCallback(async (event) => {
        event.preventDefault();

        if (!amount || !date) {
            return toast("The amount and date fields are required!");
        }

        setRequestState(() => true)

        let spending = {
            amount: amount,
            date: date,
            breakdowns: [
                {
                    price: amount,
                    item: description
                }
            ],
            lents: [],
            borroweds: []
        };

        try {
            const response = await SpendingService.create(spending);
            addSpending(response.data);
            toast.success("Successfully added spent record")
            setAmount(() => '');
            setDescription(() => '')
            setDate(() => currentDate)
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setRequestState(() => false)
        }
    }, [addSpending, amount, date, description])

    return (
        <div>
            {<Loader show={requestState}></Loader>}
            {editModal && (
                <EditSpending
                    spending={activeEditSpending}
                    updateSpending={updateSpending}
                    close={hideEditSpending}
                    setRequestState={setRequestState}
                />
            )}
            {deleteModal && (
                <Modal closeModal={hideDeleteModal}>
                    <div className="text-left font-bold text-lg ">Delete Spending Record</div>
                    <div className="mt-3">
                        Are you sure you want to remove this spent record of ₦ {activeDeleteSpending.amount.toLocaleString()} on <Moment format={dateFormat}>{activeDeleteSpending.date}</Moment>?
                    </div>
                    <div className="flex justify-end mt-4">
                        <div>
                            <button onClick={hideDeleteModal} className="mx-2 bg-transparent border-2 dark:border-red-900 border-black  px-4 py-1.5 rounded-md">Cancel</button>
                            <button onClick={() => deleteSpending(activeDeleteSpending.id)} className="mx-2 bg-red-900 text-white border-2 border-red-900 px-4 py-1.5 rounded-md">Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
            <div className="mb-3">
                <div className="text-left font-bold text-xl mb-1 text-main dark:text-primary w-full">
                    ALL YOUR SPENDING RECORDS
                </div>
                <div className="text-left">
                    <form>
                        <div
                            className="flex bg-gray-300 text-black dark:text-white dark:bg-dark rounded-lg "
                            style={{ maxWidth: "700px" }}
                        >
                            <input
                                onChange={searchHandler}
                                value={searchText}
                                type="text"
                                placeholder="Search for any record by date (12-12-2022), description or amount"
                                className="p-2 bg-transparent outline-none w-full"
                            />
                            <span style={{ width: "50px" }}>
                                <FaSearch
                                    onClick={searchHandler}
                                    className="mt-3 text-black dark:text-gray-400 text-xl cursor-pointer"
                                />
                            </span>
                        </div>
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
                                {tableData.map((spending, index) => (
                                    <tr className="text-center" key={index}>
                                        <td className="border-b p-2 border-r">{tableLastIndex + (index + 1)}</td>
                                        <td className="border-b">
                                            ₦ {spending.amount.toLocaleString()}
                                        </td>
                                        <td className="border-b">
                                            <Moment format={dateFormat}>
                                                {spending.date}
                                            </Moment>
                                        </td>
                                        <td className="border-b">
                                            {getDescriptionText(spending.Breakdowns)}
                                        </td>
                                        <td className="border-b text-right">
                                            <FaEdit
                                                onClick={() => showEditSpending(spending)}
                                                className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer text-center inline mx-2"
                                            />
                                            <FaTrash
                                                onClick={() => confirmDeleteSpending(spending.id)}
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
                {loading && <p>Loading Spending records. please wait</p>}
                <div className="md:col-span-2">
                    <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-4 mb-3">
                        <div className="text-left dark:text-primary text-main mb-2">
                            Quick Add
                        </div>
                        <div className="flex justify-left">
                            <form onSubmit={quickAdd} className="">
                                <div className="text-left mb-3">
                                    <label className="">Amount *</label>
                                    <input value={amount} onChange={amountInputHandler} type="number" className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <div className="text-left mb-3">
                                    <label className="">Description</label>
                                    <input value={description} onChange={descriptionInputHandler} type="text" className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <div className="text-left mb-3">
                                    <label className="">Date *</label>
                                    <input value={date} onChange={dateInputHandler} type="date" className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <button type="submit" className="w-full dark:bg-primary text-white bg-main px-2 py-2 rounded-md mb-2 opacity-90 hover:opacity-100">
                                    Submit
                                </button>
                                <CreateSpending addSpending={addSpending} setRequestState={setRequestState} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Spendings;
