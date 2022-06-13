import { useState, useCallback, useEffect } from "react";
import toast from 'react-hot-toast';

let currentDate = new Date();
currentDate =
    currentDate.getFullYear() +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentDate.getDate()).slice(-2);

const fields = {
    breakdown: {
        pageId: null,
        item: "",
        price: "",
        quantity: 1,
    },
    borrowed: {
        pageId: null,
        amount: "",
        description: "",
        date: "",
        repay_date: "",
        user_id: null,
    },
    lent: {
        pageId: null,
        amount: "",
        description: "",
        date: "",
        repay_date: "",
        user_id: null,
    },
};

const useSpending = (user) => {
    const [breakdownCounter, setBreakdownCounter] = useState(1);
    const [borrowedCounter, setBorrowedCounter] = useState(1);
    const [lentCounter, setLentCounter] = useState(1);

    const [id, setId] = useState(null);
    const [date, setDate] = useState(currentDate);
    const [amount, setAmount] = useState(0);

    const [borroweds, setBorroweds] = useState([]);
    const [breakdowns, setBreakdowns] = useState([]);
    const [lents, setLents] = useState([]);

    const [removedFields, setRemovedFields] = useState({
        Breakdowns: [],
        Borroweds: [],
        Lents: [],
    });

    const addFields = useCallback(
        (type = "breakdown", length = 1) => {
            let newFields = [];
            let formField = Object.assign({}, fields[type]);
            formField.user_id = user.id;
            formField.date = currentDate;
            let countBreakdown = breakdownCounter;
            let countBorrowed = borrowedCounter;
            let countLent = lentCounter;

            for (let i = 0; i < length; i++) {
                if (type === "breakdown") {
                    formField.pageId = countBreakdown;
                    countBreakdown += 1;
                } else if (type === "borrowed") {
                    formField.pageId = countBorrowed;
                    countBorrowed += 1;
                } else if (type === "lent") {
                    formField.pageId = countLent;
                    countLent += 1;
                }
                newFields.push(JSON.parse(JSON.stringify(formField)));
            }
            if (type === "breakdown") {
                setBreakdowns((old) => {
                    return [...old, ...newFields];
                });
                setBreakdownCounter((oldValue) => countBreakdown);
            } else if (type === "borrowed") {
                setBorroweds((old) => {
                    return [...old, ...newFields];
                });
                setBorrowedCounter((oldValue) => countBorrowed);
            } else if (type === "lent") {
                setLents((old) => {
                    return [...old, ...newFields];
                });
                setLentCounter((oldValue) => countLent);
            }
        },
        [borrowedCounter, breakdownCounter, lentCounter, user]
    );

    useEffect(() => {
        let totalBreakdown = () =>
            breakdowns.reduce(function (total, breakdown) {
                if (
                    isNaN(Number(breakdown.price)) ||
                    isNaN(Number(breakdown.quantity))
                ) {
                    return total + 0;
                } else {
                    return total + Number(breakdown.price) * Number(breakdown.quantity);
                }
            }, 0);
        let totalBorrowed = () =>
            borroweds.reduce(function (total, borrowed) {
                if (!borrowed.amount || isNaN(Number(borrowed.amount))) {
                    return total + 0;
                } else {
                    return total + Number(borrowed.amount);
                }
            }, 0);
        let totalLent = () =>
            lents.reduce(function (total, lent) {
                if (!lent.amount || isNaN(Number(lent.amount))) {
                    return total + 0;
                } else {
                    return total + Number(lent.amount);
                }
            }, 0);
        setAmount(() => totalBreakdown() + totalLent() + totalBorrowed());
    }, [breakdowns, borroweds, lents]);

    const initialCreateSetup = useCallback(() => {
        addFields("breakdown", 2);
        addFields("borrowed", 1);
        addFields("lent", 1);
    }, [addFields]);

    const initialEditSetup = (spending) => {
        setBreakdowns(() => spending.Breakdowns)
        setBorroweds(() => spending.Borroweds)
        setLents(() => spending.Lents)
        setAmount(() => spending.amount)
        setDate(() => spending.date)
        setId(() => spending.id)
    }

    const inputChangeHandler = useCallback((value, id, type, field) => {
        if (type === "breakdown") {
            setBreakdowns((oldValue) => {
                let findObject = oldValue.find((el) => el.pageId === id);
                findObject[field] = value;
                return [...oldValue];
            });
        } else if (type === "borrowed") {
            setBorroweds((oldValue) => {
                let findObject = oldValue.find((el) => el.pageId === id);
                findObject[field] = value;
                return [...oldValue];
            });
        } else if (type === "lent") {
            setLents((oldValue) => {
                let findObject = oldValue.find((el) => el.pageId === id);
                findObject[field] = value;
                return [...oldValue];
            });
        }
    }, []);

    const dateChangeHandler = useCallback((event) => {
        setDate(() => event.target.value);
    }, []);

    const showErrors = useCallback((errors) => {
        errors.map((error) => {
            return toast(error);
        });
    }, []);

    const validateForm = useCallback((form) => {
        let total = 0;
        let errors = [];
        let minor_errors = [];
        let i = 0; //counter

        let breakdowns = form.breakdowns;
        for (i = 0; i < breakdowns.length; i++) {
            if (breakdowns[i].price) {
                if (!Number(breakdowns[i].price || !Number(breakdowns[i].quantity))) {
                    errors.push(
                        "The price/qauntity for field" + (i + 1) + " is not valid"
                    );
                } else {
                    breakdowns[i].price = parseInt(breakdowns[i].price);
                    total += breakdowns[i].price * parseInt(breakdowns[i].quantity);
                }
            } else if (breakdowns[i].item) {
                minor_errors.push(
                    "You provided an item for breakdown in field " +
                    (i + 1) +
                    " of the table"
                );
            } else {
                breakdowns.splice(i, 1);
                i--;
            }
        }

        let borroweds = form.borroweds;
        for (i = 0; i < borroweds.length; i++) {
            if (borroweds[i].amount) {
                if (!Number(borroweds[i].amount)) {
                    errors.push("The price for field" + (i + 1) + " is not valid");
                } else {
                    borroweds[i].amount = parseInt(borroweds[i].amount);
                    total += borroweds[i].amount;
                }
            } else if (borroweds[i].description || borroweds[i].repay_date) {
                if (borroweds[i].description) {
                    minor_errors.push(
                        "You provided a description for an amount(not specified) you borrowed in field " +
                        (i + 1) +
                        " of the lents table"
                    );
                }
                if (borroweds[i].repay_date) {
                    minor_errors.push(
                        "You provided a repay_date for an amount(not specified) you borrowed in field " +
                        (i + 1) +
                        " of the lents table"
                    );
                }
            } else {
                borroweds.splice(i, 1);
                i--; // return to previous index to take care of the splicing
            }
        }

        let lents = form.lents;
        for (i = 0; i < lents.length; i++) {
            if (lents[i].amount) {
                if (!Number(lents[i].amount)) {
                    errors.push("The price for field" + (i + 1) + " is not valid");
                    errors++;
                } else {
                    lents[i].amount = parseInt(lents[i].amount);
                    total += lents[i].amount;
                }
            } else if (lents[i].description || lents[i].repay_date) {
                if (lents[i].description) {
                    minor_errors.push(
                        "You provided a description for an amount(not specified) you lent in field " +
                        (i + 1) +
                        " of the lents table"
                    );
                }
                if (lents[i].repay_date) {
                    minor_errors.push(
                        "You provided a repay_date for an amount(not specified) you lent in field " +
                        (i + 1) +
                        " of the lents table"
                    );
                }
            } else {
                lents.splice(i, 1);
                i--;
            }
        }

        form.amount = total;

        if (errors.length > 0) {
            showErrors(errors);
            return false;
        }

        if (minor_errors.length > 0) {
            showErrors(minor_errors);
            return false;
        }

        if (!total) {
            return showErrors(["The total amount is zero!"]);
        }

        return form;
    }, [showErrors]);

    const reset = useCallback(() => {
        setBreakdownCounter(() => 1);
        setBorrowedCounter(() => 1);
        setLentCounter(() => 1);
        setAmount(() => 0);
        setBreakdowns(() => []);
        setBorroweds(() => []);
        setLents(() => []);
        initialCreateSetup();
    }, [initialCreateSetup]);

    const deleteField = useCallback((type, pageId, id) => {
        let findIndex = null;
        if (id) {
            if (type === 'Breakdowns') {
                findIndex = breakdowns.findIndex(el => el.id === id)
                setRemovedFields((oldValue) => {
                    oldValue[type].push(breakdowns[findIndex].id)
                    return oldValue
                })
                // Delelte field from the spending object
                setBreakdowns((oldValue) => {
                    oldValue.splice(findIndex, 1)
                    return [...oldValue]
                })
            }
            else if (type === 'Borroweds') {
                findIndex = borroweds.findIndex(el => el.id === id)
                setRemovedFields((oldValue) => {
                    oldValue[type].push(borroweds[findIndex].id)
                    return oldValue
                })
                // Delelte field from the spending object
                setBorroweds((oldValue) => {
                    oldValue.splice(findIndex, 1)
                    return [...oldValue]
                })
            }
            else if (type === 'Lents') {
                findIndex = lents.findIndex(el => el.id === id)
                setRemovedFields((oldValue) => {
                    oldValue[type].push(lents[findIndex].id)
                    return oldValue
                })
                // Delelte field from the spending object
                setLents((oldValue) => {
                    oldValue.splice(findIndex, 1)
                    return [...oldValue]
                })
            }
        } else {
            if (type === 'Breakdowns') {
                findIndex = breakdowns.findIndex(el => el.pageId === pageId)
                setBreakdowns((oldValue) => {
                    oldValue.splice(findIndex, 1)
                    return [...oldValue]
                })
            }
            else if (type === 'Borroweds') {
                findIndex = borroweds.findIndex(el => el.pageId === pageId)
                setBorroweds((oldValue) => {
                    oldValue.splice(findIndex, 1)
                    return [...oldValue]
                })
            }
            else if (type === 'Lents') {
                findIndex = lents.findIndex(el => el.pageId === pageId)
                setLents((oldValue) => {
                    oldValue.splice(findIndex, 1)
                    return [...oldValue]
                })
            }
        }
    }, [borroweds, breakdowns, lents])

    return {
        breakdownCounter,
        borrowedCounter,
        lentCounter,
        date,
        amount,
        borroweds,
        breakdowns,
        lents,
        initialCreateSetup,
        inputChangeHandler,
        dateChangeHandler,
        addFields,
        reset,
        validateForm,

        id,
        initialEditSetup,
        deleteField,
        removedFields
    };
};

export default useSpending;
