import { Outlet } from 'react-router-dom';
// Common
import Header from './Common/Header';
import Footer from './Common/Footer';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <div className="content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
