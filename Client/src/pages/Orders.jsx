import React, { useEffect, useState } from 'react'
import { Button, Container, Spinner } from '../components'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IoFunnelOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';

function getDate(date) {

    const myDate = new Date(date);

    const day = myDate.getDate() + 1;
    // const suffix = day % 10 > 3 || Number(day / 10).toFixed(0) === 1 ? 'th' : day % 10 === 1 ? 'st' : day % 10 === 2 ? 'nd' : 'rd';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    return `${day} ${months[myDate.getMonth()]}, ${myDate.getFullYear()}`

}

function Modal({ setModal, filter, setFilter }) {

    const [country, setCountry] = useState(filter.country);
    const [payment, setPayment] = useState(filter.payment);
    const [status, setStatus] = useState(filter.status);

    const applyFilter = () => {

        setFilter({
            country,
            payment,
            status
        });

        setModal(false);

    }

    return (
        <div className='w-[100%] h-[100%] backdrop-blur-sm bg-black bg-opacity-55 flex items-center absolute top-0 left-0 justify-center'>
            <div className='w-[35%] h-[35%] bg-[#f1f1f1] flex flex-col items-center gap-3 justify-center animate-animate-appear rounded-md p-10 shadow-xl relative'>
                <FontAwesomeIcon icon={faXmark} className='p-2 text-xl text-gray-600 cursor-pointer absolute top-1 right-1 hover:bg-gray-200 transition-colors' onClick={() => setModal(false)} />
                <div className='flex items-center justify-between gap-10 w-full'>
                    <h1 className='font-bold text-gray-600'>Country:</h1>
                    <select className='w-[50%] p-2 text-center border-2 cursor-pointer' value={country} onInput={(e) => setCountry(e.currentTarget.value)}>
                        <option value="">All</option>
                        <option value="India">India</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Oman">Oman</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="United Arab Emirates, Dubai">Dubai</option>
                        <option value="United Arab Emirates, Abu Dhabi">Abu Dhabi</option>
                        <option value="United Arab Emirates, Ajman">Ajman</option>
                        <option value="United Arab Emirates, Sharjah">Sharjah</option>
                        <option value="United Arab Emirates, Ras Al Khaimah">Ras Al Khaimah</option>
                        <option value="United Arab Emirates, Umm Al Quwain">Umm Al Quwain</option>
                    </select>
                </div>
                <div className='flex items-center justify-between gap-10 w-full'>
                    <h1 className='font-bold text-gray-600'>Payment Method: </h1>
                    <select className='w-[50%] p-2 text-center border-2 cursor-pointer' value={payment} onInput={(e) => setPayment(e.currentTarget.value)}>
                        <option value="Phonepe">Phonepe</option>
                        <option value="Tabby">Tabby</option>
                        <option value="Ziina">Ziina</option>
                        <option value="COD">Cash On Delivery</option>
                        <option value="">All</option>
                    </select>
                </div>
                <div className='flex items-center justify-between gap-10 w-full'>
                    <h1 className='font-bold text-gray-600'>Status: </h1>
                    <select className='w-[50%] p-2 text-center border-2 cursor-pointer' value={status} onInput={(e) => setStatus(e.currentTarget.value)}>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="">All</option>
                    </select>
                </div>
                <Button onClick={() => applyFilter()} className='px-4 py-2 bg-transparent hover:bg-gray-800 transition-colors text-gray-800 hover:text-white hover:shadow-none border-2 border-gray-600 text-sm font-bold mt-0 self-end'>Apply</Button>
            </div>
        </div>
    )
}

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loader, setLoader] = useState(true);
    const [modal, setModal] = useState(false);
    const [filter, setFilter] = useState({
        country: '',
        status: '',
        payment: '',
    });

    const handleData = async () => {
        try {
            const response = await axios.get(`/api/v1/orders?country=${filter.country}&status=${filter.status}&payment=${filter.payment}`, {
                baseURL: import.meta.env.VITE_BACKEND_URL,
                withCredentials: true
            });
            setOrders(response.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        handleData();
    }, [filter]);

    return (
        !loader ?
            <Container className='flex flex-col items-start justify-start p-8 w-[85vw] px-20'>
                {modal && <Modal setModal={setModal} filter={filter} setFilter={setFilter} />}
                <div className='flex w-full items-center justify-between'>
                    <h1 className='text-3xl py-10 font-bold uppercase'>Orders</h1>
                    <div onClick={() => setModal(true)} className='bg-gray-100 flex items-center gap-2 tracking-wide uppercase text-xs hover:bg-gray-200 font-bold text-gray-600 border-[1px] border-gray-300 cursor-pointer px-4 py-2 rounded'>
                        <span>Filter</span><IoFunnelOutline />
                    </div>
                </div>
                <div className='w-full grid grid-cols-7 border-b-2 pb-2 font-bold text-sm text-gray-600'>
                    <span className='text-center'>Order ID</span>
                    <span className='text-center'>Date</span>
                    <span className='text-center'>Name</span>
                    <span className='text-center'>Payment</span>
                    <span className='text-center'>Number</span>
                    <span className='text-center'>Country</span>
                    <span className='text-center'>Status</span>
                </div>
                <div className='w-full h-full py-4 overflow-y-scroll flex flex-col items-start justify-normal'>
                    {orders.map((order, index) => <NavLink to={`/order/${order._id}`} key={index} className='grid grid-cols-7 w-full text-sm text-gray-700 font-[450] px-0 py-3 border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer'>
                        <span className='text-center font-bold text-sm text-gray-600 w-fit mx-auto'>#SF0{order._id.slice(5, 10)}</span>
                        <span className='text-center'>{getDate(order.createdAt)}</span>
                        <span className='text-center'>{order.shippingDetails?.firstName + ' ' + order.shippingDetails?.lastName}</span>
                        <span className='text-center'>{order.paymentMethod}</span>
                        <span className='text-center'>{order.shippingDetails?.number}</span>
                        <span className='text-center'>{order.shippingDetails?.country.replace("United Arab Emirates,", "")}</span>
                        {
                            order.isPending ?
                                <span className='px-2 w-[40%] text-center mx-auto py-1 font-bold text-xs rounded-sm bg-yellow-400'>Pending</span>
                                : order.isCancelled ?
                                    <span className='px-2 w-[40%] text-center mx-auto py-1 font-bold text-xs rounded-sm bg-red-500'>Cancelled</span>
                                    : <span className='px-2 w-[40%] text-center mx-auto py-1 font-bold text-xs rounded-sm bg-green-500'>Delivered</span>
                        }
                    </NavLink>)}
                    {
                        orders.length === 0 && <div className='w-full h-full flex items-center justify-center font-bold'>No Orders To Show</div>
                    }
                </div>
            </Container>
            : <Spinner />
    )
}

export default Orders