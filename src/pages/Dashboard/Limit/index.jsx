import { useCallback, useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import Moment from "react-moment";
import SpendingActionsService from "../../../services/spending-actions-service";
import toast from "react-hot-toast";
import Loader from "../../../components/UI/loader";
import usePagination from "../../../hooks/use-pagination";


const formatDate = (date) => {
    if (date) {
        date = new Date(date);
        return date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2);
    } else return date;
};
const dateFormat = "Do ddd YYYY HH:mm";

const Limit = () => {
    let currentDate = useMemo(() => new Date(), []);
    currentDate = formatDate(currentDate);

    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [overshoots, setOvershoots] = useState([]);
    const [limit, setLimit] = useState([]);
    const [requestState, setRequestState] = useState(false);

    const { paginationHTML, pageData: tableData, lastRowIndex: tableLastIndex } = usePagination({ data: overshoots, size: 10, span: 10 });

    // Quick Add
    const [amount, setAmount] = useState('');
    const [fromDate, setFromDate] = useState(currentDate);
    const [toDate, setToDate] = useState(currentDate);

    const initialSetup = useCallback(async () => {
        try {
            const response = await SpendingActionsService.fetchLimitOvershoots();
            setOvershoots(response.data.overshoots.records.reverse());
            if (!response.data.limits.length) {
                toast("No limit record found");
            }
            // First and only limit (Backend configured to have multiple limits)
            setLimit(response.data.limits.reverse()[0]);
        } catch (error) {
            toast(error?.response?.data?.message || 'Couldn\'t fetch limits & overshoots. Reload the page.')
        } finally {
            setLoading(() => false);
        }
    }, []);

    useEffect(() => {
        initialSetup();
    }, [initialSetup]);

    useEffect(() => {
        setAmount(() => limit ? limit.amount : '');
        setFromDate(() => limit ? formatDate(limit.from) : currentDate);
        setToDate(() => limit ? formatDate(limit.to) : currentDate);
    }, [currentDate, limit]);

    const searchHandler = (event) => {
        setSearchText(() => event.target.value);
    };

    const amountInputHandler = useCallback((event) => {
        setAmount(() => event.target.value)
    }, [])

    const fromDateInputHandler = useCallback((event) => {
        setFromDate(() => event.target.value)
    }, [])

    const toDateInputHandler = useCallback((event) => {
        setToDate(() => event.target.value)
    }, [])

    const saveLimit = useCallback(async (event) => {
        event.preventDefault();
        if (!amount || !fromDate || !toDate) {
            return toast("The amount and date fields are required!");
        }

        setRequestState(() => true)

        let limitData = {
            amount: amount,
            from: fromDate,
            to: toDate,
            status: true
        };

        try {
            let response;
            if (!limit) {
                response = await SpendingActionsService.createLimit(limitData);
            } else {
                response = await SpendingActionsService.editLimit(limitData, limit.id);
            }
            toast.success("Successfully saved limit");
            setLimit(() => response.data.limit);
            initialSetup();
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setRequestState(() => false)
        }
    }, [amount, fromDate, initialSetup, limit, toDate])

    return (
        <div>
            {<Loader show={requestState}></Loader>}
            <div className="mb-3">
                <div className="text-left font-bold text-xl mb-1 text-main dark:text-primary w-full">
                    LIMIT & OVERSHOOTS
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
                {!loading && (
                    <div className="md:col-span-4 bg-gray-300 dark:bg-dark rounded-sm p-4">
                        <table className="w-full table-auto border-collapse border-black">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Amount</th>
                                    <th>Difference</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((overshoot, index) => (
                                    <tr className={`text-center ${overshoot.credit ? 'bg-green-800 text-white dark:bg-green-900' : 'bg-red-900 dark:bg-red-900 text-white'}`} key={index}>
                                        <td className="border-b p-2 border-r">{tableLastIndex + (index + 1)}</td>
                                        <td className="border-b">
                                            ₦ {overshoot.amount.toLocaleString()}
                                        </td>
                                        <td className="border-b">
                                            {overshoot.credit ? '+' : '-'} ₦{overshoot.difference.toLocaleString()}
                                        </td>
                                        <td className="border-b capitalize">
                                            {overshoot.type}
                                        </td>
                                        <td className="border-b">
                                            <Moment format={dateFormat}>
                                                {overshoot.date}
                                            </Moment>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {paginationHTML}
                    </div>
                )}
                {loading && <p>Loading limit overshoots. please wait</p>}
                <div className="md:col-span-2">
                    <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-4 mb-3">
                        <div className="text-left dark:text-primary text-main mb-2">
                            Active Limit
                        </div>
                        <div className="flex justify-left">
                            <form onSubmit={saveLimit} className="">
                                <div className="text-left mb-3">
                                    <label className="">Amount *</label>
                                    <input value={amount} onChange={amountInputHandler} type="number" className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <div className="text-left mb-3">
                                    <label className="">Start Date *</label>
                                    <input value={fromDate} onChange={fromDateInputHandler} type="date" className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <div className="text-left mb-3">
                                    <label className="">End Date *</label>
                                    <input value={toDate} onChange={toDateInputHandler} type="date" className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <button type="submit" className="w-full dark:bg-primary text-white bg-main px-2 py-2 rounded-md mb-2 opacity-90 hover:opacity-100">
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Limit;