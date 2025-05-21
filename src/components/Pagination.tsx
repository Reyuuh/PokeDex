import React from "react";
import '../styles/Pagination.scss'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange}) => {

return(
    <div className="pagination-container" >
       <button className="page-button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
       </button>

       <span>Page {currentPage} of {totalPages}</span>

       <button className="page-button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
        Next
      </button>
    </div>
);

};