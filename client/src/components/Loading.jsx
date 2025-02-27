import React from 'react'
import '../styles/loading.css'
import { LoaderCircle } from 'lucide-react';
export const Loading = () => {
    return ( <div className='loading'> <LoaderCircle className='loading-icon' /> <p>loading... </p></div>)
}
