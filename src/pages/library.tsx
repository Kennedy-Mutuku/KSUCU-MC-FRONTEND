import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/e-library.module.css';
import { FaArrowLeft, FaSearch, FaBook, FaFilter, FaChevronDown } from 'react-icons/fa';

interface Book {
  title: string;
  category: string;
  path: string;
  cover?: string;
}

const books: Book[] = [
  { title: "Altar Counselors Guide", category: "Alter", path: "/pdfs/alter/Altar Counselors Guide.pdf" },
  { title: "Smith Wigglesworth Ever increasing Faith (2)", category: "Faith", path: "/pdfs/faith/Smith Wigglesworth Ever increasing Faith (2).pdf" },
  { title: "The Exploits Of Faith David Oyedepo", category: "Faith", path: "/pdfs/faith/The Exploits Of Faith - David Oyedepo.pdf" },
  { title: "The Holy Spirit and His gifts Kenneth E Hagin", category: "Faith", path: "/pdfs/faith/The Holy Spirit and His gifts - Kenneth E Hagin.pdf" },
  { title: "Africa God's Generals The Soul Eddie Sempala", category: "Growth", path: "/pdfs/growth/Africa God's Generals - The Soul - Eddie Sempala.pdf" },
  { title: "Altar Ego Becoming Who God Say You Are Craig Groeschel", category: "Growth", path: "/pdfs/growth/Altar Ego_ Becoming Who God Say You Are - Craig Groeschel.pdf" },
  { title: "An Unhurried Life Alan Fadling", category: "Growth", path: "/pdfs/growth/An Unhurried Life - Alan Fadling.pdf" },
  { title: "Biblical Keys to Financial Pros Kenneth E. Hagin", category: "Growth", path: "/pdfs/growth/Biblical Keys to Financial Pros - Kenneth E. Hagin.pdf" },
  { title: "Born Again Again Ross Lanphere", category: "Growth", path: "/pdfs/growth/Born Again Again - Ross Lanphere.pdf" },
  { title: "Breaking The Curses Of Life Dr. David O. Oyedepo", category: "Growth", path: "/pdfs/growth/Breaking The Curses Of Life - Dr. David O. Oyedepo.pdf" },
  { title: "Church Growth Dag Heward Mills", category: "Growth", path: "/pdfs/growth/Church Growth - Dag Heward-Mills.pdf" },
  { title: "Disciplines of a Godly Man R.Kent Hughes", category: "Growth", path: "/pdfs/growth/Disciplines of a Godly Man - R.Kent Hughes.pdf" },
  { title: "Freedom From Debt Daniel Kolenda", category: "Growth", path: "/pdfs/growth/Freedom From Debt - Daniel Kolenda.pdf" },
  { title: "Have a New Teenager by Friday From", category: "Growth", path: "/pdfs/growth/Have_a_New_Teenager_by_Friday_From.pdf" },
  { title: "Humility C. Peter Wagner", category: "Growth", path: "/pdfs/growth/Humility - C. Peter Wagner.pdf" },
  { title: "Joshua Living as a Consistent Gene Getz", category: "Growth", path: "/pdfs/growth/Joshua Living as a Consistent - Gene Getz.pdf" },
  { title: "Living the spiritually balanced life Ray Sherman Anderson", category: "Growth", path: "/pdfs/growth/Living the spiritually balanced life - Ray Sherman Anderson.pdf" },
  { title: "Passion And Purity Elisabeth Elliot", category: "Growth", path: "/pdfs/growth/Passion And Purity - Elisabeth Elliot.pdf" },
  { title: "Power of Letting Go Rev. J Martin", category: "Growth", path: "/pdfs/growth/Power of Letting Go - Rev. J Martin.pdf" },
  { title: "The Consistent Christian William Secker", category: "Growth", path: "/pdfs/growth/The Consistent Christian - William Secker.pdf" },
  { title: "The Life And Diary Of David Bra David Brainerd", category: "Growth", path: "/pdfs/growth/The Life And Diary Of David Bra - David Brainerd.pdf" },
  { title: "The Normal Christian Life Watchman Nee", category: "Growth", path: "/pdfs/growth/The Normal Christian Life - Watchman Nee.pdf" },
  { title: "Where Wisdom Begins Derek Prince", category: "Growth", path: "/pdfs/growth/Where Wisdom Begins - Derek Prince.pdf" },
  { title: "The Strong willed Child James Dobson", category: "Hope", path: "/pdfs/hope/The_Strong-willed_Child_James Dobson.pdf" },
  { title: "Wisdom Diary On Prosperity David Oyedepo", category: "Hope", path: "/pdfs/hope/Wisdom Diary On Prosperity - David Oyedepo.pdf" },
  { title: "You Shall Not Be Barren David Oyedepo", category: "Hope", path: "/pdfs/hope/You Shall Not Be Barren - David Oyedepo.pdf" },
  { title: "Leadership Principles", category: "Leadership", path: "/pdfs/leadership/55627312.pdf" },
  { title: "7 Principles of Transformational Leadership", category: "Leadership", path: "/pdfs/leadership/7-Principles-of-Transformational-Leadership.pdf" },
  { title: "Power of Character in Leadership Myles Munroe", category: "Leadership", path: "/pdfs/leadership/Power of Character in Leadership - Myles Munroe.pdf" },
  { title: "Servant Leadership Efrain Agosto", category: "Leadership", path: "/pdfs/leadership/Servant Leadership - Efrain Agosto.pdf" },
  { title: "Surrounded by Idiots Thomas Erikson", category: "Leadership", path: "/pdfs/leadership/Surrounded by Idiots - Thomas Erikson.pdf" },
  { title: "The 21 Indispensable Qualities of a Leader John C Maxwell", category: "Leadership", path: "/pdfs/leadership/The 21 Indispensable Qualities of a Leader - John C Maxwell.pdf" },
  { title: "The Power Of Character In Leadership Myles Munroe", category: "Leadership", path: "/pdfs/leadership/The-Power-Of-Character-In-Leadership-Myles-Munroe-Christiandiet.com_.ng_.pdf" },
  { title: "Transformational Leadership VS. Transactional Leadership", category: "Leadership", path: "/pdfs/leadership/Transformational Leadership VS. Transactional Leadership ( PDFDrive ).pdf" },
  { title: "Purpose Driven Youth Ministry Training Kit Dung Fields", category: "Ministry", path: "/pdfs/ministry/Purpose Driven Youth Ministry Training Kit - Dung Fields.pdf" },
  { title: "Purposes of Pentecost Derek Prince", category: "Ministry", path: "/pdfs/ministry/Purposes of Pentecost - Derek Prince.pdf" },
  { title: "Transform Your Pastoral Ministry Dag Heward Mills", category: "Ministry", path: "/pdfs/ministry/Transform Your Pastoral Ministry - Dag Heward-Mills.pdf" },
  { title: "Transformational Leadership", category: "Ministry", path: "/pdfs/ministry/Transformational Leadership VS. Transactional Leadership ( PDFDrive ).pdf" },
  { title: "Understanding Todays Youth Culture Walt Mueller", category: "Ministry", path: "/pdfs/ministry/Understanding Todays Youth Culture - Walt Mueller.pdf" },
  { title: "Wisdom is the Principal Thing for Your Ministry Dag Heward Mills", category: "Ministry", path: "/pdfs/ministry/Wisdom is the Principal Thing for Your Ministry - Dag Heward-Mills.pdf" },
  { title: "Youth Ministry Nuts and Bolts", category: "Ministry", path: "/pdfs/ministry/Youth Ministry Nuts and Bolts.pdf" },
  { title: "978 1 4143 9135 9", category: "Parenting", path: "/pdfs/parenting/978-1-4143-9135-9.pdf" },
  { title: "A Young Woman After Gods Own Heart Elizabeth George", category: "Parenting", path: "/pdfs/parenting/A Young Woman After Gods Own Heart - Elizabeth George.pdf" },
  { title: "Attitude is Everything Keith Harrell", category: "Parenting", path: "/pdfs/parenting/Attitude is Everything by Keith Harrell ( PDFDrive ).pdf" },
  { title: "Preparing for Marriage John Piper", category: "Parenting", path: "/pdfs/parenting/Preparing for Marriage - John Piper.pdf" },
  { title: "Glory Of God Guillermo Maldonado", category: "Prayer", path: "/pdfs/prayer/Glory Of God - Guillermo Maldonado.pdf" },
  { title: "Kenneth E Hagin The Art of Prayer", category: "Prayer", path: "/pdfs/prayer/Kenneth E Hagin - The Art of Prayer.pdf" },
  { title: "Relying on the Holy Spirit Charles Stanley", category: "Prayer", path: "/pdfs/prayer/Relying on the Holy Spirit (Lif - Charles Stanley.pdf" },
  { title: "Secret Power D. L. Moody", category: "Prayer", path: "/pdfs/prayer/Secret Power - D. L. Moody.pdf" },
  { title: "Spiritual Warfare for Every Christian Dean Sherman", category: "Prayer", path: "/pdfs/prayer/Spiritual Warfare for Every Christian - Dean Sherman.pdf" },
  { title: "The Glory of God Kenneth E. Hagin", category: "Prayer", path: "/pdfs/prayer/The Glory of God - Kenneth E. Hagin.pdf" },
  { title: "The Name of Jesus Kenneth E. Hagin", category: "Prayer", path: "/pdfs/prayer/The Name of Jesus - Kenneth E. Hagin.pdf" },
  { title: "The Reality Of Prayer E. M. Bounds", category: "Prayer", path: "/pdfs/prayer/The Reality Of Prayer - E. M. Bounds.pdf" },
  { title: "Understanding The Purpose And Power of Prayer Myles Munroe", category: "Prayer", path: "/pdfs/prayer/Understanding The Purpose And Power of Prayer - Myles Munroe.pdf" },
  { title: "Why Revival Tarries Leonard Ravenhill", category: "Prayer", path: "/pdfs/prayer/Why Revival Tarries - Leonard Ravenhill.pdf" },
];

