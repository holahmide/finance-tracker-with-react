import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

let currentDate = new Date();
currentDate =
    currentDate.getFullYear() +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentDate.getDate()).slice(-2);

const fields = {
    Breakdowns: {
        pageId: null,
        item: "",
        price: "",
        quantity: 1,
    },
    Borroweds: {
        pageId: null,
        amount: "",
        description: "",
        date: "",
        repay_date: "",
        user_id: null,
    },
    Lents: {
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

    const [spending, setSpending] = useState({
        Borroweds: [],
        Breakdowns: [],
        Lents: [],
    });

    const [removedFields, setRemovedFields] = useState({
        Breakdowns: [],
        Borroweds: [],
        Lents: [],
    });

    const addFields = useCallback(
        (type = "Breakdowns", length = 1) => {
            let newFields = [];
            let formField = Object.assign({}, fields[type]);
            formField.user_id = user.id;
            formField.date = currentDate;

            let countBreakdown = breakdownCounter;
            let countBorrowed = borrowedCounter;
            let countLent = lentCounter;

            for (let i = 0; i < length; i++) {
                if (type === "Breakdowns") {
                    formField.pageId = countBreakdown;
                    countBreakdown += 1;
                } else if (type === "Borroweds") {
                    formField.pageId = countBorrowed;
                    countBorrowed += 1;
                } else if (type === "Lents") {
                    formField.pageId = countLent;
                    countLent += 1;
                }
                newFields.push(JSON.parse(JSON.stringify(formField)));
            }

            if (type === "Breakdowns") setBreakdownCounter(() => countBreakdown);
            else if (type === "Borroweds") setBorrowedCounter(() => countBorrowed);
            else if (type === "Lents") setLentCounter(() => countLent);

            setSpending((oldValue) => {
                oldValue[type].push(...newFields);
                return {
                    ...oldValue,
                };
            });
        },
        [borrowedCounter, breakdownCounter, lentCounter, user]
    );

    useEffect(() => {
        let totalBreakdown = () =>
            spending.Breakdowns.reduce(function (total, breakdown) {
                if (!Number(breakdown.quantity)) breakdown.quantity = 1
                if (
                    isNaN(Number(breakdown.price)) ||
                    isNaN(Number(breakdown.quantity))
                ) {
                    return total + 0;
                } else {
                    return total + (Number(breakdown.price) * Number(breakdown.quantity));
                }
            }, 0);
        let totalBorrowed = () =>
            spending.Borroweds.reduce(function (total, borrowed) {
                if (!borrowed.amount || isNaN(Number(borrowed.amount))) {
                    return total + 0;
                } else {
                    return total + Number(borrowed.amount);
                }
            }, 0);
        let totalLent = () =>
            spending.Lents.reduce(function (total, lent) {
                if (!lent.amount || isNaN(Number(lent.amount))) {
                    return total + 0;
                } else {
                    return total + Number(lent.amount);
                }
            }, 0);
        setAmount(() => totalBreakdown() + totalLent() + totalBorrowed());
    }, [spending]);

    const initialCreateSetup = useCallback(() => {
        addFields("Breakdowns", 2);
        addFields("Borroweds", 1);
        addFields("Lents", 1);
    }, [addFields]);

    const initialEditSetup = (spending) => {
        setSpending((oldValue) => {
            oldValue["Breakdowns"] = spending.Breakdowns ? spending.Breakdowns : [];
            oldValue["Borroweds"] = spending.Borroweds ? spending.Borroweds : [];
            oldValue["Lents"] = spending.Lents ? spending.Lents : [];
            return {
                ...oldValue,
            };
        });
        setAmount(() => spending.amount);
        setDate(() => spending.date);
        setId(() => spending.id);
    };

    const inputChangeHandler = useCallback(
        (value, pageId, type, field, id = null) => {
            setSpending((oldValue) => {
                let findIndex = -1;
                if (id) { // For old records of spending, that wont have a pageId
                    findIndex = oldValue[type].findIndex((el) => Number(el.id) === id);
                } else { // For new record assingned a page number
                    findIndex = oldValue[type].findIndex((el) => el.pageId === pageId);
                }

                oldValue[type][findIndex][field] = value;
                return { ...oldValue };
            });
        },
        []
    );

    const dateChangeHandler = useCallback((event) => {
        setDate(() => event.target.value);
    }, []);

    const showErrors = useCallback((errors) => {
        errors.map((error) => {
            return toast(error);
        });
    }, []);

    const validateForm = useCallback(
        (form) => {
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
        },
        [showErrors]
    );

    const validateSpendingAction = useCallback((form) => {
        if (form.amount) {
            if (!Number(form.amount)) {
                toast("The price is not valid");
                return false;
            } else {
                form.amount = parseInt(form.amount);
            }
        } else if (form.description || form.repay_date) {
            if (form.description) {
                toast(
                    "You provided a description for an amount(not specified) you lent"
                );
                return false;
            }
            if (form.repay_date) {
                toast(
                    "You provided a repay_date for an amount(not specified) you lent"
                );
                return false;
            }
        } else {
            toast('The amount is required!')

            return false;
        }

        return true
    }, []);

    const reset = useCallback(() => {
        setBreakdownCounter(() => 1);
        setBorrowedCounter(() => 1);
        setLentCounter(() => 1);
        setAmount(() => 0);
        setSpending((oldValue) => {
            oldValue["Breakdowns"] = [];
            oldValue["Breakdowns"] = [];
            oldValue["Lents"] = [];
            return {
                ...oldValue,
            };
        });
        initialCreateSetup();
    }, [initialCreateSetup]);

    const deleteField = useCallback(
        (type, pageId, id) => {
            let findIndex = null;
            if (id) {
                findIndex = spending[type].findIndex((el) => el.id === id);
                setRemovedFields((oldValue) => {
                    oldValue[type].push(spending[type][findIndex].id);
                    return oldValue;
                });
                setSpending((oldValue) => {
                    oldValue[type].splice(findIndex, 1);
                    return { ...oldValue };
                });
            } else {
                findIndex = spending[type].findIndex((el) => el.pageId === pageId);
                setSpending((oldValue) => {
                    oldValue[type].splice(findIndex, 1);
                    return { ...oldValue };
                });
            }
        },
        [spending]
    );

    return {
        id,
        breakdownCounter,
        borrowedCounter,
        lentCounter,
        date,
        amount,
        spending,
        removedFields,

        initialCreateSetup,
        inputChangeHandler,
        dateChangeHandler,
        addFields,
        reset,
        validateForm,
        initialEditSetup,
        validateSpendingAction,
        deleteField,
    };
};

export default useSpending;
