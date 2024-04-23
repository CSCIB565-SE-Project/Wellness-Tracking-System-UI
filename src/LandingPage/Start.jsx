import React from 'react'; 
import "../styles/start.css";
import trainerImg from "../assests/img/trainer.jpg";
import { useNavigate } from 'react-router-dom'; 

const Start =() => {
    let navigate = useNavigate(); // Hook for navigation

    const handleJoinNowClick = () => {
      navigate('/signup'); // Use the navigate function with the path to your register page
    };
    return <section id = 'classes'>
     <div className="container">
        <div className="start__wrapper">
            <div className="start__img">
                <img src={trainerImg} alt=""   data-aos =" fade-left"
                            data-aos-duration ="1500" ></img>
            </div>

            <div className="start__content" data-aos =" fade-right"
                            data-aos-duration ="1500" >
                <h2 className="section__title">
                    Ready to make a 
                    <span className="highlights"> change ?</span>
                </h2>
                <p>
                Step into the realm of personalized fitness excellence with Fit Inc. Our tailored training programs are designed to ignite your passion, sculpt your physique, and redefine your limits. Elevate your journey with us and embark on a path to lasting transformation.
                </p>
                <button className="register__btn" onClick={handleJoinNowClick}> Get Started</button>
            </div>
        </div>
    </div>   
    </section>
    
}

export default Start;
