
const Modal = ({ children }) => {
    return (
        <div className='flex justify-center items-center fixed left-0 top-0 z-40 min-h-screen min-w-screen p-2 ' style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, .5)' }}>
            <div className='bg-gray-300 dark:bg-black overflow-y-auto z-50 shadow-xl' style={{ width: "500px", maxHeight: "90vh", }}>
                <div className='relative p-4 pt-2  rounded-md shadow-lg  overflow-y-auto' >
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;