import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';

const Forgotpassword: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('YOUR_SERVER_ENDPOINT', formData);
            console.log('Response:', response.data);
            // Handle success (e.g., show a success message, redirect, etc.)
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <>
            <div className={styles['container']}>
                <Link to={"/"}>
                    <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
                </Link>
                <h2 className={styles['text']}>input your e-mail</h2>

                <form action="" className={styles['form']}>

                    <div className={styles.forgotPasswordInput}>
                        <input type="text" id="email" value={formData.email} onChange={handleChange} />
                    </div>


                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setFormData({ email: '' })}>Clear</div>
                    <div className={styles['submitData']} onClick={handleSubmit}>Next</div>
                </div>

                <div className={styles['form-footer']}>
                    <p> <Link to={"/signIn"}>Back</Link></p>
                </div>

            </div>
        </>
    );
};

export default Forgotpassword;
