import React, { useState } from 'react';
import '../../styles/footer.css'; // Updated the path to reflect the correct location
// Removed Footer.module.css import as you're using footer.css
import facebookIcon from '../../assests/img/facebook.jpeg'; // Updated the extension to .jpg
import youtubeIcon from '../../assests/img/youtube.png'; // This should match the file extension
import instagramIcon from '../../assests/img/instagram.jpeg'; // Updated the extension to .jpg
import linkedinIcon from '../../assests/img/linkedin.png'; // This should match the file extension
import logo  from '../../assests/img/logo.png'


const Footer = () => {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = () => {
    // Implement your subscribe logic here
    alert(`Subscribed with email: ${email}`);
    setEmail('');
  };

  const year = new Date().getFullYear();
  
  return (
    <footer className="footer" data-aos = "fade-up"
    data-aos-duration ="1500" >
      <div className="container">
        <div className="footer__wrapper">
          <div className="footer__box">
          <div className="logo">
                <div className="logo__img">
                    <img src ={logo} alt ="" />
                </div>
                <h2> FitBody</h2>
            </div>
            <p>Stay Fit and healthy with our programs tailored for you.</p>
            <div className="social-media-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon} alt="YouTube" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            </div>
            <div className="emailSection">
              <input 
                type="email" 
                placeholder="Your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <button onClick={handleSubscribe}>Subscribe</button>
                </div>
                    <h4 className="footer__title">Company</h4>
                        <ul className="footer__links">
                            <li> 
                                <a href="#" > Our Program </a>
                            </li>
                            <li> 
                                <a href="#" > Our Plan </a>
                            </li>               
                            <li> 
                                <a href="#" > Become A Member  </a>
                            </li>
                        </ul>
                    </div>

                <div className="footer__box">
                    <h4 className="footer__title">Quick Links</h4>
                    <ul className="footer__links">
                        <li> 
                            <a href="#" > About us </a>
                        </li>
                        <li> 
                            <a href="#" > Contact us  </a>
                        </li>               
                        <li> 
                            <a href="#" > Support  </a>
                        </li>
                    </ul>
                </div>
                </div>

        <p className="copyright">
          Copyright - {year} developed by FitInc. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
