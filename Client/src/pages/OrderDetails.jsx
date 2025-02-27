import React, { useState, useEffect, useRef } from 'react';
import { Container, LightSpinner, Spinner } from "../components/index.js";
import axios from "axios";
// import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faIndianRupeeSign, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

function convertISOToDateString(isoString) {

    let date;
    if (!isoString) {
        date = new Date();
    } else {
        date = new Date(isoString);
    }

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const dateString = date.toLocaleDateString('en-US', options);

    return dateString;
}

const addDays = (date, days) => {
    const newDate1 = new Date(date);
    const newDate2 = new Date(date);
    newDate1.setDate(newDate1.getDate() + days[0]);
    newDate2.setDate(newDate2.getDate() + days[1]);
    return `${convertISOToDateString(newDate1.toISOString()).slice(0, 13)} to ${convertISOToDateString(newDate2.toISOString()).slice(0, 13)}`;
}

const Batch = ({ text, color, darkColor }) => {
    return (
        <span className={`${color} text-xs font-bold dark:${darkColor} ml-4 px-2 py-2 rounded`}>
            {text}
        </span>
    )
}

const OrderDetails = () => {

    // const [orders, setOrders] = useState([]);
    const { orderId } = useParams();
    const [loader, setLoader] = useState(true);
    const [spinLoader, setSpinLoader] = useState(false);
    const [currOrder, setCurrOrder] = useState(null);
    // const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const isIndia = false;
    const dirham_to_rupees = localStorage.getItem('dirham_to_rupees');
    let total = useRef(0);
    const [openModal, setOpenModal] = useState(false);

    const handleData = async () => {
        try {
            const response = await axios.get(`/api/v1/orders/order/${orderId}`, {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true
            });
            const order = response.data.data[0];
            total.current = 0;
            order.cart.map((item, index) => {total.current += order.products[index].price * item.quantity})
            if(!order.shippingDetails.country.includes('United Arab Emirates')) total.current += 20*dirham_to_rupees;
            if(['Ajman', 'Abu Dhabi', 'Dubai', 'Sharjah'].some((field) => order.shippingDetails?.country.includes(field))) total.current += 0
            else total.current += 70*dirham_to_rupees;
            setCurrOrder(response.data.data[0]);
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        setLoader(true);
        handleData();
    }, []);

    const handleCancelOrder = async () => {
        // setLoader(true);
        setSpinLoader(true)
        try {
            await axios.get(`/api/v1/orders/cancel/${currOrder._id}`, {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true
            });
            setSpinLoader(false);
            setOpenModal(false);
            handleData()
        } catch (err) {
            console.log(err);
        }
    }

    const markDelivered = async () => {
        
        try {
            setLoader(true);
            await axios.put(`/api/v1/orders/${currOrder._id}`, {}, {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true
            });
            await handleData();
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }

    }

    return (
        !loader ?
            <Container className='w-[85vw] flex md:flex-row flex-col-reverse md:items-center items-center md:p-0 p-4 justify-center min-h-[100vh]'>
                {currOrder ?
                    <>
                        {
                            <div className={`fixed w-[85vw] h-[100vh] ${!openModal ? 'bg-opacity-0 backdrop-blur-0 -z-30' : 'bg-opacity-50 backdrop-blur-sm z-50'} flex items-center justify-center transition-all bg-black duration-900`}>
                                <div className={`${openModal ? 'md:w-[30%] w-[90%] h-[30%]' : 'w-0 h-0'} overflow-hidden bg-[#f1f1f1] rounded-lg shadow-md transition-all dark:bg-secondary-color duration-300 flex flex-col items-center justify-center gap-6 z-30`} onTransitionEnd={(e) => e.currentTarget.childNodes.forEach(child => child.classList.replace('hidden', 'flex'))}>
                                    {
                                        openModal &&
                                        <>
                                            <div className='uppercase text-xs hidden font-bold text-center dark:text-white'>Are You Sure You Want To Cancel This Order ?</div>
                                            <div className='hidden items-center justify-center gap-6 w-full'>
                                                <button className='w-24 h-10 bg-red-400 rounded-md hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600 text-sm font-bold' onClick={() => handleCancelOrder()} disabled={spinLoader}>{
                                                    spinLoader ?
                                                        <LightSpinner color={'fill-red-500'} />
                                                        : 'Yes'
                                                }</button>
                                                <button className='w-24 h-10 bg-green-400 rounded-md hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-600 text-sm font-bold' onClick={() => setOpenModal(false)} disabled={spinLoader}>No</button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        }

                        <div className='md:min-h-[90vh] md:w-[75%] w-full flex flex-col items-start pt-10 justify-start divide-y-2 md:m-0 m-6 dark:divide-gray-400 overflow-y-scroll'>
                            <div className='mb-4 flex items-start justify-between w-[80%]'>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2"><span className='mr-4'>Order ID:</span> <span className='tracking-wider text-gray-600 dark:text-gray-400'>#SF0{currOrder._id.slice(5, 10)}</span>
                                        {
                                            currOrder.isCancelled ?
                                                <Batch text='Cancelled' color='bg-red-400' darkColor='bg-red-500' />
                                                : currOrder.isPending ?
                                                    <Batch text='Pending' color='bg-yellow-400' darkColor='bg-yellow-600' />
                                                    : <Batch text='Delivered' color='bg-green-400' darkColor='bg-green-600' />
                                        }
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">Order date: {convertISOToDateString(currOrder?.date).slice(0, 13)}</p>
                                    {
                                        !currOrder.isCancelled &&
                                        (currOrder.isPending ?
                                            <p className="text-green-500 mt-2">Estimated delivery: {addDays(currOrder?.date || new Date(), currOrder.shippingDetails?.country.includes("United Arab Emirates") ? [3, 5] : [10, 15])}</p>
                                            : <p className="text-green-500 mt-2">Delivered On: {convertISOToDateString(currOrder?.deliveredDate).slice(0, 13)}</p>)
                                    }
                                </div>
                                {
                                    currOrder.isPending && !currOrder.isCancelled &&
                                    <button className='self-end bg-green-400 dark:bg-green-500 dark:hover:bg-green-600 md:px-6 px-2 hover:bg-green-500 transition-colors py-2 rounded text-sm font-bold' onClick={() => markDelivered()}>Mark As Delivered</button>
                                }
                                {
                                    !currOrder.isCancelled && currOrder.isPending &&
                                    <button className='self-end bg-red-400 dark:bg-red-500 dark:hover:bg-red-600 md:px-6 px-2 hover:bg-red-500 transition-colors py-2 rounded text-sm font-bold' onClick={() => setOpenModal(true)}>Cancel</button>
                                }
                            </div>
                            <div className='w-[100%] md:w-[80%] flex flex-col items-start justify-start gap-4 py-4'>
                                {
                                    currOrder.cart.map((item, index) => <div
                                        key={index}
                                        className='flex md:flex-row flex-col items-start justify-between gap-4 h-[15vh] w-full p-2'
                                    >
                                        <div className='flex w-fit gap-4 h-full'>
                                            <div className='w-[8vw] h-full p-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded'>
                                                <img src={currOrder.products[index].image?.url || currOrder.products[index].images[0].url} className='w-auto rounded h-auto max-h-[70%] max-w-[90%]' alt="Product" />
                                            </div>
                                            <div className='flex flex-col h-full items-start justify-evenly max-w-[70%]'>
                                                <span className='font-bold mt-4 md:text-md text-sm'>{currOrder.products[index].title}</span>
                                                <pre className='text-gray-600 dark:text-gray-400 text-xs'>
                                                    Color:<span className='md:text-sm text-xs font-bold'>{item.color}</span>|Size:<span className='md:text-sm text-xs font-bold'>{item.size}</span>|Quantity:<span className='md:text-sm text-xs font-bold'>{item.quantity}</span>
                                                </pre>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-center md:pb-0 pb-20 h-full justify-center self-end min-w-[20%]'>
                                            <div className='relative text-gray-500 dark:text-gray-400 w-auto'>
                                                {
                                                    isIndia ?
                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' />
                                                        : 'Dhs. '
                                                }
                                                {isIndia ? currOrder.products[index].comparePrice * item.quantity : Math.floor(currOrder.products[index].comparePrice / dirham_to_rupees) * item.quantity}
                                                <div className='absolute w-full top-[50%] left-0 h-[2px] bg-gray-400'></div>
                                            </div>
                                            <div className='text-xl font-bold'>
                                                {
                                                    isIndia ?
                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' />
                                                        : 'Dhs. '
                                                }
                                                {isIndia ? currOrder.products[index].price * item.quantity : Math.floor(currOrder.products[index].price / dirham_to_rupees) * item.quantity}
                                            </div>
                                        </div>
                                    </div>)
                                }
                            </div>
                            <div className='md:w-[80%] w-full flex items-start justify-between md:px-20 pt-6'>
                                <div className='flex flex-col items-start justify-start gap-0'>
                                    <span className='font-bold mb-2'>Payment</span>
                                    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>Payment By {currOrder.paymentMethod}</span>
                                    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>Total Dhs: {Math.floor(total.current/dirham_to_rupees)}</span>
                                    <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>{currOrder.paymentPending ? 'Cash On Delivery' : 'Paid'}</span>
                                    {currOrder.Id && <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>Payment ID: {currOrder.Id}</span>}
                                </div>
                                <div className=''>
                                    <span className='font-bold'>Delivery</span>
                                    <div className='text-sm font-medium mt-2 text-gray-500 dark:text-gray-400'>
                                        <p><FontAwesomeIcon icon={faPhone} className='mr-2' />{currOrder.shippingDetails?.number}</p>
                                        <p><FontAwesomeIcon icon={faEnvelope} className='mr-2' />{currOrder.shippingDetails?.email}</p>
                                        <p>{currOrder.shippingDetails?.address}</p>
                                        {currOrder.shippingDetails?.city !== 'NA' && <p>{currOrder.shippingDetails?.city}</p>}
                                        {currOrder.shippingDetails?.state !== 'NA' && <p>{currOrder.shippingDetails?.state}</p>}
                                        {currOrder.shippingDetails?.nearBy !== 'NA' && <p>{currOrder.shippingDetails?.nearBy}</p>}
                                        {currOrder.shippingDetails?.pincode !== 'NA' && <p>{currOrder.shippingDetails?.pincode}</p>}
                                        <p>{currOrder.shippingDetails?.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <div className='flex items-center justify-center font-bold text-2xl w-full h-[100vh]'>
                        There are no orders placed by you!
                    </div>}
            </Container>
            : <Spinner className='h-[100vh]' />
    );
}

export default OrderDetails;
