import ReactPaginate from 'react-paginate';

import styles from './styles.module.scss';

type paginatorProps = {
  pageCount: number;
  pageRangeDisplayed: number;
  marginPagesDisplayed: number;
  changePage: (selectedItem: { selected: number }) => void;
};

export function Paginator({
  pageCount,
  pageRangeDisplayed,
  marginPagesDisplayed,
  changePage,
}: paginatorProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      onPageChange={changePage}
      // styles
      containerClassName={styles.containerPaginator}
      previousClassName={styles.buttonPaginator}
      nextClassName={styles.buttonPaginator}
      previousLinkClassName={styles.buttonPaginatorLink}
      nextLinkClassName={styles.buttonPaginatorLink}
      disabledClassName={styles.disabled}
      activeClassName={styles.activePage}
      previousLabel='Previous'
      nextLabel='Next'
    />
  );
}
