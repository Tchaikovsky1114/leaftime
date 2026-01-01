// src/hooks/useOpenLibraryBooks.ts
import { useState, useEffect } from 'react';

export default function useOpenLibraryBooks() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=english+reading&limit=5&page=${pageNum}`);
      const data = await res.json();
      setBooks(data.docs); // Open Library returns books in "docs"
    } catch (err) {
      console.error('도서 불러오기 실패:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  return { books, page, setPage, loading };
}
