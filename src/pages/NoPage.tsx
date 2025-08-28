import Header from '../components/header';
import Footer from '../components/footer';
import { Link } from 'react-router-dom';

export default function NoPage(){
    return(
        <>
            <Header />
            <div style={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '6rem', color: '#730051', margin: '0' }}>404</h1>
                <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '20px' }}>Page Not Found</h2>
                <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px', maxWidth: '500px' }}>
                    Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                </p>
                <Link 
                    to="/" 
                    style={{
                        backgroundColor: '#730051',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '12px 30px',
                        borderRadius: '25px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 8px rgba(115, 0, 81, 0.3)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#5a003d';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(115, 0, 81, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#730051';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(115, 0, 81, 0.3)';
                    }}
                >
                    Go Back Home
                </Link>
            </div>
            <Footer />
        </>
    )
}

