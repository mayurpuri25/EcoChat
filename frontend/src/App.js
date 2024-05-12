import './App.css';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import './style.css';

function App() {
    
  const sessionID = localStorage.getItem('sessionID');
  
  return (
    <>
      {sessionID ? <Dashboard/> : <Homepage/>}
      
    </>
  );
}

export default App;
