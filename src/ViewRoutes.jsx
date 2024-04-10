import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Detail from './pages/Detail';

import DATA from './data';
import { useStore } from './App';
import { useEffect } from 'react';

function ViewRoutes() {
  const { textures } = useStore();

  // useEffect(() => {
  //   console.log(textures);
  // }, [textures]);

  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      {DATA.map((item) => (
        <Route
          key={item.id}
          path={`detail/${item.path}`}
          element={
            <Detail
              title={item.title}
              description={item.description}
              image={item.image}
              id={item.id}
              path={item.path}
            />
          }
        />
      ))}
    </Routes>
  );
}

export default ViewRoutes;