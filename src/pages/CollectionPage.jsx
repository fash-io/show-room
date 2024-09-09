import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import SlidingImages from "../components/SlidingImages";
import ShowCard from "../components/ShowCard";

const CollectionPage = (props) => {
  const [collection, setCollection] = useState(null);
  const [collectionImages, setCollectionImages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { options, user } = props;

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/collection/${id}?language=en-US`,
          options
        );
        const imageResponse = await fetch(
          `https://api.themoviedb.org/3/collection/${id}/images`,options
        )
        if (!response.ok || !imageResponse.ok) {
          throw new Error("Failed to fetch collection.");
        }
        const data = await response.json();
        const imageDate = await imageResponse.json();
        setCollection(data);
        setCollectionImages(imageDate);
      } catch (err) {
        console.error("Failed to fetch collection:", err);
        setError("Failed to load collection.");
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [id, options]);

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-2xl">Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-2xl text-red-500">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen text-white">
        {/* Collection Header Section */}
        {collection && (
           <>
            <div className="relative w-full h-96 sm:h-[600px] max-h-[75vh]">
           <img
             src={`https://image.tmdb.org/t/p/original${
               collection.backdrop_path || collection.poster_path
             }`}
             alt={collection.title || collection.name}
             className="object-cover w-full h-full object-top"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
           <div className="absolute bottom-10 left-5 sm:left-10 p-4 sm:p-8">
             <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2">
               {collection.title || collection.name}
             </h1>
           </div>
         </div>
         <div className="p-4 sm:p-6 md:p-10 lg:p-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
         {/* Content Poster */}
         <div className="flex justify-center md:justify-start">
           <img
             src={`https://image.tmdb.org/t/p/original${collection.poster_path}`}
             alt={`${collection.title || collection.name} Poster`}
             className="w-64 sm:w-80 rounded-lg shadow-lg"
           />
         </div>
         <div className="col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold ">Overview</h2>
            <p className="text-sm sm:text-lg p-9">{collection.overview}</p>
            {/* <SlidingImages images={collectionImages.backdrops} className={"h-full"}/> */}
            </div>
         </div>
         
           </>
        )}

        {/* Movies List */}
        <div className="container mx-auto p-8">
          <h2 className="text-4xl font-semibold mb-8">Movies in Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {collection.parts.map((movie) => (
             <ShowCard key={movie.id} show={movie} type_={movie.media_type} type={1} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