const Library: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [modalBook, setModalBook] = useState<Book | null>(null);
  const [showFilters, setShowFilters] = useState(false);
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
            <div className={styles.searchInputWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className={styles.filterSection}>
              <button 
                className={`${styles.filterButton} ${selectedCategory !== '' ? styles.filterActive : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className={styles.filterBtnLeft}>
                  <FaFilter size={12} />
                  <span>{selectedCategory || 'All Subjects'}</span>
                </div>
                <FaChevronDown size={10} className={`${styles.chevron} ${showFilters ? styles.chevronRotate : ''}`} />
              </button>

              {showFilters && (
                <div className={styles.filterDropdown}>
                  <button 
                    className={`${styles.dropdownItem} ${selectedCategory === '' ? styles.activeItem : ''}`}
                    onClick={() => { setSelectedCategory(''); setShowFilters(false); }}
                  >
                    All Subjects
                  </button>
                  {['Alter', 'Faith', 'Growth', 'Hope', 'Leadership', 'Ministry', 'Parenting', 'Prayer'].map(cat => (
                    <button 
                      key={cat}
                      className={`${styles.dropdownItem} ${selectedCategory === cat ? styles.activeItem : ''}`}
                      onClick={() => { setSelectedCategory(cat); setShowFilters(false); }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
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
                <div className={styles.bookCover}>
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} className={styles.coverImage} />
                  ) : (
                    <div className={styles.coverPlaceholder}>
                      <FaBook className={styles.placeholderIcon} />
                      <span className={styles.placeholderCat}>{book.category}</span>
                    </div>
                  )}
                </div>
                <div className={styles.bookInner}>
                  <div>
                    <div className={styles.bookTitle}>{book.title}</div>
                    <div className={styles.bookCategory}>{book.category}</div>
                  </div>
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
              <iframe src={modalBook.path} width="100%" style={{ flex: 1, border: 'none' }} title={modalBook.title}></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
