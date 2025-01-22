import React, { useEffect, useState } from "react";
import { BrowserRouter,Navigate,Route,Routes, useParams } from "react-router-dom";
import Product from "./pages/Product.jsx";
import HomePage from "./pages/HomePage";
import Pricing from "./pages/Pricing";
import AppLayout from "./pages/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import CityList from "../components/CityList.jsx";
import CountryList from "../components/CountryList.jsx";
import City from "../components/City.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Form from "../components/Form.jsx";



function App() {
  
  const [cities,setCities] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  useEffect(()=>{
    const fetchCities = async () =>{
      try{
        setIsLoading(true);
        const res = await fetch('http://localhost:8000/cities');
        const data = await res.json();
        setCities(data);
      }
      catch(error){
        console.error(error.message);
      }
      finally{
        setIsLoading(false);
      }
      
    }
    fetchCities();
  },[])
 
  return (
    <BrowserRouter>
       <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="product" element={<Product />} />
           <Route path="pricing" element={<Pricing />} />
           <Route path="login" element={<Login />} />
           <Route path="app" element={<AppLayout />} >
              <Route index element={<Navigate replace to='cities'/>}/>
              <Route path="cities" element={<CityList cities={cities} isLoading={isLoading}/>} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList cities={cities} isLoading={isLoading}/>} />
              <Route path="form" element={<Form />} />
           </Route>
           <Route path="*" element={<PageNotFound />} />
       </Routes>
    </BrowserRouter>
  );
}

export default App
