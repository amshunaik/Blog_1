
import React from 'react'
import MainFrame from './Blog/MainFrame'
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

import CreatePost from './Blog/CreatePost';
import Root from './Blog/Root';
import PostPage from './Blog/PostPage';
import EditPost from './Blog/EditPost';

const App = () => {
    const router=createBrowserRouter([
        {path:"/", element:<Root/>, children:[
          
          {path:"/", element:<MainFrame/>},
        {path:"/create", element:<CreatePost/>},
        {path:"/posts/:id" ,element:<PostPage/>},
        {path:"/edit/:id" ,element:<EditPost/>}
    
    
      ]}
        
      ])
    
  return (
    <div>
         <RouterProvider router={router}/>
       
      
    </div>
  )
}

export default App
