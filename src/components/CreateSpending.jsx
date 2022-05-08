import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import SpendingService from "../services/spending-service";
import Modal from "./UI/modal";
import useSpending from "../hooks/use-spending";

const CreateSpending = ({ addSpending }) => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const {
    date,
    amount,
    borroweds,
    breakdowns,
    lents,
    addFields,
    initialCreateSetup,
    inputChangeHandler,
    dateChangeHandler,
    validateForm,
    reset,
  } = useSpending(user);

  useEffect(() => {
    if (user) {
      initialCreateSetup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const recordSpending = async () => {
    let form = {
      date: date,
      amount: 3000,
      breakdowns: breakdowns,
      borroweds: borroweds,
      lents: lents,
    };
    form = validateForm(JSON.parse(JSON.stringify(form)));

    if (form) {
      const response = await SpendingService.create(form);
      if (response.status === 201) {
        setShowModal(() => false);
        toast.success("Successfully added your spending record");
        addSpending(response.data);
        reset();
      }
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
        className="w-full border-2 dark:border-primary border-main hover:bg-main hover:dark:bg-primary px-2 py-2 rounded-md"
      >
        Create Multiple
      </button>
      {showModal && (
        <Modal>
          <div>
            <div className="text-left font-bold text-lg ">Create Spending</div>
            <div className="absolute right-0 top-0 p-4">
              <FaTimes
                onClick={closeModal}
                className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
              />
            </div>
            <input
              onChange={dateChangeHandler}
              value={date}
              type="date"
              className="mt-6 outline-none bg-dark p-2 rounded-md w-full mb-4"
              placeholder="Enter Date *"
            />
            <div style={{ minWidth: "300px", overlayY: "auto" }}>
              {breakdowns.map((breakdown, index) => (
                <div key={index}>
                  <div className="mb-2 text-left">Item {index + 1}</div>
                  <div className="pl-6" style={{ maxWidth: "500px" }}>
                    <input
                      type="number"
                      value={breakdown.price}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          breakdown.pageId,
                          "breakdown",
                          "price"
                        )
                      }
                      className="outline-none bg-dark p-2 rounded-md w-full mb-2"
                      placeholder="Enter Price *"
                    />
                    <input
                      value={breakdown.item}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          breakdown.pageId,
                          "breakdown",
                          "item"
                        )
                      }
                      className="outline-none bg-dark p-2 rounded-md w-full mb-2"
                      placeholder="Enter Item"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => addFields("breakdown")}
            className="w-full bg-primary p-1.5 rounded-md"
          >
            Add more spending records
          </button>
          <div className="mt-4">
            <div className="text-left font-bold text-lg ">
              Create Borrowed (if any)
            </div>
            <div style={{ minWidth: "300px", overlayY: "auto" }}>
              {borroweds.map((borrowed, index) => (
                <div key={index}>
                  <div className="mb-2 text-left">Item {index + 1}</div>
                  <div className="pl-6" style={{ maxWidth: "500px" }}>
                    <input
                      type="number"
                      value={borrowed.amount}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          borrowed.pageId,
                          "borrowed",
                          "amount"
                        )
                      }
                      className="outline-none bg-dark p-2 rounded-md w-full mb-2"
                      placeholder="Enter Amount *"
                    />
                    <input
                      value={borrowed.description}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          borrowed.pageId,
                          "borrowed",
                          "description"
                        )
                      }
                      className="outline-none bg-dark p-2 rounded-md w-full mb-2"
                      placeholder="Enter Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => addFields("borrowed")}
            className="w-full bg-primary p-1.5 rounded-md"
          >
            Add more borrowed records
          </button>
          <div className="mt-4">
            <div className="text-left font-bold text-lg ">
              Create Lent (if any)
            </div>
            <div style={{ minWidth: "300px", overlayY: "auto" }}>
              {lents.map((lent, index) => (
                <div key={index}>
                  <div className="mb-2 text-left">Item {index + 1}</div>
                  <div className="pl-6" style={{ maxWidth: "500px" }}>
                    <input
                      type="number"
                      value={lent.amount}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          lent.pageId,
                          "lent",
                          "amount"
                        )
                      }
                      className="outline-none bg-dark p-2 rounded-md w-full mb-2"
                      placeholder="Enter Amount *"
                    />
                    <input
                      value={lent.description}
                      onChange={(e) =>
                        inputChangeHandler(
                          e.target.value,
                          lent.pageId,
                          "lent",
                          "description"
                        )
                      }
                      className="outline-none bg-dark p-2 rounded-md w-full mb-2"
                      placeholder="Enter Description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => addFields("lent")}
            className="w-full bg-primary p-1.5 rounded-md"
          >
            Add more lent records
          </button>
          <div className="mt-2">Total: ₦ {amount.toLocaleString()}</div>
          <div className="flex mt-4 gap-2">
            <div className="w-1/2">
              <button
                type="button"
                onClick={recordSpending}
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

export default CreateSpending;
