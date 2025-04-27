import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
    
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://blogpost1-nxy5.onrender.com/posts');
        const posts = response.data; // Extracting the array
        console.log(posts);
        setPosts(posts)
       console.log(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []); // Dependency array

   const OpenPost=(id)=>{
    console.log(id);
    
   }

  return (
    <div className='w-full'>
      <h1 className='text-center justify-center text-3xl font-bold mt-4 w-full'>BLOG POSTS</h1>
      <div className='mt-4'>
      <Link to="/create" className='border-2 rounded-lg px-4 text-xl float-right mr-10 bg-gray-800 text-white align-center'>+ Create</Link>
      <ul className='flex flex-wrap w-full gap-10 mt-16 pt-12'>
        {posts.map((post) => (
          <li key={post._id} className='w-[300px] border-2 p-4 h-[300px] border-gray-300 bg-gray-100'>
             <Link to={`/posts/${post._id}`}>
              <h2 className='text-center font-bold text-xl text-red-600'>{post.title.toUpperCase()}</h2>
             
             <p className='mt-4 overFlow-auto overscroll-contain'><span className='font-medium text-lg'>Summary : </span>{post.content}</p>
            </Link>
            
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default HomePage;
