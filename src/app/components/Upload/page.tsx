'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { db, storage } from '../../firebase-config';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Upload() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [biography, setBiography] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        let imageUrl = '';

        if (image) {
            const storageRef = ref(storage, `images/${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        try {
            const docRef = await addDoc(collection(db, "obituaries"), {
                fullName: fullName,
                biography: biography,
                image: imageUrl
            });
            console.log("Document written with ID: ", docRef.id);
            alert("obituary added")
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[100vh] bg-[#344648] text-[#fbe0c3]">
        <button className="fixed top-4 right-4 w-32 h-16 bg-gray-500 rounded-sm mr-3 text-white hover:bg-pink-700" onClick={() => router.push('../')}>Home</button>
            
            <div className=' w-[600px] flex flex-col items-center'>
            <div className="flex flex-col items-center mb-10">
                    <label htmlFor="fullName">Full Names</label>
                    <input type="text" className='rounded-lg w-[400px] bg-[#7d8e95]' id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="flex flex-col w-full items-center mb-10">
                    <label htmlFor="biography">Write Biography</label>
                    <textarea id="biography" className="rounded-lg w-full h-52  bg-[#7d8e95]" value={biography} onChange={(e) => setBiography(e.target.value)} />
                </div>
                <div className="flex flex-col mb-10 font-bold" >
                    <label htmlFor="image">Image</label>
                    <input className='bg-[#7d8e95]' type="file" id="image" accept="image/*" onChange={handleImageChange} />
                </div>
                <button className='w-[400px] h-10 rounded-lg shadow-md font-black text-black bg-[#ffbb98]' onClick={handleUpload}>Upload</button>
            </div>
        </div>
    );
}
