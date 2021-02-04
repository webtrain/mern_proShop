import React, { useEffect, useRef, useCallback } from 'react';

const PayPalBtn = ({ amount, onSuccess }) => {
  const paypalBtnsContainer = useRef();

  const renderButtons = useCallback(() => {
    window.paypal
      ?.Buttons({
        createOrder: function (data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          // This function captures the funds from the transaction.
          return actions.order.capture().then(function (details) {
            // This function shows a transaction success message to your buyer.
            onSuccess(details);
          });
        },
      })
      .render(paypalBtnsContainer.current);
  }, [amount, onSuccess]);

  useEffect(() => {
    setTimeout(() => {
      if (!paypalBtnsContainer.current?.children?.length) {
        renderButtons();
      }
    }, 1);
  }, [renderButtons]);

  return <div ref={paypalBtnsContainer}></div>;
};

export default PayPalBtn;
