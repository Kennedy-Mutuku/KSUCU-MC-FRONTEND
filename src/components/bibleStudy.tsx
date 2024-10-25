// import React, { useState } from 'react';
// import axios from 'axios';
// import styles from '../styles/bs.module.css';
// import { Link } from 'react-router-dom';
// import Header from '../components/header';
// import Footer from '../components/footer';

// const Bs: React.FC = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         residence: '',
//         yos: '',
//         phone: ''
//     });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
    
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

//         const { id, value } = e.target;

//         setFormData({ ...formData, [id]: value });

//     };

//     const handleSubmit = async (e: { preventDefault: () => void; }) => {

//         e.preventDefault(); // Prevent default form submission

//         if (!formData.yos || !formData.residence || !formData.name || !formData.phone) {
//             setError('Please make sure you fill all inputs')
//             return;
//         }else{
//             setError('')
//         }
      
//         axios.post('http://localhost:3000/users/bibleStudy', formData)
//         .then((response) => {
//           console.log('Response:', response.status);
//           // Handle success, e.g., show a success message or reset form
//           setError('Form submitted successfully!');
//         })
//         .catch((error) => {
//           if (error.response && error.response.status === 400) {
//             // Handle specific 404 error
//             setError('Phone number already Registered.');
//           } else {
//             // Handle other errors
//             console.error('Error:', error);
//             setError('Failed to submit the form. Please try again later.');
//           }
//         })
//         .finally(() => {
//           setLoading(false); // Set loading to false to re-enable the button
//         });

//     };

//     return (
//         <>
        
//       <Header />
      
//             <h2 className={styles.bsTitle}>Bible Study</h2>
//             {error && <div className={styles.error}>{error}</div>}

//             <div className={styles['container']}>

//                 <h2 className={styles['text']}>Register</h2>

//                 <form action="" className={styles['form']}>

//                     <div>
//                         <label htmlFor="name">Name</label>
//                         <input type="text" id="name" value={formData.name} onChange={handleChange} required />
//                     </div>

//                     <div>
//                         <label htmlFor="phone">Phone</label>
//                         <input type="number" id="phone" value={formData.phone} onChange={handleChange} required />
//                     </div>

//                     <div>

//                     <label htmlFor="yos">Y.O.S</label>
//                     <select id="yos" name="yos" value={formData.yos} className={styles['inputs']} onChange={(e) => setFormData({ ...formData, yos: e.target.value })}  required>
//                         <option className={styles['payment-option']} value="">--select Year of Study--</option>
//                         <option value="1" className={styles['payment-option']}> 1 </option>
//                         <option value="2" className={styles['payment-option']}> 2 </option>
//                         <option value="3" className={styles['payment-option']}> 3 </option>
//                         <option value="4" className={styles['payment-option']}> 4 </option>
//                     </select>


//                     </div>

//                     <div>
//                         <label htmlFor="residence">Residence</label>
//                         <select id="residence" name="residence" value={formData.residence} className={styles['inputs'] } onChange={(e) => setFormData({ ...formData, residence: e.target.value })}  required>
//                             <option className={styles['payment-option']} value="">--select Residence--</option>
//                             <option value='Kisumu ndogo' className={styles['payment-option']}> Kisumu ndogo </option>
//                             <option value='nyamage' className={styles['payment-option']}> nyamage</option>
//                             <option value='Fanta' className={styles['payment-option']}> Fanta </option>
//                         </select>
//                     </div>



//                 </form>

//                 <div className={styles['submisions']}>
//                     <div className={styles['clearForm']} onClick={() => setFormData({ name: '', residence: '', yos: '', phone: '' })}>Clear</div>
//                     <div className={styles['submitData']}  onClick={handleSubmit}>   
//                         <button className={styles['submitDataButton']} type="submit" disabled={loading}> {loading ? 'Submitting...' : 'Next'}</button>
//                     </div>
//                 </div>

//                 <div className={styles['form-footer']}>
//                     <p><Link to={"/Home"}>Home</Link></p>
//                 </div>

//             </div>
            
//       <Footer />
//         </>
//     );
// };

// export default Bs;


import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/bs.module.css';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const Bs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        residence: '',
        yos: '',
        phone: '',
        gender: '' // Add gender field here
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, gender: e.target.value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent default form submission

        if (!formData.yos || !formData.residence || !formData.name || !formData.phone || !formData.gender) {
            setError('Please make sure you fill all inputs');
            return;
        } else {
            setError('');
        }

        try {
            const response = await axios.post('http://localhost:3000/users/bibleStudy', formData);
            console.log('Response:', response.status);
            setError('Form submitted successfully!');
        } catch (error:any) {
            if (error.response && error.response.status === 400) {
                setError('Phone number already Registered.');
            } else {
                console.error('Error:', error);
                setError('Failed to submit the form. Please try again later.');
            }
        } finally {
            setLoading(false); // Set loading to false to re-enable the button
        }
    };

    return (
        <>
            <Header />
            <h2 className={styles.bsTitle}>Bible Study</h2>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles['container']}>
                <h2 className={styles['text']}>Register</h2>

                <form action="" className={styles['form']}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input type="number" id="phone" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div>
                        <label htmlFor="yos">Y.O.S</label>
                        <select id="yos" name="yos" value={formData.yos} className={styles['inputs']} onChange={(e) => setFormData({ ...formData, yos: e.target.value })} required>
                            <option className={styles['payment-option']} value="">--select Year of Study--</option>
                            <option value="1" className={styles['payment-option']}> 1 </option>
                            <option value="2" className={styles['payment-option']}> 2 </option>
                            <option value="3" className={styles['payment-option']}> 3 </option>
                            <option value="4" className={styles['payment-option']}> 4 </option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="residence">Residence</label>
                        <select id="residence" name="residence" value={formData.residence} className={styles['inputs']} onChange={(e) => setFormData({ ...formData, residence: e.target.value })} required>
                            <option className={styles['payment-option']} value="">--select Residence--</option>
                            <option value='Kisumu ndogo' className={styles['payment-option']}> Kisumu ndogo </option>
                            <option value='nyamage' className={styles['payment-option']}> nyamage</option>
                            <option value='Fanta' className={styles['payment-option']}> Fanta </option>
                        </select>
                    </div>

                    {/* Gender selection */}
                    <div>
                        <label>Gender</label>
                        <div>
                            <input
                                type="radio"
                                id="gender-m"
                                name="gender"
                                value="M"
                                checked={formData.gender === 'M'}
                                onChange={handleGenderChange}
                                required
                            />
                            <label htmlFor="gender-m">Male</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="gender-f"
                                name="gender"
                                value="F"
                                checked={formData.gender === 'F'}
                                onChange={handleGenderChange}
                                required
                            />
                            <label htmlFor="gender-f">Female</label>
                        </div>
                    </div>

                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setFormData({ name: '', residence: '', yos: '', phone: '', gender: '' })}>Clear</div>
                    <div className={styles['submitData']} onClick={handleSubmit}>
                        <button className={styles['submitDataButton']} type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Next'}</button>
                    </div>
                </div>

                <div className={styles['form-footer']}>
                    <p><Link to={"/Home"}>Home</Link></p>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Bs;
