import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/SideNav.css';

const SideNav = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="sidenav">
      <ul>
        {!token ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default SideNav;

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../style/SideNav.css';

// const NavigationSidebar = ({ token, updateToken }) => {
//   const navigateTo = useNavigate();

//   const logoutHandler = () => {
//     updateToken('');
//     localStorage.clear(); // Rensar token och userId från localStorage
//     navigateTo('/login'); // Skickar användaren till inloggningssidan
//   };

//   return (
//     <aside className="sidenav">
//       <ul>
//         {token ? (
//           <>
//             <li>
//               <Link to="/chat">Chat</Link>
//             </li>
//             <li>
//               <button onClick={logoutHandler} className="logout-button">
//                 Logga ut
//               </button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <Link to="/login">Logga in</Link>
//             </li>
//             <li>
//               <Link to="/">Registrera</Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </aside>
//   );
// };

// export default NavigationSidebar;
