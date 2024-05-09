/* eslint-disable react/prop-types */
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

function Pagination({ pageState, totalPages, setPageState, lable }) {
    return (
        <>
            {
                pageState.total > 0 &&
                <div className="mt-4 flex flex-col gap-2 justify-center items-center">
                    <div className="mt-2">
                        {lable}
                    </div>
                    <div className="mb-12">
                        <button
                            onClick={() => setPageState((prevState) => ({ ...prevState, page: Math.max(1, prevState.page - 1) }))}
                            disabled={pageState.page === 1}
                            className="font-bold py-2 px-3 rounded-md border">
                            <MdOutlineNavigateBefore />
                        </button>
                        <span className="ml-2">
                            {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
                                const pageNumber = i + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setPageState((prevState) => ({ ...prevState, page: pageNumber }))}
                                        className={`py-2 px-3 rounded-md border ${pageNumber === pageState.page ? 'bg-[#E4E3FF] text-primary' : ''}`}>
                                        {pageNumber}
                                    </button>
                                );
                            })}
                            {totalPages > 6 && <span className="py-2 px-3">...</span>}
                        </span>
                        <button
                            onClick={() =>
                                setPageState((prevState) => ({ ...prevState, page: Math.min(totalPages, prevState.page + 1) }))
                            }
                            disabled={pageState.page === totalPages}
                            className="font-bold py-2 px-3 rounded-md ml-2 border">
                            <MdOutlineNavigateNext />
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default Pagination