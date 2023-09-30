import React from "react";
import "../css/Pagination.css";

function Pagination({title, currentPage, totalPages, switchToPage}) {

    const pagesNumbers = [];
    for (let i = 0; i < totalPages; i++) {
        pagesNumbers.push(i);
    }
    
    return (
        <div className="Pagination">

            {title && <span className="pagination-title">{title}</span>}

            {pagesNumbers.map(pageNumber => {
                if(pageNumber === currentPage) {
                    return <span key={pageNumber}>{pageNumber + 1}</span>
                }

                return (
                    <span key={pageNumber}
                          className={"link"}
                          onClick={() => switchToPage(pageNumber)}>
                        {pageNumber + 1}
                    </span>
                );
            })}
        </div>
    );
}

export default Pagination;