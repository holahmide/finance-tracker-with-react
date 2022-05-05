import { useState } from 'react';
import { FaTimes } from "react-icons/fa";
// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#121212',
        borderColor: '#121212',
        color: 'white',
        overlayX: 'auto'
    },
};

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, .7)';

const CreateSpending = () => {
    let subtitle;
    const [showModal, setShowModal] = useState(false);

    // const toggleModalHandler = () => {
    //     setShowModal((oldValue) => !oldValue);
    // }

    function openModal() {
        setShowModal(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setShowModal(false);
    }

    const blurHandler = (event) => {
        console.log("here")
    }

    return (
        <div>
            <button type="button" onClick={openModal} className="w-full border-2 dark:border-primary border-main hover:bg-main hover:dark:bg-primary px-2 py-2 rounded-md">Create Multiple</button>
            {/* {showModal && confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui'>
                            <h1>Are you sure?</h1>
                            <p>You want to delete this file?</p>
                            <button onClick={onClose}>No</button>
                            <button
                                onClick={() => {
                                    this.handleClickDelete();
                                    onClose();
                                }}
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                    );
                }
            })} */}
            {showModal && <div onClick={() => blurHandler()} className='flex justify-center items-center fixed left-0 top-0 z-40 min-h-screen min-w-screen p-2 ' style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
                <div className='bg-gray-300 dark:bg-black overflow-y-auto z-50 shadow-xl' style={{ width: "500px", maxHeight: "90vh", }}>
                    <div className='relative p-4 pt-2  rounded-md shadow-lg  overflow-y-auto' >
                        <div>
                            <div className='text-left font-bold text-lg '>Create Spending</div>
                            <div className='absolute right-0 top-0 p-4'>
                                <FaTimes
                                    onClick={closeModal}
                                    className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                                />
                            </div>
                            <input type="date" className='mt-6 outline-none bg-dark p-2 rounded-md w-full mb-4' placeholder="Enter Date *" />
                            <div style={{ minWidth: '300px', overlayY: 'auto' }}>
                                <div>
                                    <div className='mb-2 text-left'>Item 1</div>
                                    <div className='pl-6' style={{ maxWidth: '500px' }}>
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Description *" />
                                    </div>
                                </div>
                                <div>
                                    <div className='mb-2 text-left'>Item 2</div>
                                    <div className='pl-6' style={{ maxWidth: '500px' }}>
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Description *" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full bg-primary p-1.5 rounded-md'>
                            Add more spending records
                        </div>
                        <div className='mt-4'>
                            <div className='text-left font-bold text-lg '>Create Borrowed (if any)</div>
                            <div style={{ minWidth: '300px', overlayY: 'auto' }}>
                                <div>
                                    <div className='mb-2 text-left'>Item 1</div>
                                    <div className='pl-6' style={{ maxWidth: '500px' }}>
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Description *" />
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Date *" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full bg-primary p-1.5 rounded-md'>
                            Add more borrowed records
                        </div>
                        <div className='mt-4'>
                            <div className='text-left font-bold text-lg '>Create Lent (if any)</div>
                            <div style={{ minWidth: '300px', overlayY: 'auto' }}>
                                <div>
                                    <div className='mb-2 text-left'>Item 1</div>
                                    <div className='pl-6' style={{ maxWidth: '500px' }}>
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Amount *" />
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Description *" />
                                        <input className='outline-none bg-dark p-2 rounded-md w-full mb-2' placeholder="Enter Date *" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full bg-primary p-1.5 rounded-md'>
                            Add more lent records
                        </div>
                        <div className='flex mt-4 gap-2'>
                            <div className="w-1/2"><button className='dark:bg-primary bg-main w-full rounded-sm py-1'>Record</button></div>
                            <div className="w-1/2"><button onClick={closeModal} className='dark:bg-secondary bg-primary w-full rounded-sm py-1'>Close</button></div>
                        </div>

                    </div>
                </div>

            </div>}
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