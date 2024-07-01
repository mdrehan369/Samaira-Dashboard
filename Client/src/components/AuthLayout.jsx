import React, { useEffect, useState } from 'react'
import Spinner from './Spinner.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// window.onbeforeunload = async () => {
//     try {
//         await axios.get('/api/v1/users/logout', {
//             baseURL: import.meta.env.VITE_BACKEND_URL,
//             withCredentials: true
//         });
//     } catch (err) {
//         console.log(err);
//     }
// }

function AuthLayout({ children }) {

    const [loader, setLoader] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        ; (async () => {
            try {
                const rateResponse = await axios.get('https://www.floatrates.com/daily/aed.json');
                const dirham_to_rupees = Math.round(rateResponse.data.inr.rate);

                localStorage.setItem('dirham_to_rupees', dirham_to_rupees);

                const response = await axios.get('/api/v1/users/check', {
                    baseURL: import.meta.env.VITE_BACKEND_URL,
                    withCredentials: true
                });

                console.log(response)
                if(response.data === 'Not Authorized'){
                    nav('/login');
                }

            } catch (err) {
                console.log(err);
            } finally {
                setLoader(false);
            }

        })();

        return async () => {
            try {
                await axios.get('/api/v1/users/logout', {
                    baseURL: import.meta.env.VITE_BACKEND_URL,
                    withCredentials: true
                });
            } catch (err) {
                console.log(err);
            }
        }
    }, []);

    return (
        !loader ?
            <>
                {children}
            </> :
            <Spinner className='w-[100vw] h-[100vh]' />
    )
}

export default AuthLayout