import { useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import { AuthContext } from '../../context/AuthContext';
import SpendingService from '../../services/spending-service';
import Modal from './modal'

let currentDate = new Date()
currentDate = currentDate.getFullYear() + "-" + ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" + ("0" + currentDate.getDate()).slice(-2)

const fields = {
    breakdown: {
        pageId: null,
        item: '',
        price: '',
        quantity: 1
    },
    borrowed: {
        pageId: null,
        amount: '',
        description: '',
        date: '',
        repay_date: '',
        user_id: null
    },
    lent: {
        pageId: null,
        amount: '',
        description: '',
        date: '',
        repay_date: '',
        user_id: null
    }
}

const CreateSpending = ({ addSpending }) => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [breakdownCounter, setBreakdownCounter] = useState(1);
    const [borrowedCounter, setBorrowedCounter] = useState(1);
    const [lentCounter, setLentCounter] = useState(1);

    const [date, setDate] = useState(currentDate);
    const [amount, setAmount] = useState(0);

    const [borroweds, setBorroweds] = useState([]);
    const [breakdowns, setBreakdowns] = useState([]);
    const [lents, setLents] = useState([]);


    const addFields = useCallback(
        (type = 'breakdown', length = 1) => {
            let newFields = [];
            let formField = Object.assign({}, fields[type]);
            formField.user_id = user.id
            formField.date = currentDate
            let countBreakdown = breakdownCounter;
            let countBorrowed = borrowedCounter;
            let countLent = lentCounter;

            for (let i = 0; i < length; i++) {
                if (type === 'breakdown') { formField.pageId = countBreakdown; countBreakdown += 1; }
                else if (type === 'borrowed') { formField.pageId = countBorrowed; countBorrowed += 1; }
                else if (type === 'lent') { formField.pageId = countLent; countLent += 1; }
                newFields.push(JSON.parse(JSON.stringify(formField)))
            }
            if (type === 'breakdown') {
                setBreakdowns((old) => {
                    return [
                        ...old,
                        ...newFields
                    ]
                })
                setBreakdownCounter(oldValue => countBreakdown)
            }
            else if (type === 'borrowed') {
                setBorroweds((old) => {
                    return [
                        ...old,
                        ...newFields
                    ]
                })
                setBorrowedCounter(oldValue => countBorrowed)

            }
            else if (type === 'lent') {
                setLents((old) => {
                    return [
                        ...old,
                        ...newFields
                    ]
                })
                setLentCounter(oldValue => countLent)

            }
        },
        [borrowedCounter, breakdownCounter, lentCounter, user],
    );

    useEffect(() => {
        let totalBreakdown = () => breakdowns.reduce(function (total, breakdown) {
            if (isNaN(Number(breakdown.price)) || isNaN(Number(breakdown.quantity))) {
                return total + 0
            } else {
                return total + (Number(breakdown.price) * Number(breakdown.quantity))
            }
        }, 0)
        let totalBorrowed = () =>
            borroweds.reduce(function (total, borrowed) {
                if (!borrowed.amount || isNaN(Number(borrowed.amount))) {
                    return total + 0
                } else {
                    return total + Number(borrowed.amount)
                }
            }, 0)
        let totalLent = () =>
            lents.reduce(function (total, lent) {
                if (!lent.amount || isNaN(Number(lent.amount))) {
                    return total + 0
                } else {
                    return total + Number(lent.amount)
                }
            }, 0)
        setAmount(() => totalBreakdown() + totalLent() + totalBorrowed())

    }, [breakdowns, borroweds, lents]);

    const initialSetup = () => {
        addFields('breakdown', 2)
        addFields('borrowed', 1)
        addFields('lent', 1)
    }


    useEffect(() => {
        if (user) {
            initialSetup()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const inputChangeHandler = useCallback((value, id, type, field) => {
        if (type === 'breakdown') {
            setBreakdowns((oldValue) => {
                let findObject = oldValue.find(el => el.pageId === id);
                findObject[field] = value
                return [
                    ...oldValue,
                ]
            })
        }
        else if (type === 'borrowed') {
            setBorroweds((oldValue) => {
                let findObject = oldValue.find(el => el.pageId === id);
                findObject[field] = value
                return [
                    ...oldValue,
                ]
            })
        }
        else if (type === 'lent') {
            setLents((oldValue) => {
                let findObject = oldValue.find(el => el.pageId === id);
                findObject[field] = value
                return [
                    ...oldValue,
                ]
            })
        }
    }, []);

    const dateChangeHandler = useCallback((event) => {
        setDate(() => event.target.value);
    }, []);

    const validateForm = (form) => {
        let total = 0
        let errors = []
        let minor_errors = []
        let i = 0 //counter

        let breakdowns = form.breakdowns
        for (i = 0; i < breakdowns.length; i++) {
            if (breakdowns[i].price) {
                if (!Number(breakdowns[i].price || !Number(breakdowns[i].quantity))) {
                    errors.push('The price/qauntity for field' + (i + 1) + ' is not valid')
                } else {
                    breakdowns[i].price = parseInt(breakdowns[i].price);
                    total += breakdowns[i].price * parseInt(breakdowns[i].quantity)
                }
            }
            else if (breakdowns[i].item) {
                minor_errors.push('You provided an item for breakdown in field ' + (i + 1) + ' of the table')
            }
            else {
                breakdowns.splice(i, 1);
                i--;
            }
        }

        let borroweds = form.borroweds
        for (i = 0; i < borroweds.length; i++) {
            if (borroweds[i].amount) {
                if (!Number(borroweds[i].amount)) {
                    errors.push('The price for field' + (i + 1) + ' is not valid')
                } else {
                    borroweds[i].amount = parseInt(borroweds[i].amount);
                    total += borroweds[i].amount
                }
            }
            else if (borroweds[i].description || borroweds[i].repay_date) {
                if (borroweds[i].description) {
                    minor_errors.push('You provided a description for an amount(not specified) you borrowed in field ' + (i + 1) + ' of the lents table')
                }
                if (borroweds[i].repay_date) {
                    minor_errors.push('You provided a repay_date for an amount(not specified) you borrowed in field ' + (i + 1) + ' of the lents table')
                }
            }
            else {
                borroweds.splice(i, 1);
                i--; // return to previous index to take care of the splicing
            }
        }

        let lents = form.lents
        for (i = 0; i < lents.length; i++) {
            if (lents[i].amount) {
                if (!Number(lents[i].amount)) {
                    errors.push('The price for field' + (i + 1) + ' is not valid')
                    errors++
                } else {
                    lents[i].amount = parseInt(lents[i].amount);
                    total += lents[i].amount;
                }
            }
            else if (lents[i].description || lents[i].repay_date) {
                if (lents[i].description) {
                    minor_errors.push('You provided a description for an amount(not specified) you lent in field ' + (i + 1) + ' of the lents table')
                }
                if (lents[i].repay_date) {
                    minor_errors.push('You provided a repay_date for an amount(not specified) you lent in field ' + (i + 1) + ' of the lents table')
                }
            }
            else {
                lents.splice(i, 1);
                i--;
            }
        }

        form.amount = total

        if (errors.length > 0) {
            showErrors(errors);
            return false
        }

        if (minor_errors.length > 0) {
            showErrors(minor_errors);
            return false
        }

        if (!total) {
            return showErrors(['The total amount is zero!']);
        }

        return form
    }

    const showErrors = useCallback((errors) => {
        errors.map((error) => {
            return toast(error)
        })
    }, []);

    const recordSpending = async () => {
        let form = {
            date: date,
            amount: 3000,
            breakdowns: breakdowns,
            borroweds: borroweds,
            lents: lents,
        }
        form = validateForm(JSON.parse(JSON.stringify(form)))

        if (form) {
            const response = await SpendingService.create(form);
            if (response.status === 201) {
                setShowModal(() => false);
                toast.success("Successfully added your spending record")
                addSpending(response.data)
                reset();
            }
        }
    }

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const reset = () => {
        setBreakdownCounter(() => 1)
        setBorrowedCounter(() => 1)
        setLentCounter(() => 1)
        setAmount(() => 0)
        setBreakdowns(() => [])
        setBorroweds(() => [])
        setLents(() => [])
        initialSetup();
    }

    return (
        <div>
            <button type="button" onClick={openModal} className="w-full border-2 dark:border-primary border-main hover:bg-main hover:dark:bg-primary px-2 py-2 rounded-md">Create Multiple</button>
            {showModal && <Modal>
                <div>
                    <div className='text-left font-bold text-lg '>Create Spending</div>
                    <div className='absolute right-0 top-0 p-4'>
                        <FaTimes
                            onClick={closeModal}
                            className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                        />
                    </div>
                    <input onChange={dateChangeHandler} value={date} type="date" className='mt-6 outline-none bg-dark p-2 rounded-md w-full mb-4' placeholder="Enter Date *" />
                    <div style={{ minWidth: '300px', overlayY: 'auto' }}>
                        {breakdowns.map((breakdown, index) => <div key={index}>
                            <div className='mb-2 text-left'>Item {index + 1}</div>
                            <div className='pl-6' style={{ maxWidth: '500px' }}>
                                <input type="number" value={breakdown.price} onChange={(e) => inputChangeHandler(e.target.value, breakdown.pageId, 'breakdown', 'price')} className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Price *" />
                                <input value={breakdown.item} onChange={(e) => inputChangeHandler(e.target.value, breakdown.pageId, 'breakdown', 'item')} className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Item" />
                            </div>
                        </div>)}

                    </div>
                </div>
                <button type="button" onClick={() => addFields('breakdown')} className='w-full bg-primary p-1.5 rounded-md'>
                    Add more spending records
                </button>
                <div className='mt-4'>
                    <div className='text-left font-bold text-lg '>Create Borrowed (if any)</div>
                    <div style={{ minWidth: '300px', overlayY: 'auto' }}>
                        {borroweds.map((borrowed, index) => <div key={index}>
                            <div className='mb-2 text-left'>Item {index + 1}</div>
                            <div className='pl-6' style={{ maxWidth: '500px' }}>
                                <input type="number" value={borrowed.amount} onChange={(e) => inputChangeHandler(e.target.value, borrowed.pageId, 'borrowed', 'amount')} className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                <input value={borrowed.description} onChange={(e) => inputChangeHandler(e.target.value, borrowed.pageId, 'borrowed', 'description')} className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Description" />
                            </div>
                        </div>)}
                    </div>
                </div>
                <button type="button" onClick={() => addFields('borrowed')} className='w-full bg-primary p-1.5 rounded-md'>
                    Add more borrowed records
                </button>
                <div className='mt-4'>
                    <div className='text-left font-bold text-lg '>Create Lent (if any)</div>
                    <div style={{ minWidth: '300px', overlayY: 'auto' }}>
                        {lents.map((lent, index) => <div key={index}>
                            <div className='mb-2 text-left'>Item {index + 1}</div>
                            <div className='pl-6' style={{ maxWidth: '500px' }}>
                                <input type="number" value={lent.amount} onChange={(e) => inputChangeHandler(e.target.value, lent.pageId, 'lent', 'amount')} className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                <input value={lent.description} onChange={(e) => inputChangeHandler(e.target.value, lent.pageId, 'lent', 'description')} className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Description" />
                            </div>
                        </div>)}
                    </div>
                </div>
                <button type="button" onClick={() => addFields('lent')} className='w-full bg-primary p-1.5 rounded-md'>
                    Add more lent records
                </button>
                <div className='mt-2'>Total: ₦ {amount.toLocaleString()}</div>
                <div className='flex mt-4 gap-2'>
                    <div className="w-1/2"><button type="button" onClick={recordSpending} className='dark:bg-primary bg-main w-full rounded-sm py-1'>Record</button></div>
                    <div className="w-1/2"><button type="button" onClick={closeModal} className='dark:bg-secondary bg-primary w-full rounded-sm py-1'>Close</button></div>
                </div>
            </Modal>}
            {/* {<Modal
                isOpen={showModal}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className='relative'>
                    <div className='absolute right-0 top-0'>
                        <FaTimes
                            onClick={closeModal}
                            className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                        />
                    </div>
                    <div className='text-left font-bold text-lg '>Create Spending</div>
                    <div style={{ minWidth: '300px', overlayY: 'auto' }}>
                        <form>
                            <div>
                                <div className='mb-2'>Item 1</div>
                                <div className='pl-6' style={{ maxWidth: '500px' }}>
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Description *" />
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Date *" />
                                </div>
                            </div>
                            <div>
                                <div className='mb-2'>Item 2</div>
                                <div className='pl-6' style={{ maxWidth: '500px' }}>
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Description *" />
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Date *" />
                                </div>
                            </div>
                            <div>
                                <div className='mb-2'>Item 1</div>
                                <div className='pl-6' style={{ maxWidth: '500px' }}>
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Description *" />
                                    <input className='bg-black p-2 rounded-md w-full mb-2' placeholder="Enter Date *" />
                                </div>
                            </div>
    

                        </form>
                    </div>

                </div>

            </Modal>} */}
        </div>
    );
}

export default CreateSpending;