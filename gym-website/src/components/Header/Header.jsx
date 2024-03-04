import React from "react"; 
import "../../styles/header.css";
import logo from '../../assests/img/logo.png'
const nav__links=[
    {
        path:'#',
        display: 'Home'
    },
    {
        path:'#',
        display: 'Schedule'
    },
    {
        path:'#',
        display: 'Classes'
    },
    {
        path:'#',
        display: 'Pricing'
    },


]
const Header =()=> {
    return (<header className="Header">
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
                            <li className="nav__item"><a href={item.path}>
                                {item.display}
                            </a></li>   
                        ))
                     }
                    </ul>
                 </div>
                     {/*nav right*/}
                     <div className="nav__right">
                        <button className="register__btn">Register</button>
                         <span className="mobile__menu">
                            <i class="ri-menu-line"></i>
                         </span>
                     </div>

                      {/*nav right*/}
                      <div className="nav__right">
                        <button className="login__btn">Login</button>
                         <span className="mobile__menu">
                            <i class="ri-menu-line"></i>
                         </span>
                     </div>
            </div>
        </div> 
    </header>
    );
};

export default Header;

