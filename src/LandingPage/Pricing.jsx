import React from "react";
import'../styles/pricing.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const Pricing =() =>{
 let navigate = useNavigate(); // Hook for navigation

  const handleJoinNowClick = () => {
    navigate('/signup'); // Use the navigate function with the path to your register page
  };
    return <section id ="pricing-plan">
        <div className="container">
            <div className="pricing__top">
                <h2 className="section__title">
                Complimentary  <span className="highlights">
                Fitness 
                    </span> Perks 
                </h2>
                <p> Unlock the full potential of your fitness journey with our Complimentary Fitness Perks. Dive into a diverse collection of resources designed to elevate your health and well-being. <br/> From personalized workout programs that cater to your individual goals, to a rich library of nutrition guides to fuel your body optimally, we've got you covered </p>
            </div>
            {/* ====pricing wrapper =====*/}
            <div className="pricing__wrapper">
                <div className="pricing__item"   data-aos = "fade-up"
                            data-aos-duration ="1500" >
                    <div className="pricing__card-top">
                        <h2 className="section__title">Customized Workout Guides </h2>
                        <h2 className="pricing section__title"> $0 <span>/month
                            </span> </h2>
                    </div>

                    <div className="services">
                        <ul>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Tailored fitness routines for all levels</li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Step-by-step illustrated exercise instructions </li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Schedule adaptations for busy lifestyles</li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Progressive training for strength and endurance</li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Recovery strategies and stretch routines</li>
                        </ul>
                    </div>
                    <div className="btn__services">
                        {/* ... other elements ... */}
                        <div className="button-container"> {/* Add this wrapper around your button */}
                            <button className="register__btn" onClick={handleJoinNowClick} >Join Now</button>
                        </div>
                    </div>

                </div>


                <div className="pricing__item pricing__item-01" data-aos = "fade-up"
                            data-aos-duration ="1800" >
                    <div className="pricing__card-top">
                        <h2 className="section__title">Health and Nutrition Resources </h2>
                        <h2 className="pricing section__title"> $0 <span>/month
                            </span> </h2>
                    </div>

                    <div className="services">
                        <ul>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Comprehensive meal prep guides for healthy eating</li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Calorie and macro tracking tools</li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Nutritionist-curated recipe collections </li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Educational content on supplements and vitamins </li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Hydration reminders and dietary tips </li>
                        </ul>
                    </div>
                    <div className="btn__services">
                        {/* ... other elements ... */}
                        <div className="button-container"> {/* Add this wrapper around your button */}
                            <button className="register__btn" onClick={handleJoinNowClick}>Join Now</button>
                        </div>
                    </div>
                </div>

                <div className="pricing__item pricing__item-02" data-aos = "fade-up"
                            data-aos-duration ="2000">
                    <div className="pricing__card-top">
                        <h2 className="section__title">Virtual Fitness Challenges </h2>
                        <h2 className="pricing section__title"> $0 <span>/month
                            </span> </h2>
                    </div>

                    <div className="services">
                        <ul>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Monthly step and activity competitions </li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Workout streaks with rewards for consistency</li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Community leaderboards for motivation </li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Specialized challenges (e.g., 30-day yoga) </li>
                            <li><span><i className="ri-checkbox-blank-circle-fill"></i></span> Social sharing of achievements and progress </li>
                        </ul>
                    </div>
                    <div className="btn__services">
                        {/* ... other elements ... */}
                        <div className="button-container"> {/* Add this wrapper around your button */}
                            <button className="register__btn " onClick={handleJoinNowClick} >Join Now</button>
                        </div>
                    </div>
                </div>





            </div>
        </div>
    </section>
};


export default Pricing;