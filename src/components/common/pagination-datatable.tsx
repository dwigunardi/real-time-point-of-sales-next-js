import { JSX } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

const createPageItem = (page: number, currentPage: number, onChangePage: (page: number) => void) => (
    <PaginationItem key={page}>
        <PaginationLink
            size="default"
            className={`gap-2.5 px-2.5 sm:px-4 sm:py-2 text-sm font-medium transition-colors duration-200 ${page === currentPage ? "pointer-events-none border-cyan-600 text-cyan-600 dark:border-white dark:text-white" : "cursor-pointer border-transparent text-gray-500 dark:text-gray-400 dark:hover:text-white"}`}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            aria-disabled={page === currentPage}
            aria-selected={page === currentPage}
            aria-checked={page === currentPage}
            aria-pressed={page === currentPage}
            isActive={page === currentPage}
            onClick={() => onChangePage(page)}
        >
            {page}
        </PaginationLink>
    </PaginationItem>
);

const createEllipsisItem = (page: number) => (
    <PaginationItem key={`ellipsis-${page}`}>
        <PaginationEllipsis />
    </PaginationItem>
);

const processPage = (
    page: number,
    currentPage: number,
    totalPages: number,
    onChangePage: (page: number) => void
): JSX.Element | null => {

    // Guard clause: should show page
    if (page === 1) return createPageItem(page, currentPage, onChangePage);
    if (page === totalPages) return createPageItem(page, currentPage, onChangePage);
    if (Math.abs(page - currentPage) <= 1) return createPageItem(page, currentPage, onChangePage);

    // Guard clause: should show ellipsis
    if (page === currentPage - 2 && page > 1) return createEllipsisItem(page);
    if (page === currentPage + 2 && page < totalPages) return createEllipsisItem(page);

    // Default: hide
    return null;
};

export default function PaginationDataTable({
    totalPages,
    currentPage,
    onChangePage,
}: {
    totalPages: number;
    currentPage: number;
    onChangePage: (page: number) => void;
}) {

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        aria-label="Go to previous page"
                        size="default"
                        className={`gap-1 px-2.5 sm:pl-2.5 ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                        onClick={() => onChangePage(
                            currentPage > 1 ? currentPage - 1 : totalPages
                        )}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .map(page => processPage(page, currentPage, totalPages, onChangePage))
                    .filter(Boolean)}

                <PaginationItem>
                    <PaginationNext
                        aria-label="Go to next page"
                        size="default"
                        className={`gap-1 px-2.5 sm:pr-2.5 ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                        onClick={() => onChangePage(
                            currentPage < totalPages ? currentPage + 1 : 1
                        )}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}