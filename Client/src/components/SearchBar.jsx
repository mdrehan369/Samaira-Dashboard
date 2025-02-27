import React from 'react'

function SearchBar({
    className,
    ...props
}) {
    return (
        <div className='md:w-[50%] w-[80%] flex items-center justify-center'>
            <input
            className='w-full h-full p-3 m-3 text-sm rounded-md placeholder:text-gray-400 border-[1px] border-gray-400 bg-[#f1f1f1] dark:bg-secondary-color dark:text-white dark:border-transparent shadow-sm focus:ring-0 focus:outline-none dark:focus:border-gray-400 focus:border-black'
            placeholder='Search Here...'
            {...props}
            />
            {/* <button>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button> */}
        </div>
    )
}

export default SearchBar