import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useOverseerAuth } from '../hooks/useOverseerAuth';

const logoutBtnStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #730051, #a0006e)',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(115, 0, 81, 0.3)',
    transition: 'all 0.2s ease',
};

const backBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: '2px solid #730051',
    color: '#730051',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
};

const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '10px',
};

const OverseerLogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useOverseerAuth();

    const isAdminHome = location.pathname === '/worship-docket-admin';

    const handleLogout = async () => {
        await logout();
        navigate('/worship-docket-admin');
    };

    return (
        <div style={wrapperStyle}>
            {!isAdminHome ? (
                <button
                    onClick={() => navigate('/worship-docket-admin')}
                    title="Back to Admin Dashboard"
                    style={backBtnStyle}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Admin Home
                </button>
            ) : (
                <div />
            )}
            <button
                onClick={handleLogout}
                title="Sign out of admin session"
                style={logoutBtnStyle}
            >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Log Out
            </button>
        </div>
    );
};

export default OverseerLogoutButton;
