import React, { useCallback, useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { Breadcrumb, Tabs } from 'antd'
import { Link, useParams } from 'react-router-dom'
import Details from './Details';
import Gallery from './Gallery';

export default function Index() {

    const [tabs, setTabs] = useState("1");
    const [state, setState] = useState({})
    const params = useParams()

    const handleChange = (key) => {
        setTabs(key)
    }

    const readAlbum = useCallback(async () => {

        const q = query(collection(firestore, "albums"), where("id", "==", params.id));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data()
            setState(data)
        });
    }, [params.id])

    useEffect(() => {
        readAlbum()
    }, [readAlbum])

    return (
        <div>
            <Breadcrumb className='pb-2'>
                <Breadcrumb.Item ><Link to="/dashboard/website-settings/albums" className='text-decoration-none'>Albums</Link></Breadcrumb.Item>
                <Breadcrumb.Item className='text-black'>Details</Breadcrumb.Item>
            </Breadcrumb>

            <Tabs defaultActiveKey="1" onChange={handleChange}
                items={[{ label: `Details`, key: '1' }, { label: `Images`, key: '2' },]} />

            {tabs === "1" ? (<Details state={state} setState={setState} />) : (<Gallery data={state} />)}
        </div>
    )
}