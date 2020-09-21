import React, { useState, forwardRef } from 'react';
import { sumBy } from 'lodash';

import Loader from '../ui/loader';
import MenuItem from '../ui/menuItem';
import Footer from '../ui/footer';
import Price from '../ui/price';
import TextInput from '../ui/textInput';


import '../styles/containers/checkout.css';
import SecondaryHead from '../ui/secondaryHead';

const Checkout = forwardRef((props, ref) => {
  const {
    order, total, updatePage, isMenuOpen, updateOrder,
  } = props;
  const [tableNumber, setTableNumber] = useState('');
  return (
    <div ref={ref} className="checkout">
      {
        !order
          ? <Loader />
          : (
            <>
              <div className="checkout__bill">
                <SecondaryHead title="Your Order" />
                {
                  order.length === 0
                    ? <div>No items selected</div>
                    : order.map(item => <MenuItem key={item.name} item={item} />)
                }
                <div className="checkout__total">
                  Total
                  <Price style={{ textAlign: 'right', fontSize: '1.25rem' }} price={total} />
                </div>
                <TextInput keyboardType = 'numeric' value={tableNumber} onChange={e => setTableNumber(e.target.value)} title="Table Number" />
              </div>
              <Footer
                primaryButtonType={sumBy(order, 'quantity') > 0 ? 'success' : 'neutral'}
                primaryButtonClickable={sumBy(order, 'quantity') > 0}
                primaryButtonName={sumBy(order, 'quantity') > 0 ? 'Pay' : 'Nothing selected'}
                onPrimaryClick={() => {
                  window.localStorage.setItem(props.barId, JSON.stringify({ items: order }));
                  updateOrder({ tableNumber });
                  isMenuOpen()
                    .then(isOpen => (isOpen ? updatePage('PAY') : updatePage('CLOSED')));
                }}
                secondaryButtonName="Back"
                onSecondaryClick={() => updatePage('MENU')}
              />
            </>
          )
    }
    </div>
  );
});

export default Checkout;
