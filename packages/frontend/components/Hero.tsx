import React from 'react';
import Image from "next/image"
import { useState, useEffect } from 'react';
import AuctionListings from './Listings';
import { useRef } from 'react';
import { MutableRefObject } from 'react';

function MyComponent(onClick: () => void) {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleScroll() {
    if (window.pageYOffset > 200) {

      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer fixed bottom-0 duration-700 mt-auto animate-bounce p-2 w-20 h-20 ring-1 bg-slate-200 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center 
      ${isScrolled ? "opacity-0" : ""}
      
        `}
    >
      <svg
        className="w-12 h-12 text-stone-400"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  );
}
export const Hero = ({ divref }:{ divref : MutableRefObject<null|HTMLDivElement>}) => {

  const scrollFunct = ()  =>  {window.scroll({top:divref?.current?.offsetTop, behavior:'smooth'})}
  return (
    <div className="hero  min-h-screen relative">

      
      <div className="hero-overlay bg-opacity-70 "></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-lg">

          <h1 className="mb-5 text-5xl font-boldbg select-none pointer-events-none">
            CarWatch
          </h1>
          <div className="flex items-baseline select-none pointer-events-none"><p className="mb-5 text-2xl">Cars for sale from all across the internet </p> <span className="block animate-waving text-4xl">👋</span></div>

          <button onClick={scrollFunct}     className="animate-pulse group relative h-12 w-48 overflow-hidden rounded-lg bg-slate-200 text-lg shadow " >
            <div className="absolute inset-0 w-0 bg-stone-300 transition-all duration-[350ms] ease-out group-hover:w-full"></div>
            <span className="relative text-stone-600 group-hover:text-stone-600  font-semibold">Get started! </span>
          </button>
        </div>

      </div>
      {MyComponent(scrollFunct)}
    </div>


  )
}