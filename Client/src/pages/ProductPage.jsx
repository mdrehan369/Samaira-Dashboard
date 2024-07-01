import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import { Button, Container, Spinner } from "../components/index.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupee} from '@fortawesome/free-solid-svg-icons';

// TODO : ADD PRODUCT DETAILS LIKE NO. OF PRODUCTS SOLD AND ORDERED ETC

function ProductPage() {

    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [loader, setLoader] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        ; (async () => {
            try {
                setLoader(true)
                window.scrollTo(0, 0);
                const response = await axios.get(`/api/v1/products/product/${productId}`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
                });
                setProduct(response.data.data[0]);
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }

        })()
    }, []);

    const handleDeleteProduct = async () => {
        try {
            await axios.delete(`/api/v1/products/${productId}`, {
                baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
            });
            nav('/');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        !loader ?
            <Container className='h-full w-[85vw]'>
                <div className='flex items-center justify-center w-full h-[100%]'>
                    <div className='w-[50%] h-[90%] flex items-center justify-center'>
                        <img src={product.image?.url || product.images[0]?.url} className='w-auto h-[90%]' />
                    </div>
                    <form className='w-[40%] h-[90%] flex flex-col items-start justify-start gap-10'>
                        <h1 className='text-3xl font-bold text-stone-700 mt-10'>{product.title}</h1>
                        <div className='text-lg text-stone-600 font-medium' dangerouslySetInnerHTML={{__html: product.description}}></div>
                        <div>
                            <h1 className='text-md relative font-bold text-gray-500 w-[80%]'>
                                <div className=' absolute bg-gray-500 top-[50%] left-0 w-full h-[2px]'></div>
                                <FontAwesomeIcon icon={faIndianRupee} />{product.comparePrice}</h1>
                            <h1 className='text-2xl font-bold text-stone-700 mt-2'><FontAwesomeIcon icon={faIndianRupee} />{product.price}</h1>
                        </div>
                        <Button type='button' onClick={handleDeleteProduct} className='bg-red-300 text-red-900 py-2 px-4 text-sm rounded'>Delete</Button>
                    </form>
                </div >
            </Container>
            : <Spinner />
    )
}

export default ProductPage