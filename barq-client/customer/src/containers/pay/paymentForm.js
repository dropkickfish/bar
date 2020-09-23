import React, { Component } from 'react';
import {
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
} from 'react-stripe-elements';
import axios from 'axios';

import Loader from '../../ui/loader';
import Footer from '../../ui/footer';

class PaymentForm extends Component {
  readyCounter = 3;

  buttonStates = {
    paying: {
      title: 'Paying...',
      clickable: false,
      type: 'neutral',
    },
    success: {
      title: 'Track order!',
      clickable: true,
      type: 'success',
    },
    failed: {
      title: 'Try Again',
      clickable: true,
      type: 'danger',
    },
    ready: {
      title: 'Submit',
      clickable: true,
      type: 'success',
    },
  }

  state = {
    ordered: false,
    button: this.buttonStates.ready,
  };

  createOrderData = async (order) => {
    return {
      order: {
        items: order,
      },
    };
  }

  handleSubmit = async (e) => {
    const { button: { clickable } } = this.state;
    const {
      total, order, updateOrder, updatePage, isMenuOpen,
    } = this.props;

    e.preventDefault();
    if (!clickable) return;

    try {
      const { paying, success } = this.buttonStates;
      const { barId } = this.props;
      this.setState({ button: paying });
      const isOpen = await isMenuOpen();
      if (!isOpen) return updatePage('CLOSED');
      const orderData = await this.createOrderData(total, order);
      const { data } = await axios.post(`/${barId}/pay`, orderData);
      if (data.status === 'ordered') {
        window.localStorage.setItem(barId, JSON.stringify(data));
        updateOrder(data);
        this.setState({
          ordered: true,
          button: success,
        });
        updatePage('QUEUE');
      }
    } catch (err) {
      const { failed } = this.buttonStates;
      this.setState({ button: failed });
    }
  }

  handleBlur = () => null;

  handleChange = () => null;

  handleFocus = () => null;

  handleReady = () => {
    this.readyCounter += 1;
    if (this.readyCounter === 3) {
      this.setState({ button: this.buttonStates.ready });
    }
  };

  render() {
    const {
      button: { title, type, clickable },
      ordered,
    } = this.state;
    const { updatePage } = this.props;
    return (
      <>
        {
          title === 'Loading'
          && <Loader />
        }
        <form
          className={`pay__form${title === 'Loading' ? '--invisible' : ''}`}
          onSubmit={this.handleSubmit}
        >

          <div>
            <br></br>
            <p>Your order will be submitted to the bar, and placed in a queue. Once you hit submit, you can view your order progress on your phone</p> 
            <br></br>
            <p>Please have your debit or credit card ready for the server when they arrive.</p>
          </div>

          <Footer
            primaryButtonName={title}
            primaryButtonType={type}
            primaryButtonClickable={clickable}
            secondaryButtonName={ordered ? null : 'Back'}
            onSecondaryClick={ordered ? null : () => updatePage('CHECKOUT')}
          />
        </form>
      </>
    );
  }
}

export default injectStripe(PaymentForm);
