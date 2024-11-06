import React, { useState, useEffect } from 'react';
import styles from '../styles/e-library.module.css';
import Header from '../components/header';
import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';

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
        
        <Header />
        <div className={styles.libraryContainer}>
          <div className={styles.videoBg}>
            <video autoPlay muted loop className={styles.bgVideo}>
              <source src="/img/vinda.mp4" type="video/mp4" />
            </video>
          </div>
          <h1 className={styles.h1}>Welcome to the KSUCU E-Library</h1>
          <div className={styles.searchFilter}>
            <input
              className={styles.input}
              type="text"
              placeholder="Search for books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
            className={styles.select}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Categories</option>
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
          <div className={styles.categoryNav}>
            {['Alter', 'Faith', 'Growth', 'Hope', 'Leadership', 'Ministry', 'Parenting', 'Prayer'].map((cat) => (
              <span
                key={cat}
                className={styles.category}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ||
              </span>
            ))}
          </div>
          <div className={styles.books}>
            {filteredBooks.map((book) => (
              <div
                key={book.title}
                className={styles.book}
                onClick={() => openBook(book)}
              >
                {book.title}
              </div>
            ))}
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
        <div className={  `${ styles['footer'] } ${ styles['home-footer'] }` } id='contacts'>
            <p className={styles['footer--text']}>KISII UNIVERSITY MAIN CAMPUS CHRISTIAN UNION 2024</p>
                
            <div className={styles['hr']}></div>

            <div className={styles['social--links']}>
                <div className={styles['youtube']}>
                    <a href="https://www.youtube.com/@KSUCU-MC" className={styles['social-link']}><FaYoutube /></a>
                </div>

                <div className={styles['facebook']}>
                    <a href="https://www.facebook.com/ksucumc" className={styles['social-link']}><FaFacebook /></a>
                </div>

                <div className={styles['tiktok']}>
                    <a href="" className={styles['social-link']}><FaTiktok /></a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Library;
