import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';

const Login = lazy(() => import('../pages/create'));
const Forogt = lazy( () => import('../pages/forgot'));
const ImageEditor = lazy (() => import('../pages/Home'));
const Reset = lazy(() => import('../pages/RESET'));


export default function Main() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/home"  element={<ImageEditor/> } />
          <Route path="/" element={<Login/>} />
          <Route path="/forgot-password" element={<Forogt/>} />
          <Route path="/forgot-password/:key" element={<Reset/>} />
        </Routes>
      </Suspense>
    </Router>
  );
}
