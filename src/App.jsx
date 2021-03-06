import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Loading from '@/components/Loading.jsx';
import routes from '@/routes.jsx';
import Layout from '@/components/Layout.jsx';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import setItemsList from './actions/action';

const App = () => {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${process.env.BASE_URL}/api`)
      setData(response.data)
    }
    fetchData();
   },[])

   useEffect(()=>{      
     dispatch(setItemsList(data))
   },[data, dispatch])
   
  
  return (
  <Router>
    <Layout>
      <Suspense fallback={<Loading />}>
        <Switch>
          {routes.map((props, index) => (
            <Route key={index} {...props} />
          ))}
        </Switch>
      </Suspense>
    </Layout>
  </Router>
)};

export default App;
