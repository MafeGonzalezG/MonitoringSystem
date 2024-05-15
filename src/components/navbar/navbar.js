import React, {useState} from 'react';
import './navbar.css';

/**
 * Navigation bar component.
 *
 * @component
 * @param {Object} props - The component accepts onChange props.
 * @param {function} props.onChange - The change+enter press event handler.
 * @returns {JSX.Element} The rendered Navbar component.
 *
 * @example
 * // Render a navbar with a search bar that logs the input value on enter press.
 * <Navbar onChange={()=>console.log('value changed');} />
 */
function Navbar({onChange}) {
      const handlePress = (country) => {
        onChange(country);
      };
      const [input, setInput] = useState('');
      return (
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent.bg-gradient text-dark">
      <a className="navbar-brand" href="#">Monitoring</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    
      <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className='nav-item'>
            <a className='nav-link' href='#'>Home</a>
          </li>
          <li className='nav-item '>
            <a className='nav-link' href='#'>Pricing</a>
          </li>
          <li className='nav-item '>
            <a className='nav-link' href='#'>Contact</a>
          </li>
          <li className="nav-item  ">
          <form className="form-inline my-1 my-lg-0">
            <input  className="form-control mr-sm-2" type="text" placeholder="country" onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{if(e.key=='Enter') handlePress(input)}} />
          </form>
         </li>
        </ul>
        <div>
          <button type="button" className="signs btn btn-primary btn-sm m-3" id='signin'>Sign In</button>
          <button type="button" className="signs btn btn-primary btn-sm m-3" id='signin'>Sign In</button>
        </div>
      </div>
    </nav>
      );}

export default Navbar;
