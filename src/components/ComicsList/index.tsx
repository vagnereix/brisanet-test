import { usePaginator } from '../../hooks/usePaginator';
import { NewButton } from '../NewButton';
import { Paginator } from '../Paginator';
import styles from './styles.module.scss';

import Modal from 'react-modal';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Comic, useSearch } from '../../hooks/useSearch';
import { DescriptionModal } from '../DescriptionModal';

Modal.setAppElement('#root');

export function ComicsList() {
  const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [comicSelected, setComicSelected] = useState<Comic | undefined>(
    undefined
  );

  function handleOpenDescriptionModal() {
    setDescriptionModalOpen(true);
  }

  function handleCloseDescriptionModal() {
    setDescriptionModalOpen(false);
  }

  const { comics, loading } = useSearch();

  const { booksPerPage, pagesVisited, changePage } = usePaginator();

  function handleOpenModal(comicIndex: number) {
    setComicSelected(comics[comicIndex]);
    handleOpenDescriptionModal();
  }

  return (
    <main className={styles.content}>
      <DescriptionModal
        isOpen={isDescriptionModalOpen}
        comic={comicSelected}
        onRequestClose={handleCloseDescriptionModal}
      />
      {!loading ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Author(s)</th>
                <th>On sale date</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {comics
                .slice(pagesVisited, pagesVisited + booksPerPage)
                .map((comic, index) => {
                  return (
                    <>
                      <tr key={comic.id}>
                        <td>
                          <img
                            src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                            alt=''
                          />
                        </td>
                        <td>{comic.title.toLowerCase()}</td>
                        <td>
                          {comic.creators &&
                            comic.creators.map((creator) => {
                              return (
                                <>
                                  <span key={creator.name}>
                                    {creator.name.toLocaleLowerCase()}
                                  </span>
                                  <br />
                                </>
                              );
                            })}
                        </td>
                        <td>
                          {comic.dates &&
                            comic.dates.map((date) => {
                              return (
                                <>
                                  <span key={date.date}>
                                    {date.type === 'onsaleDate' &&
                                      dayjs(date.date).format('DD/MM/YYYY')}
                                  </span>
                                </>
                              );
                            })}
                        </td>
                        <td>
                          {comic.prices.map((price) => {
                            return (
                              <>
                                <span key={price.price}>
                                  {price.type === 'printPrice' &&
                                    new Intl.NumberFormat('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                    }).format(Number(price.price))}
                                </span>
                              </>
                            );
                          })}
                        </td>
                        <td>
                          <div>
                            <NewButton onClick={() => handleOpenModal(index)}>
                              See details and send
                            </NewButton>
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
          <Paginator
            pageCount={Math.ceil(comics.length / 10)}
            pageRangeDisplayed={10}
            marginPagesDisplayed={10}
            changePage={changePage}
          />
        </>
      ) : (
        <section>
          <div className={styles.loading} />
        </section>
      )}
    </main>
  );
}
