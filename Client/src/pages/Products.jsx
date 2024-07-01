import React, { useEffect, useState } from 'react'
import { Container, Spinner, SearchBar, Card } from '../components';
import { FaIndianRupeeSign } from "react-icons/fa6";
import axios from 'axios';
import { NavLink } from 'react-router-dom';

//TODO text color highlighting on searching

function Products() {

    // const [loader, error, response] = useAxios('/api/v1/products');
    const [loader, setLoader] = useState(true);
    const [response, setResponse] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCatgory] = useState('All');
    // const [loader, setLoader] = useState()

    // useEffect(() => {
    //     ; (async () => {
    //         try {
    //             const res = await axios.get("/api/v1/products");
    //             setResponse(res.data.data);
    //         } catch (err) {
    //             console.log(err)
    //         } finally {
    //             setLoader(false);
    //         }
    //     })()
    // }, []);

    useEffect(() => {
        setLoader(true);
        ; (async () => {
            try {
                const res = await axios.get(`/api/v1/products?search=${search}`, {
                    baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true
                });
                setResponse(res.data.data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoader(false);
            }
        })()
    }, [search])

    return (
        <Container className='overflow-y-scroll h-full pt-10 flex flex-col w-[85vw]'>
            <div className='w-full flex items-center justify-center gap-10'>
                <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
                {/* <select className='w-[10%] p-4 rounded-lg text-lg font-medium' value={category} onChange={(e) => setCatgory(e.target.value)}>
                    <option value="Umbrella">Umbrella</option>
                    <option value="Straight">Straight</option>
                    <option value="Farasha">Farasha</option>
                    <option value="Tye Dye">Tye Dye</option>
                    <option value="All">All</option>
                </select> */}
            </div>
            {
                !loader ?
                <div className='grid grid-cols-4 overflow-scroll gap-2 m-2'>
                    {response.map((res, index) => <Card res={res} key={index} productLoader={loader} />)}
                </div>
                :<Spinner className='w-[80vw]' />
            }
        </Container>
    )
}

export default Products