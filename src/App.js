// // // App.js
// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';// import LoginForm from './LoginPage/LoginForm';
// // // import logo from './LoginPage/FitInc.png'; 
// // // import Dashboard from './DashboardPage/Dashboard';
// // // import PasswordResetForm from './LoginPage/PasswordResetForm';
// // // import NewPasswordResetForm from './LoginPage/NewPasswordResetForm';
// // // import SignupForm from './LoginPage/SignupForm';

// // import './App.css';
// // import Header from "./components/Header/Header";
// // import Hero from "./components/UI/Hero.jsx";
// // import Exercises from "./components/UI/Exercises.jsx";
// // import Start from "./components/UI/Start.jsx";
// // import Pricing from "./components/UI/Pricing.jsx";
// // import Testimonial from './components/UI/Testimonial.jsx';
// // import Footer from './components/UI/Footer.jsx';
// // import UserDashboard from './components/Dashboard/UserDashboard.jsx';
// // // import LoginForm from './LoginPage/LoginForm.js';
// // // import SignupForm from './LoginPage/SignupForm.js';

// // function App() {
// //   return (
// //     <>
// //     <Router>
// //             <Header />
// //             <Routes>
// //               {/* <Route path="/login" element={<LoginForm />} /> */}
// //               {/* <Route path="/signup" element={<SignupForm />} /> */}
// //               <Route path="/dashboard" element={<UserDashboard />} />

// //             </Routes>
// //             <Hero/>
// //             <Exercises/>
// //             <Start />
// //             <Pricing />
// //             <Testimonial/>
// //             <Footer/>
// //     </Router>

// //   </>
// //   );
// // }

// // export default App;



// import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import './App.css';
// import Header from "./components/Header/Header";
// // import UserDashboard from './components/Dashboard/UserDashboard.jsx';
// // import ProfessionalDashboard from './components/Dashboard/ProfessionalDashboard.jsx';
// // import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';
// import Hero from "./components/UI/Hero.jsx";
// import Exercises from "./components/UI/Exercises.jsx";
// import Start from "./components/UI/Start.jsx";
// import Pricing from "./components/UI/Pricing.jsx";
// import Testimonial from './components/UI/Testimonial.jsx';

// // function App() {
// //   return (
// //     <Router>
// //       <Header/>
      
// //       <Routes>
// //         <Route path="/" element={<Header/>} />

// //         <Route path="/userdashboard" element={<UserDashboard />} />
// //         <Route path="/professionaldashboard" element={<ProfessionalDashboard/>} />
// //         <Route path="/admindashboard" element={<AdminDashboard/>} />
      


// //         {/* Uncomment the following routes as needed */}
// //       {/* /  <Route path="/login" element={<LoginForm />}/> */}
// //         {/* <Route path="/signup" element={<SignupForm />} /> */}
// //         {/* ... other routes as needed ... */}
// //       </Routes>
            
    
// //     </Router>
// //   );
// // }

// // export default App;
// // const LandingPage = () => (
// //   <>
// //     <Header/>
// //     <Hero />
// //     <Exercises />
// //     <Start />
// //     <Pricing />
// //     <Testimonial />
// //   </>
// // );

// // function App() {
// //   return (
// //     <Router>
// //       <Header/>
      
// //       <Routes>
// //         <Route path="/" element={<LandingPage />} />        
// //         <Route path="/userdashboard" element={<UserDashboard />} />
// //         <Route path="/professionaldashboard" element={<ProfessionalDashboard />} />
// //         <Route path="/admindashboard" element={<AdminDashboard />} />
        
// //         {/* Uncomment the following routes as needed */}
// //         {/* <Route path="/login" element={<LoginForm />}/> */}
// //         {/* <Route path="/signup" element={<SignupForm />} /> */}
// //         {/* ... other routes as needed ... */}
// //       </Routes>
            
// //     </Router>
// //   );
// // }
// function App (){
//   return (
//       <>
//           <Header />
//           <Hero/>
//           <Exercises/>
//           <Start />
//           <Pricing />
//           <Testimonial/>
//       </>
//   );
// }
// export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from "./components/Header/Header";
import Hero from "./components/UI/Hero.jsx";
import Exercises from "./components/UI/Exercises.jsx";
import Start from "./components/UI/Start.jsx";
import Pricing from "./components/UI/Pricing.jsx";
import Testimonial from './components/UI/Testimonial.jsx';
import LoginForm from './LoginPage/LoginForm.js';
import SignupForm from './LoginPage/SignupForm.js';

import UserDashboard from './components/Dashboard/UserDashboard.jsx';
import ProfessionalDashboard from './components/Dashboard/ProfessionalDashboard.jsx';
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx';


 function App (){
     return (

         <Router> 

              <Header/> 

              <Routes>
              
        <Route path="/" element={<Header/>} /> 
        {/* <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/professionaldashboard" element={<ProfessionalDashboard/>} />
        <Route path="/admindashboard" element={<AdminDashboard/>} /> 
   
          */}
         
         {/* <Route path="/login" element={<LoginForm />} /> 
        <Route path="/signup" element={<SignupForm />} />   */}
<Hero/>
              <Start/>
              <Exercises/>
              <Pricing/>
              <Testimonial/>
             
            </Routes> 
        </Router> 
          );
        }
        
export default App;

// function App() {
//   return (
//     <Router>
//       <Header/>
      
//       <Routes>
//         <Route path="/" element={<Header/>} />

//         <Route path="/userdashboard" element={<UserDashboard />} />
//         <Route path="/professionaldashboard" element={<ProfessionalDashboard/>} />
//         <Route path="/admindashboard" element={<AdminDashboard/>} />
      


//         {/* Uncomment the following routes as needed */}
//       {/* /  <Route path="/login" element={<LoginForm />}/> */}
//         {/* <Route path="/signup" element={<SignupForm />} /> */}
//         {/* ... other routes as needed ... */}
//       </Routes>
            
    
//     </Router>
//   );
// }

// export default App;