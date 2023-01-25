import styles from './styles.module.scss';

import { Search } from '../../assets/icons/js/search';
import { useSearch } from '../../hooks/useSearch';

export function Header() {
  const { handleSearch, inputRef } = useSearch();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <form onSubmit={handleSearch}>
          <input
            placeholder='Find comic by key word'
            ref={inputRef}
            type='text'
          />
          <button type='submit'>
            <Search />
          </button>
        </form>
      </div>
    </header>
  );
}
