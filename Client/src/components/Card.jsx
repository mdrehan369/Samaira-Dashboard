import { faCartShopping, faIndianRupee, faIndianRupeeSign, faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from './Button';
import { Hourglass } from 'react-loader-spinner';
// import { useSelector } from 'react-redux';

function Card({ res, productLoader, ...props }) {

    // const { isIndia, dirham_to_rupees } = useSelector(state => state.auth.location);
    const isIndia = true;
    const ref = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((node) => {
            const { isIntersecting, target } = node[0];
            if (isIntersecting) {
                target.classList.add(['animate-animate-appear']);
            } else {
                target.classList.remove(['animate-animate-appear']);
            }
        }, { threshold: 0 });
        observer.observe(ref.current);
    }, [])

    return (
        <>

            <div ref={ref} className='flex flex-col items-center justify-center rounded-sm cursor-pointer md:w-[20vw] w-full md:h-[65vh] h-[35vh] hover:border-gray-400 hover:dark:bg-secondary-color border-transparent border-[0px] dark:border-0 transition-all md:p-4 p-1 gap-0 overflow-hidden relative'

                // onMouseEnter={(e) => { !productLoader && e.currentTarget.lastElementChild.classList.remove('invisible'); e.currentTarget.lastElementChild.classList.add('translatee-y-[-4em]'); e.currentTarget.lastElementChild.classList.add('animate-animate-appear') }}

                // onMouseLeave={(e) => { !productLoader && e.currentTarget.lastElementChild.classList.add('invisible'); e.currentTarget.lastElementChild.classList.remove('translate-y-[-4em]'); e.currentTarget.lastElementChild.classList.remove('animate-animate-appear') }}
                // onClick={() => window.scrollTo(0, 0)}first
                {...props}
            >
                {
                    !productLoader ?
                        <>
                            <div onClick={(e) => { e.target.classList.length !== 0 && navigate(`/product/${res?._id}`) }} className='relative z-20'>
                                <span className="bg-red-600 z-10 text-white text-md font-medium me-2 md:px-2.5 px-1.5 py-0.5 rounded-none dark:bg-blue-900 dark:text-blue-300 absolute md:top-10 top-2 md:right-2 right-2 md:text-xs text-xs">-{(((res?.comparePrice - res?.price) / res?.comparePrice) * 100).toString().slice(0, 2)}% OFF</span>
                                <div className='overflow-hidden relative'>
                                    <FontAwesomeIcon icon={faCartShopping} className='absolute bottom-3 right-3 bg-gray-200 text-black p-2 rounded-2xl hover:bg-gray-300 z-40 cursor-pointer block md:hidden' onClick={(e) => setOpenModal(true)} />
                                    <img src={res?.image?.url || res.images[1]?.url || res.images[0].url} className='w-[100%] absolute p-0 transition-all duration-500 opacity-100 ease-in-out md:h-[50vh] h-[25vh] hover:scale-[1.2] brightness-75 object-cover -z-30' />
                                    <img src={res?.image?.url || res.images[0].url} className='w-[100%] p-0 transition-all duration-1000 cursor-pointer ease-in-out opacity-100 md:h-[50vh] h-[25vh] object-cover hover:scale-[1.2] hover:opacity-0 dark:hover:opacity-35' />
                                </div>
                                <h1 className='md:px-4 px-1 md:text-gray-700 text-black dark:text-white mt-2 text-center w-full md:text-sm text-xs md:h-10 hover:underline md:line-clamp-1 line-clamp-2'>{res?.title.slice(0, 30)}{res?.title.length > 30 && '...'}</h1>
                                <div className='flex items-center justify-between w-full mt-4'>
                                    <h2 className='px-0 md:text-sm text-xs text-start font-bold dark:text-gray-500 relative text-stone-600'>
                                        <div className='w-full md:h-[2px] h-[1px] bg-stone-600 dark:bg-gray-500 absolute top-[50%] left-0'></div>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? res?.comparePrice : Math.floor(res?.comparePrice / dirham_to_rupees)}
                                    </h2>
                                    <h2 className='px-0 md:text-lg text-sm text-end font-bold dark:text-white text-stone-900'>
                                        {isIndia ? <FontAwesomeIcon icon={faIndianRupeeSign} className='mr-2' /> : 'Dhs.'}{isIndia ? res?.price.toString()[0] + "," + res?.price.toString().slice(1) : Math.floor(res?.price / dirham_to_rupees)}
                                    </h2>
                                </div>
                            </div>
                            <Button className='text-sm w-[100%] mt-4 py-3 transition-transform duration-300 border-2 border-black hover:border-transparent rounded-sm font-bold invisible md:block hidden' onClick={() => setOpenModal(true)}>QUICK BUY</Button>
                        </>
                        : <Hourglass
                            visible={true}
                            height="50"
                            width="50"
                            ariaLabel="hourglass-loading"
                            wrapperStyle={{}}
                            wrapperclassName=""
                            colors={['#000000', '#72a1ed']}
                        />
                }
            </div>
        </>
    )
}

export default Card