'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';

interface Obituary {
  id: string;
  fullName: string;
  biography: string;
  image: string;
}

export default function Home() {
  const router = useRouter();
  const [obituaries, setObituaries] = useState<Obituary[]>([]);

  useEffect(() => {
    const fetchObituaries = async () => {
      const querySnapshot = await getDocs(collection(db, 'obituaries'));
      const obituariesList = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Obituary, 'id'>;
        return {
          id: doc.id,
          ...data,
        };
      });
      setObituaries(obituariesList);
    };
    fetchObituaries();
  }, []);

  return (
    <main className="flex justify-center">
      <div className="fixed top-0 h-20 w-full flex justify-between items-center bg-black right-0">
        <h1 className="text-white ml-40 text-[40px]">WELCOME TO POPULAR OBITUARIES</h1>
        <button
          className="w-32 h-16 bg-gray-500 rounded-sm mr-3 text-white hover:bg-pink-700"
          onClick={() => router.push('/components/Upload')}
        >
          Upload
        </button>
      </div>
      <div className="mt-24 flex flex-wrap w-11/12 items-center justify-between">
        {obituaries.map(obituary => (
          <div key={obituary.id} className="bg-white shadow-md rounded-lg p-4 m-4 w-[400px] h-[600px] overflow-scroll">
            <h2 className="text-xl font-bold text-center">{obituary.fullName}</h2>
            <div className="w-full h-56">
              {obituary.image ? (
                <Image
                  src={obituary.image}
                  alt={`Image of ${obituary.fullName}`}
                  className="w-full h-full object-contain"
                  width={200}
                  height={300}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            <p>{obituary.biography}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
