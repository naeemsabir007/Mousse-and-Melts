import React from 'react';
import { StateProvider, useStore } from './context/StateContext';
import Navbar from './components/Navbar';
import AddToCartNotification from './components/AddToCartNotification';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OurStory from './pages/OurStory';

const App: React.FC = () => {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
};

const AppContent: React.FC = () => {
  const { currentPath, lastAddedItem, clearLastAddedItem } = useStore();

  let PageComponent;
  if (currentPath === '/login') {
    PageComponent = <Login />;
  } else if (currentPath === '/admin') {
    PageComponent = <Admin />;
  } else if (currentPath === '/cart') {
    PageComponent = <Cart />;
  } else if (currentPath === '/checkout') {
    PageComponent = <Checkout />;
  } else if (currentPath === '/our-story') {
    PageComponent = <OurStory />;
  } else {
    PageComponent = <Home />;
  }

  const isAdminRoute = currentPath === '/admin' || currentPath === '/login';

  return (
    <div className="font-sans text-chocolate antialiased selection:bg-velvet-red selection:text-white">
      {!isAdminRoute && (
        <>
          <Navbar />
          <AddToCartNotification item={lastAddedItem} onClose={clearLastAddedItem} />
        </>
      )}
      {PageComponent}
    </div>
  );
};

export default App;