import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/e-library.module.css';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import Footer from '../components/footer';

interface Book {
  title: string;
  category: string;
  path: string;
}

const books: Book[] = [
  { title: 'Altar Counselors Guide', category: 'Alter', path: '/pdfs/alter/Altar Counselors Guide.pdf' },
  { title: 'The Exploits Of Faith - David Oyedepo', category: 'Faith', path: '/pdfs/faith/The Exploits Of Faith - David Oyedepo.pdf' },
  { title: 'Altar Ego: Becoming Who God Says You Are - Craig Groeschel', category: 'Growth', path: '/pdfs/growth/Altar Ego_ Becoming Who God Say You Are - Craig Groeschel.pdf' },
  { title: 'Breaking The Curses Of Life - Dr. David O. Oyedepo', category: 'Growth', path: '/pdfs/growth/Breaking The Curses Of Life - Dr. David O. Oyedepo.pdf' },
  { title: 'Church Growth - Dag Heward-Mills', category: 'Growth', path: '/pdfs/growth/Church Growth - Dag Heward-Mills.pdf' },
  { title: 'The Strong-willed Child - James Dobson', category: 'Hope', path: '/pdfs/hope/The_Strong-willed_Child_James Dobson.pdf' },
  { title: '7 Principles of Transformational Leadership', category: 'Leadership', path: '/pdfs/leadership/7-Principles-of-Transformational-Leadership.pdf' },
  { title: 'Transform Your Pastoral Ministry - Dag Heward-Mills', category: 'Ministry', path: '/pdfs/ministry/Transform Your Pastoral Ministry - Dag Heward-Mills.pdf' },
  { title: 'Parenting', category: 'Parenting', path: '/pdfs/parenting/978-1-4143-9135-9.pdf' },
  { title: 'Glory Of God - Guillermo Maldonado', category: 'Prayer', path: '/pdfs/prayer/Glory Of God - Guillermo Maldonado.pdf' },
  // Add more books as needed
];

const Library: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [modalBook, setModalBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    filterBooks();
  }, [search, selectedCategory]);

  const filterBooks = () => {
    setFilteredBooks(
      books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory === '' || book.category === selectedCategory)
      )
    );
  };

  const openBook = (book: Book) => setModalBook(book);
  const closeModal = () => setModalBook(null);

  return (
    <div className={styles.body}>
      <header className={styles.customHeader}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className={styles.headerTitle}>
          <span className={styles.title3d}>KSUCU-MC E-LIBRARY</span>
        </div>
      </header>
      <div className={styles.libraryContainer}>
        <div className={styles.videoBg}>
          <video autoPlay muted loop className={styles.bgVideo}>
            <source src="/img/vinda.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={styles.controls}>
          <div className={styles.searchFilter}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search for books..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className={styles.select}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Alter">Alter</option>
                <option value="Faith">Faith</option>
                <option value="Growth">Growth</option>
                <option value="Hope">Hope</option>
                <option value="Leadership">Leadership</option>
                <option value="Ministry">Ministry</option>
                <option value="Parenting">Parenting</option>
                <option value="Prayer">Prayer</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.booksWrapper}>
          <div className={styles.books}>
          {filteredBooks.map((book) => (
            <div
              key={book.title}
              className={styles.book}
              onClick={() => openBook(book)}
            >
              <div className={styles.bookInner}>
                <div className={styles.bookTitle}>{book.title}</div>
                <div className={styles.bookCategory}>{book.category}</div>
                <div className={styles.bookActions}>
                  <a
                    href={book.path}
                    className={styles.downloadBtn}
                    download
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Download
                  </a>
                  <button
                    className={styles.openBtn}
                    onClick={(e) => { e.stopPropagation(); openBook(book); }}
                    type="button"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
        {modalBook && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <span className={styles.close} onClick={closeModal}>&times;</span>
              <h2>{modalBook.title}</h2>
              <iframe src={modalBook.path} width="100%" height="600px" title={modalBook.title}></iframe>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Library;
