import { useState, useEffect, useCallback } from "react";

const usePagination = ({ data: fullData, size, span }) => {
    // page data
    const [pageData, setPageData] = useState([]);
    // no_of_data per page
    const [rowsPerPage,] = useState(size ? size : 15);
    //list of pages currently displayed
    const [listOfPages, setListOfPages] = useState([]);
    // list of all pages
    const [listOfAllPages, setListOfAllPages] = useState([]);
    // number of pages in page list to be visually seen,
    const [maxPageNumberToShow,] = useState(span ? span : 10);
    // Active page
    const [activePage, setActivePage] = useState(0);
    // First Page
    const [firstPage, setFirstPage] = useState(0);
    // Last Page
    const [lastPage, setLastPage] = useState(0);
    // Last row index
    const [lastRowIndex, setLastRowIndex] = useState(0);

    // Pagination
    useEffect(() => {
        const paginate = (data = fullData) => {
            // setFullData(() => data);
            setActivePage(() => null);
            setListOfPages(() => []);
            setListOfAllPages(() => []);

            let noOfPages = fullData.length / rowsPerPage
            noOfPages = Math.ceil(noOfPages)

            let allPages = [];
            let pages = [];
            for (let i = 1; i <= noOfPages; i++) {
                allPages.push(i)
                if (i <= maxPageNumberToShow) pages.push(i)
                if (i === maxPageNumberToShow) setLastPage(() => i);
            }
            setListOfAllPages(() => allPages);
            setListOfPages(() => pages);

            if (fullData.length > 0) {
                setFirstPage(() => 1);
                setActivePage(() => 1);
            } else {
                setActivePage(() => 0);
            }

            setPageData(() => fullData.slice(0, rowsPerPage));
        }
        paginate();
    }, [fullData, maxPageNumberToShow, rowsPerPage]);

    const goToPage = useCallback((page) => {
        if (activePage === page) return
        let index = ((page - 1) * rowsPerPage) // finding first index of page
        setPageData(() => fullData.slice(index, (index + rowsPerPage)));
        setActivePage(() => page);
    }, [activePage, fullData, rowsPerPage])


    const shiftPageListLeft = useCallback(() => {
        setListOfPages((oldValue) => oldValue.map((value) => { return value - 1; }));
        // setFirstPage(() => listOfPages[0]);
        // setLastPage(() => listOfPages[listOfPages.length - 1]);
        setFirstPage((oldValue) => oldValue - 1);
        setLastPage((oldValue) => oldValue - 1);
    }, [])

    const shiftPageListRight = useCallback(() => {
        setListOfPages((oldValue) => oldValue.map((value) => { return value + 1; }));
        // setFirstPage(() => listOfPages[0]);
        // setLastPage(() => listOfPages[listOfPages.length - 1]);
        setFirstPage((oldValue) => oldValue + 1);
        setLastPage((oldValue) => oldValue + 1);
    }, [])
    const nextPage = useCallback(() => {
        // finding first index of next page
        let index = (activePage * rowsPerPage);
        setPageData(() => fullData.slice(index, (index + rowsPerPage)));
        setActivePage((oldValue) => {
            // Check if active page list is visible in page list
            let activePageIndex = listOfPages.indexOf(oldValue + 1);
            if (activePageIndex === -1) shiftPageListRight();
            return oldValue += 1
        });
    }, [activePage, fullData, listOfPages, rowsPerPage, shiftPageListRight])
    const prevPage = useCallback(() => {
        let index = ((activePage - 2) * rowsPerPage);
        setPageData(() => fullData.slice(index, (index + rowsPerPage)));
        setActivePage((oldValue) => {
            // Check if active page list is visible in page list
            let activePageIndex = listOfPages.indexOf(oldValue - 1);
            if (activePageIndex === -1) shiftPageListLeft();
            return oldValue -= 1
        });
    }, [activePage, fullData, listOfPages, rowsPerPage, shiftPageListLeft])

    useEffect(() => {
        setLastRowIndex(() => (activePage - 1) * rowsPerPage);
    }, [activePage, rowsPerPage])


    const paginationHTML = (
        <div className="w-full">
            <br />
            <div className="text-center">
                <span>Showing {activePage} of {listOfAllPages.length}</span>
            </div>
            {listOfAllPages.length > 1 && <div className="w-full p-2">
                <div className="text-center mt-2 pl-1 pr-1 mb-4">
                    {(firstPage !== 1) && (listOfAllPages.length > maxPageNumberToShow) && <span onClick={shiftPageListLeft} className="border inline border-dark dark:border-white p-2 hover:bg-gray-300 cursor-pointer">&#60;&#60;</span>}
                    {(firstPage !== 1) && (listOfAllPages.length > maxPageNumberToShow) && <span className="border border-dark dark:border-white p-2 hover:bg-gray-300 cursor-pointer">...</span>}
                    {listOfPages.map((page, index) =>
                        <span key={index} onClick={() => goToPage(page)} className={`transition-all border border-dark dark:border-white p-2 hover:bg-dark hover:text-white hover:dark:bg-gray-300 hover:dark:text-dark cursor-pointer '+ ${(activePage === page ? 'dark:bg-gray-300 dark:text-dark bg-dark text-white' : 'bg-transparent')}`}>{page}</span>
                    )}
                    {(lastPage !== listOfAllPages.length) && (listOfAllPages.length > maxPageNumberToShow) && <span className="border border-dark dark:border-white p-2 hover:bg-gray-300 cursor-pointer" >...</span>}
                    {(lastPage !== listOfAllPages.length) && (listOfAllPages.length > maxPageNumberToShow) && <span onClick={shiftPageListRight} className="border border-dark dark:border-white p-2 hover:bg-gray-300 cursor-pointer" >&#62;&#62;</span>}
                </div>
                <div className="text-center">
                    {(activePage !== 1) && <button onClick={prevPage} className="bg-main dark:bg-primary text-white pl-4 pr-4 pt-2 pb-2 rounded-lg mr-4">Prev</button>}
                    {(activePage !== listOfAllPages.length) && <button onClick={nextPage} className="bg-main dark:bg-primary text-white pl-4 pr-4 pt-2 pb-2 rounded-lg">Next</button>}
                </div><br />
            </div>}
        </div>
    );

    return {
        activePage,
        fullData,
        maxPageNumberToShow,
        firstPage,
        lastPage,
        listOfAllPages,
        listOfPages,
        pageData,
        paginationHTML,
        lastRowIndex,

        shiftPageListLeft,
        shiftPageListRight,
        nextPage,
        prevPage,
        goToPage,
    };
};

export default usePagination;