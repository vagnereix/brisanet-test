import { useState } from "react";

export function usePaginator() {
  const [pageNumber, setPageNumber] = useState(0);

  const booksPerPage = 10;
  const pagesVisited = pageNumber * booksPerPage;
  
  const changePage = (selectedItem: { selected: number }) => {
    const { selected } = selectedItem;
    setPageNumber(selected);
  };

  return { booksPerPage, pageNumber, pagesVisited, changePage };
}
