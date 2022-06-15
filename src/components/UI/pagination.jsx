import usePagination from "../../hooks/use-pagination";

const Pagination = ({ data, setData }) => {
    const {
        activePage,
        listOfAllPages,
        listOfPages,
        maxPageNumberToShow,
        lastPage,
        firstPage,
        pageData,
        prevPage,
        nextPage,
        shiftPageListLeft,
        shiftPageListRight,
        goToPage,
    } = usePagination(data);

    setData(pageData);

    return (
        <>
            <br />
            <div class="text-center">
                <span>Showing {activePage} of {listOfAllPages.length}</span>
            </div>
            {listOfAllPages.length > 1 && <div class="grid grid-cols-1 md:grid-cols-2 p-2">
                <div class="text-center md:text-left mt-2 pl-6 pr-6 mb-4">
                    {(firstPage !== 1) && (listOfAllPages.length > maxPageNumberToShow) && <span onClick={shiftPageListLeft} className="border p-2 hover:bg-gray-300 cursor-pointer">&#60;&#60;</span>}
                    {(firstPage !== 1) && (listOfAllPages.length > maxPageNumberToShow) && <span className="border p-2 hover:bg-gray-300 cursor-pointer" v-if="">...</span>}
                    {listOfPages.map((page, index) =>
                        // <span key={index} onClick={() => goToPage(page)} className={`border p-2 hover:bg-gray-300 cursor-pointer '+ ${(activePage === page ? 'bg-gray-300' : '')}`}>{{ page }}</span>
                        <span key={index} onClick={() => goToPage(page)} className={`border p-2 hover:bg-gray-300 cursor-pointer '+ ${(activePage === page ? 'bg-gray-300' : '')}`}>{page}</span>
                    )}

                    {lastPage !== listOfAllPages.length && listOfAllPages.length > maxPageNumberToShow && <span className="border p-2 hover:bg-gray-300 cursor-pointer" >...</span>}
                    {lastPage !== listOfAllPages.length && listOfAllPages.length > maxPageNumberToShow && <span onClick={() => shiftPageListRight} className="border p-2 hover:bg-gray-300 cursor-pointer" >&#62;&#62;</span>}
                </div>
                <div class="text-center md:text-right">
                    {activePage !== 1 && <button onClick={prevPage} className="bg-green-900 text-white pl-4 pr-4 pt-2 pb-2 rounded-lg mr-4" v-if="">Prev</button>}
                    {activePage !== listOfAllPages.length && <button onClick={nextPage} className="bg-green-900 text-white pl-4 pr-4 pt-2 pb-2 rounded-lg" v-if="">Next</button>}
                </div><br />
            </div>}
        </>
    );
};

export default Pagination;
