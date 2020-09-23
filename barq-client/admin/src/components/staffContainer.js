import React from 'react';
import QRCode from 'qrcode-react';

const StaffContainer = ({ barId, generateStaffCode, staffCode }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    generateStaffCode(barId);
  };
  const url = `https://bit.ly/ts-staff/${barId}`;
  return (
    <div className="staffContainer">

      <div className="leftBarPoster">
        <h1>Staff Login</h1>
        <h3>
          Share your unique staff login code with your bar
          staff to log in to the bartender interface.
        </h3>
        <QRCode value={url} />
        <h3>{url}</h3>
      </div>

      <div className="rightBarPoster">
        <button className="clickerSmall" id="generateStaffCode" type="button" value="Generate code" onClick={onSubmit}>Get New Login Code</button>
        {staffCode ? <p id="newStaffCode">{staffCode}</p> : <p>Staffcode hidden</p>}
      </div>
    </div>
  );
};

export default StaffContainer;
