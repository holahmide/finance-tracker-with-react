import { useCallback, useEffect, useState } from "react";
import { FaSearch, FaEdit } from "react-icons/fa";
import Moment from "react-moment";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import CreateSpending from "../../../components/CreateSpending";
import SpendingService from "../../../services/spending-service";
import EditSpending from "../../../components/EditSpending";

const data = [{ name: 'Jan 2021', uv: 400, pv: 2400, amt: 2400 }, { name: 'Feb 2021', uv: 100, pv: 2100, amt: 200 }, { name: 'Mar 2021', uv: 300, pv: 100, amt: 2000 }];

const Spendings = () => {
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [spendings, setSpendings] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [activeEditSpending, setActiveEditSpending] = useState(false);

    useEffect(() => {
        const initialSetup = async () => {
            const response = await SpendingService.fetchAll()
            setSpendings(response.data.spendings.reverse().splice(0, 10))
            setLoading(() => false)
        }
        initialSetup();
    }, []);

    const searchHandler = (event) => {
        setSearchText(() => event.target.value);
    };

    const getDescriptionText = useCallback((breakdowns) => {
        let items = ''
        breakdowns.map((breakdown, index) => {
            if (breakdown.item) {
                if (index === breakdowns.length - 1) {
                    items += breakdown.item
                }
                else items += breakdown.item + ', '
            }
            return true
        })
        return items;
    }, [])

    const addSpending = useCallback((data) => {
        let spendingRecord = data.spending
        spendingRecord.Breakdowns = data.Breakdowns
        spendingRecord.Borroweds = data.Borroweds
        spendingRecord.Lents = data.Lents
        setSpendings((oldValue) => {
            return [
                spendingRecord,
                ...oldValue,
            ]
        })
    }, [])

    const updateSpending = useCallback((data) => {
        let spendingRecord = data.spending
        spendingRecord.Breakdowns = data.Breakdowns
        spendingRecord.Borroweds = data.Borroweds
        spendingRecord.Lents = data.Lents
        setSpendings((oldValue) => {
            console.log(oldValue)
            console.log(spendingRecord.id)
            let findIndex = oldValue.findIndex(el => el.id === Number(spendingRecord.id))
            console.log(findIndex)
            oldValue[findIndex] = spendingRecord
            console.log(oldValue)
            return [
                ...oldValue,
            ]
        })
    }, [])

    const showEditSpending = (spending) => {
        setActiveEditSpending(() => spending)
        setEditModal(() => true)
    }

    const hideEditSpending = () => {
        setEditModal(() => false)
        setActiveEditSpending(() => null)
    }

    return (
        <div>
            {editModal &&
                <EditSpending spending={activeEditSpending} updateSpending={updateSpending} close={hideEditSpending} />
            }
            <div className="mb-3">
                <div className="text-left font-bold text-xl mb-1 text-main dark:text-primary w-full">
                    All Spendings
                </div>
                <div className="text-left">
                    <form>
                        <div
                            className="flex bg-gray-300 dark:bg-dark rounded-lg "
                            style={{ maxWidth: "500px" }}
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
                                    className="mt-3 text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                                />
                            </span>
                        </div>
                    </form>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 w-full justify-around gap-6">
                {/* <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-4" style={{ width: '100vw', maxWidth: '600px' }}> */}
                {!loading && <div className="md:col-span-4 bg-gray-300 dark:bg-dark rounded-sm p-4">
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
                            {spendings.map((spending, index) => (
                                <tr className="text-center" key={index}>
                                    <td className="border-b p-2 border-r">{index + 1}</td>
                                    <td className="border-b">₦ {spending.amount.toLocaleString()}</td>
                                    <td className="border-b">
                                        <Moment format="Do ddd YYYY HH:mm">{spending.date}</Moment>
                                    </td>
                                    <td className="border-b">{getDescriptionText(spending.Breakdowns)}</td>
                                    <td className="border-b text-right">
                                        <FaEdit
                                            onClick={() => showEditSpending(spending)}
                                            className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer text-center"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
                {loading && <p>Loading Spending records. please wait</p>}
                <div className="md:col-span-2">
                    <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-4 mb-3">
                        <div className="text-left dark:text-primary text-main mb-2">Quick Add</div>
                        <div className="flex justify-left">
                            <form className="">
                                <div className="text-left mb-3">
                                    <label className="">Amount *</label>
                                    <input className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <div className="text-left mb-3">
                                    <label className="">Description</label>
                                    <input className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <div className="text-left mb-3">
                                    <label className="">Date</label>
                                    <input className="mt-1 p-1.5 rounded-sm dark:bg-black bg-gray-200 outline-none w-full" />
                                </div>
                                <button className="w-full dark:bg-primary text-white bg-main px-2 py-2 rounded-md mb-2 opacity-90 hover:opacity-100">Submit</button>
                                <CreateSpending addSpending={addSpending} />
                            </form>
                        </div>
                    </div>

                </div>


            </div>
            <div className="w-full mt-6">
                <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-2">
                    <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} >
                        <Line type="monotone" dataKey="uv" stroke="#d96704" />
                        <CartesianGrid stroke="#d96704" strokeDasharray="5 5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default Spendings;
