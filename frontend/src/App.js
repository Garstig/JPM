import { useState } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import Projects from './components/Projects';
import Navbar from './components/Navbar';
import NotImplemented from './components/NotImplemented';

function App() {
  const [activeView, setActiveView] = useState('calendar');

  const renderContent = () => {
    switch (activeView) {
      case 'calendar':
        return <Calendar />;
      case 'projects':
        return <Projects />;
      default:
        return <NotImplemented />;
    }
  };

  return (
    <div className="App">
      <Navbar activeView={activeView} onViewChange={setActiveView} />
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
