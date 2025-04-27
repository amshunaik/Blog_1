import React, { useEffect ,useState} from 'react'
import SideBar from './SideBar'
import axios from 'axios';

import PostPage from './PostPage'
import HomePage from './HomePage';

const MainFrame = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://blogpost1-nxy5.onrender.com/posts');
          const posts = response.data; // Extracting the array
          setPosts(posts)
         console.log(posts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      fetchData();
    }, []); // Dependency array
  return (
    <div className='flex flex-row  ml-0 mt-0 '>
       {posts.length==0?
       <div className=' flex flex-col mt-[250px] ml-[500px] justify-center '>
        <img src="post2.png" alt="" className='w-[50px] ml-[20px]' />
        <h1 className='block text-center '>No Blogs Created</h1>
        </div>:<HomePage/>}
      

      
    </div>
  )
}

export default MainFrame
