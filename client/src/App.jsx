import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

export function App() {
  const [student, setStudent] = useState(null);

  // Restore session from localStorage
  useEffect(() => {
    const savedStudent = localStorage.getItem('form2login_student');
    const savedToken = localStorage.getItem('form2login_jwt_token');

    if (savedStudent && savedToken) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (err) {
        localStorage.clear();
      }
    }
  }, []);

  const handleLoginSuccess = (studentData, token) => {
    setStudent(studentData);
    localStorage.setItem('form2login_student', JSON.stringify(studentData));
    localStorage.setItem('form2login_jwt_token', token);
  };

  const handleLogout = () => {
    setStudent(null);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950">
      {/* Header / Navbar */}
      <Navbar student={student} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center items-center">
        {student ? (
          <Dashboard student={student} onLogout={handleLogout} />
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-300 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Form2Login. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="w-2 h-2 bg-lime-500 inline-block"></span>
            <span>MERN Form2Login System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
