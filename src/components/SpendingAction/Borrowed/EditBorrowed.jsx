import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import SpendingActionsService from "../../../services/spending-actions-service";
import Modal from "../../UI/modal";
import useSpending from "../../../hooks/use-spending";

const formInputClass = 'outline-none dark:bg-dark bg-gray-100 p-2 rounded-md w-full mb-2'

const EditLent = ({ lent: lentData, close, updateLent, setRequestState }) => {
    const { user } = useContext(AuthContext);
    const [showModal,] = useState(true);
    const [lent] = useState(Object.assign({}, lentData));

    const {
        date,
        spending: spendingObject,
        initialEditSetup,
        inputChangeHandler,
        dateChangeHandler,
        reset,
        validateSpendingAction,
    } = useSpending(user);

    useEffect(() => {
        if (user) {
            initialEditSetup({ Lents: [lent] });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // console.log(lentObject)


    const editLent = async () => {
        let form = {
            ...spendingObject.Lents[0],
        };

        setRequestState(() => true)
        if (!validateSpendingAction(form)) {
            setRequestState(() => false)
            return
        }

        try {
            const response = await SpendingActionsService.editLent(
                form,
                form.id
            );
            if (response.status === 200) {
                close();
                toast.success("Successfully edited your spending record");
                updateLent(response.data);
                reset();
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setRequestState(() => false)
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
                        <div className="text-left font-bold text-lg ">Edit Lent</div>
                        <input
                            onChange={dateChangeHandler}
                            value={date}
                            type="date"
                            className={`${formInputClass} mt-4 mb-2`}
                            placeholder="Enter Date *"
                        />
                        <div style={{ minWidth: "300px", overlayY: "auto" }}>
                            {spendingObject.Lents.map((lent, index) => (
                                <div key={index}>
                                    <div className="" style={{ maxWidth: "500px" }}>
                                        <input
                                            type="number"
                                            value={lent.amount}
                                            onChange={(e) =>
                                                inputChangeHandler(
                                                    e.target.value,
                                                    lent.pageId,
                                                    "Lents",
                                                    "amount",
                                                    lent.id
                                                )
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
                                                    "Lents",
                                                    "description",
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
                    <div className="flex mt-4 gap-2">
                        <div className="w-1/2">
                            <button
                                type="button"
                                onClick={editLent}
                                className="dark:bg-primary bg-main w-full rounded-sm py-1"
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

export default EditLent;
