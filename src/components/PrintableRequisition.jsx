import React from 'react';

function PrintableRequisition({ asset }) {
  if (!asset) return null;

  const { staffDetails, devices, signatures, submittedAt } = asset;

  return (
    <div id="printable-area" className="bg-white p-8 font-sans text-sm text-gray-800">
      <header className="text-center mb-10">
        <img src="/logo.png" alt="Logo" className="h-12 w-12 justify-center mx-auto mb-2" />
        <h1 className="text-xl font-bold uppercase">The Church of Pentecost Headquarters</h1>
        <h2 className="text-lg font-semibold uppercase">Information Management Department</h2>
        <h3 className="text-2xl font-bold uppercase mt-4 underline">Asset Requisition</h3>
      </header>

      <section className="mb-8">
        <h4 className="text-base font-bold mb-2 border-b pb-1">STAFF DETAILS</h4>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1 pr-4 font-semibold">Full Name:</td>
              <td className="py-1">{staffDetails.fullName}</td>
              <td className="py-1 pr-4 font-semibold">Staff ID:</td>
              <td className="py-1">{staffDetails.staffId}</td>
            </tr>
            <tr>
              <td className="py-1 pr-4 font-semibold">Position:</td>
              <td className="py-1">{staffDetails.position}</td>
              <td className="py-1 pr-4 font-semibold">Department:</td>
              <td className="py-1">{staffDetails.department}</td>
            </tr>
             <tr>
              <td className="py-1 pr-4 font-semibold">Date of Issue:</td>
              <td className="py-1" colSpan="3">{new Date(submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h4 className="text-base font-bold mb-2 border-b pb-1">DEVICE(S) ISSUED</h4>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-2 text-left">Device Type</th>
              <th className="border border-gray-400 p-2 text-left">Brand</th>
              <th className="border border-gray-400 p-2 text-left">Model</th>
              <th className="border border-gray-400 p-2 text-left">Serial Number</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2">{device.deviceType}</td>
                <td className="border border-gray-400 p-2">{device.brand}</td>
                <td className="border border-gray-400 p-2">{device.model}</td>
                <td className="border border-gray-400 p-2">{device.serialNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      
      <section className="mb-12">
        <h4 className="text-base font-bold mb-2 border-b pb-1">TERMS & CONDITIONS</h4>
        <p className="text-xs">
          I, {staffDetails.fullName}, acknowledge receipt of the company asset(s) listed above. I agree to take full responsibility for the proper care, maintenance, and security of these items. I will adhere to all company policies regarding their use, report any faults or damages promptly, and return the device(s) in good working condition upon employment termination or as requested by the company.
        </p>
      </section>

      <section className="flex justify-between items-end" style={{ paddingTop: '100px' }}>
        <div className="text-center w-2/5">
          {signatures.staffSignature && <img src={signatures.staffSignature} alt="Staff Signature" className="h-20 mx-auto" />}
          <div className="border-t border-gray-800 mt-2 pt-1">
            <p className="font-semibold">Staff Signature</p>
          </div>
        </div>
        <div className="text-center w-2/5">
          {signatures.adminSignature && <img src={signatures.adminSignature} alt="Admin Signature" className="h-20 mx-auto" />}
          <div className="border-t border-gray-800 mt-2 pt-1">
            <p className="font-semibold">Admin Signature</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrintableRequisition;
