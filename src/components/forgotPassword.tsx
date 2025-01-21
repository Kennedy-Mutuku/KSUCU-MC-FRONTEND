import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';

const Forgotpassword: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
    });
    
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.post('https://ksucu-mc.co.ke/users/forget-password', formData);
            console.log('Response:', response.data);
            // Handle success (e.g., show a success message, redirect, etc.)
            if(response.status = 200){
                setError('')
                setSuccessMessage('Email sent succesfully check your inbox 😊')
            }
        } catch (error: any) {
            console.error('Error:');
            // Handle error (e.g., show an error message)
            if(error.response.status = 404){
                setError('email not found 😖')
                setSuccessMessage('')
            }
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles['container']}>
                <Link to={"/"}>
                    <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
                </Link>
                <h2 className={styles['text']}>input your e-mail</h2>

                {error && <p className={styles.error}>{error}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}

                <form action="" className={styles['form']}>

                    <div className={styles.forgotPasswordInput}>
                        <input type="text" id="email" value={formData.email} onChange={handleChange} />
                    </div>

                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setFormData({ email: '' })}>Clear</div>
                    {loading ? <div className={styles['submitData']}>Sending...</div> : 
                    <div className={styles['submitData']} onClick={handleSubmit}>Next</div>
                    }
                </div>

                <div className={styles['form-footer']}>
                    <p> <Link to={"/signIn"}>Back</Link></p>
                </div>

            </div>

        </ div>
    );
};

export default Forgotpassword;

