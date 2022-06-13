import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import SpendingActionsService from "../../../services/spending-actions-service";
import Modal from "../../UI/modal";
import useSpending from "../../../hooks/use-spending";

const formInputClass = 'outline-none dark:bg-dark bg-gray-100 p-2 rounded-md w-full mb-2'

const CreateBorrowed = ({ addBorrowed, setRequestState }) => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const {
        date,
        spending,
        addFields,
        deleteField,
        initialCreateSetup,
        inputChangeHandler,
        dateChangeHandler,
        // validateForm,
        reset,
    } = useSpending(user);

    useEffect(() => {
        if (user) {
            initialCreateSetup();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const recordBorrowed = async () => {
        let form = spending.Borroweds;

        setRequestState(() => true)

        try {
            const response = await SpendingActionsService.createBorrowed(form);
            if (response.status === 201) {
                setShowModal(() => false);
                toast.success("Successfully added your borrowed record(s)");
                addBorrowed(response.data);
                reset();
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setRequestState(() => false)
        }
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button
                type="button"
                onClick={openModal}
                className="w-full border-2 dark:border-primary border-main hover:bg-main hover:text-white hover:dark:bg-primary px-2 py-2 rounded-md"
            >
                Create Multiple
            </button>
            {showModal && (
                <Modal closeModal={closeModal}>
                    <div>
                        <div className="text-left font-bold text-lg ">Create Borrowed Record(s)</div>
                        <input
                            onChange={dateChangeHandler}
                            value={date}
                            type="date"
                            className={`${formInputClass} mt-4 mb-2`}
                            placeholder="Enter Date *"
                        />
                        <div style={{ minWidth: "300px", overlayY: "auto" }}>
                            {spending.Borroweds.map((borrowed, index) => (
                                <div key={index}>
                                    <div className="mb-2 text-left">Item {index + 1} &nbsp;
                                        <FaTrash
                                            onClick={() => deleteField("Borroweds", borrowed.pageId, borrowed.id)}
                                            className="text-red-500 dark:text-red-400 text-sm cursor-pointer inline"
                                        /></div>
                                    <div className="pl-6" style={{ maxWidth: "500px" }}>
                                        <input
                                            type="number"
                                            value={borrowed.amount}
                                            onChange={(e) =>
                                                inputChangeHandler(
                                                    e.target.value,
                                                    borrowed.pageId,
                                                    "Borroweds",
                                                    "amount"
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
                                                    "Borroweds",
                                                    "description"
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
                        onClick={() => addFields("Borroweds")}
                        className="w-full dark:bg-primary bg-main text-white p-1.5 rounded-md"
                    >
                        Add more borrowed records
                    </button>
                    <div className="flex mt-4 gap-2">
                        <div className="w-1/2">
                            <button
                                type="button"
                                onClick={recordBorrowed}
                                className="dark:bg-primary bg-main text-white w-full rounded-sm py-1"
                            >
                                Record
                            </button>
                        </div>
                        <div className="w-1/2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="dark:bg-secondary bg-primary w-full rounded-sm py-1"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CreateBorrowed;
