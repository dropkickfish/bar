import React, { Component } from 'react';
import QRCode from 'qrcode-react';
import '../styles/qrcode.css';

class QrCode extends Component {  
  QRCode_URL = `https://bit.ly/ts-cust/${data._id}`
  render() {
    return (
      <div className="qrcode">
        <div className="qrcode__url">{this.QRCode_URL}</div>
        <QRCode size={500} value={this.QRCode_URL} />
      </div>
    );
  }
}

export default QrCode;