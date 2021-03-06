import React, { Component } from 'react';
import '../styles/orderListItem.css';
// import SpecialWish from './specialWish.js';
import { connect } from 'react-redux';
import { updateStatus } from '../store/actions';


class OrderListItem extends Component  {
  state = {
    expanded: false
  }

  statusList = ['ordered', 'on its way', 'delivered']
  onButtonClick = (e) => {
    const index = this.statusList.findIndex(status => status === this.props.status)
    let nextIndex;
    if (e.target.name === 'back') {
      nextIndex = index === 0 ? 0 : index - 1;
    } else {
      nextIndex = index + 1 === this.statusList.length ? index : index + 1;
    }
    const nextStatus = this.statusList[nextIndex];
    this.props.updateStatus(nextStatus, this.props.queue.find(order => order.orderId === this.props.orderId))
    this.props.emitStatusUpdate(nextStatus)
  }

  render() {
    const { expanded } = this.state;
    return (
      <div className={`orderListItem${expanded ? '--expanded' : ''}`}>
        <button name='back' onClick={this.onButtonClick} className="wrapper-back" value="Back">
          Back
        </button>
        <div className={`wrapper-list${expanded ? '--expanded' : ''}`}>
          <h2>Order: {this.props.orderId}</h2> 
          <p>Table: {this.props.tableNumber}</p>
          {
            this.props.items.map(item => {
              return <div key={item._id} className="item">{item.name} x {item.quantity}</div>
            })
          }

          <button
            onClick={() => this.setState(state => ({ expanded: !state.expanded}))}
            className={`arrow-button${expanded ? '--expanded' : ''}`}
          ></button>
        </div>
        <button name='update' onClick={this.onButtonClick} className="wrapper-status">
          <p>Current status</p>
          <p><strong>{this.props.status}</strong></p>
          <p>Tap to update</p>
        </button>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (status, orderId) => dispatch(updateStatus(status, orderId))
})

export default connect(
  null,
  mapDispatchToProps
)(OrderListItem);