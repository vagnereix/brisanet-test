import {
  createContext,
  FormEvent,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { api } from '../services/api';

type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    publishedDate: string;
  };
  publishedDate: string;
  favorite?: boolean;
};

type DateT = {
  date: string;
  type: string;
};

type Price = {
  price: string;
  type: string;
};

type Creator = {
  name: string;
  role: string;
};

export type Comic = {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    extension: string;
    path: string;
  };
  prices: Price[];
  creators: Creator[];
  dates: DateT[];
};

type SearchProviderProps = {
  children: ReactNode;
};

type SearchContextData = {
  books: Book[];
  setBooks: (books: Book[]) => void;
  comics: Comic[];
  setComics: (comics: Comic[]) => void;
  handleSearch: (event: FormEvent) => void;
  searchComics: () => void;
  loading: boolean;
  inputRef: MutableRefObject<HTMLInputElement | null>;
};

const SearchContext = createContext<SearchContextData>({} as SearchContextData);

export function SearchProvider({ children }: SearchProviderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    searchComics();
  }

  const searchComics = useCallback(async () => {
    const { data } = await api.get('/comics', {
      params: {
        limit: 100,
        offset: 1,
        title: inputRef.current?.value ? inputRef.current.value : undefined,
      },
    });

    if (data.code === 200) {
      if (data.data.results.length === 0) {
        return toast.warning(`🍃 No data foud for this key word.`, {
          position: 'top-right',
        });
      }

      setComics(
        data.data.results.map((comic: any) => {
          return {
            id: comic.id,
            title: comic.title,
            description: comic.description,
            prices: comic.prices,
            dates: comic.dates,
            thumbnail: {
              extension: comic.thumbnail.extension,
              path: comic.thumbnail.path,
            },
            creators: comic.creators.items.map((creator: any) => {
              return {
                name: creator.name,
                role: creator.role,
              };
            }),
          };
        })
      );

      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchComics();
  }, [searchComics]);

  return (
    <SearchContext.Provider
      value={{
        inputRef,
        books,
        setBooks,
        handleSearch,
        searchComics,
        comics,
        setComics,
        loading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);

  return context;
}
