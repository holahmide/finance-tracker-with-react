import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const Spendings = () => {
    const [searchText, setSearchText] = useState(null);

    const searchHandler = (event) => {
        setSearchText(() => event.target.value)
    }

    useEffect(() => {
        // effect
        return () => {
            // cleanup
        };
    }, [searchText]);

    return (
        <div>
            <div className="mb-3">
                <div className="text-left font-bold text-xl mb-1 text-main dark:text-primary w-full">All Spendings</div>
                <div className="text-left">
                    <form>
                        <div className="flex bg-gray-300 dark:bg-dark rounded-lg " style={{ maxWidth : '500px' }}>
                            <input onChange={searchHandler} type="text" placeholder="Search for any record by date (12-12-2022), description or amount" className="p-2 bg-transparent outline-none w-full" />
                            <span style={{ width: '50px' }}>
                                <FaSearch
                                    onClick={() => searchHandler()}
                                    className="mt-3 text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                                />
                            </span>
                        </div>
                    </form>
                </div>
            </div>
            <div className="flex flex-wrap w-full justify-between gap-6">
                <div className="bg-gray-300 dark:bg-dark rounded-sm w-full p-4" style={{ width: '100vw', maxWidth: '600px' }}>
                    <table className="w-full">
                        <thead>
                            <th>S/N</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Description</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td># 2,000</td>
                                <td>3rd January, 2022 10:58</td>
                                <td>SPent on bread, books, water, blanket....</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="w-full bg-gray-300 dark:bg-dark rounded-sm">
                    Extras
                </div>
            </div>
        </div>
    );
}

export default Spendings;