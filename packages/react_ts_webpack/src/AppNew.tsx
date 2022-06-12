import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Counter from './pages/Card';
import Title from './components/Title';
import App from './App';
import TransitionDemo from './pages/TransitionDemo';
import DeferedValueDemo from './pages/deferedValuedemo';
import './app.css'
import ProductsMain from './pages/productList';
function AppHome() {

  const [randomStr, setRandomStr] = useState('ggyysds');
  const [update, setUpdate] = useState(true);
  useEffect(() => {
    console.log('in App')
  })
  return (
    <div className="App">
      <div className='appHeader'>Header</div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/title' element={<Title />} />
          <Route path='/transition' element={<TransitionDemo />} />
          <Route path='/deferedvalue' element={<DeferedValueDemo />} />
          <Route path='/productlist' element={<ProductsMain />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default AppHome;
