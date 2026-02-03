

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { MyAppointments } from './pages/MyAppointments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/meus-agendamentos" element={<MyAppointments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

