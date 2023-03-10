import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { uiActions } from './store/ui-slice';
import Notification from './components/UI/Notification';

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      // Loading
      dispatch(uiActions.showNotification({ status: 'pending', title: 'Sending...', message: 'Sending cart data!' }));

      // PUT stores data but unlike post it will override existing data, & won't be added to a list of data
      const response = await fetch('https://advanced-redux-644d2-default-rtdb.firebaseio.com/cart.json', { method: 'PUT', body: JSON.stringify(cart) });

      if (!response.ok) {
        throw new Error('Sending cart data failed.');
      }

      // Success
      dispatch(uiActions.showNotification({ status: 'success', title: 'Success!', message: 'Sent cart data successfully!' }));
    };

    // Don't call the SendCartData the first time the useEffect is called
    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch((error) => {
      // Catch Errors
      dispatch(uiActions.showNotification({ status: 'error', title: 'Error!', message: 'Sending cart data failed!' }));
    });
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
