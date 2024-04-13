import React , {useRef} from "react"; 
import "../styles/header.css";
import logo from '../assests/img/logo.png';
import {useEffect} from "react";
import { useNavigate } from 'react-router-dom';

const nav__links=[
    {
        path:'#home',
        display: 'Home'
    },
    {
        path:'#schedule',
        display: 'Schedule'
    },
    {
        path:'#classes',
        display: 'Classes'

        
    },
    {
        path:'#pricing-plan',
        display: 'Pricing'
    },

]
const Header =()=> {

    const navigate = useNavigate(); 
    const headerRef=useRef(null)
    const headerFunc = () => {
        if (document.body.scrollTop >80 || document.documentElement.scrollTop>80){
            headerRef.current.classList.add('sticky__header')
        }else {
            headerRef.current.classList.remove('sticky__header')

        }
    }

    useEffect(() => {
        window.addEventListener('scroll', headerFunc);
        return ()=> window.removeEventListener('scroll' ,headerFunc);
    },[]);

    const handleClick =e => {
        e.preventDefault()

        const targetAttr =e.target.getAttribute('href')
        const location =document.querySelector(targetAttr).offsetTop

        window.scrollTo ({
            left: 0,
            top:location -80
        })
        }

    const handleRegisterClick = () => {
        navigate('/signup'); // Navigate to the registration page
    };

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to the login page
    };
   

    return (
    <header className="Header" ref={headerRef}>
         <div className="container">
            <div className="nav__wrapper">

                {/*========LOGO /*/}
                <div className="logo">
                    <div className="logo__img">
                        <img src={logo} alt=""/>
                    </div>
                    <h2>FIT INC</h2>
                </div>

                {/*navigation*/}
                 <div className="navigation">
                    <ul className="menu">
                     {
                        nav__links.map(item=> (
                            <li key={item.path} className="nav__item">
                                <a onClick= {handleClick} href={item.path}>
                                {item.display}
                            </a></li>   
                        ))
                     }
                    </ul>
                 </div>
                     {/*nav right*/}
                     <div className="nav__right">
                        <button className="register__btn" onClick={handleRegisterClick}>Register</button>
                         <span className="mobile__menu">
                            <i class="ri-menu-line"></i>
                         </span>
                     </div>

                      {/*nav right*/}
                      <div className="nav__right">
                        <button className="login__btn"onClick={handleLoginClick}>Login</button>
                         <span className="mobile__menu">
                            <i className="ri-menu-line"></i>
                         </span>
                     </div>

                     
            </div>
        </div> 
    </header>
    );
};

export default Header;

