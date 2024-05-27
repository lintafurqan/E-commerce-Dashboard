import react, { useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
const Nav=()=>{
   const auth = localStorage.getItem('user');
   const navigate= useNavigate();
   const logout =()=>{
      localStorage.clear();
      navigate('/signup')
   }
    return(
       <div>
         <img  alt="logo" className="logo" src='https://cdn1.vectorstock.com/i/1000x1000/22/65/shopping-cart-simple-icon-e-commerce-and-internet-vector-4842265.jpg'/>
        { auth ?  <ul className='nav-ul'>
           <li><Link to="/">Products</Link></li> 
           <li><Link to="/add">Add Product</Link></li> 
           <li><Link to="/update">update Product</Link></li> 
           <li><Link onClick={logout} to="/signup">Logout ({JSON.parse(auth).name})</Link></li>
         </ul>
        : 
        <ul className='nav-ul nav-right'>
            <li><Link to="/signup">Signup</Link></li> 
            <li><Link to="/login">Login</Link></li> 
        </ul>
         }
       </div> 
      )
}
export default Nav;