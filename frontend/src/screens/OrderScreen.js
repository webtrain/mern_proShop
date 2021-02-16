import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../app/slices/orderSlice';
import PayPalBtn from '../components/payPalButton';

const OrderScreen = ({ history, match }) => {
  const dispatch = useDispatch();
  const orderId = match.params.id;

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const orderDetails = useSelector((state) => state.order);
  const { loading, error, errorMsg, order, finalOrder } = orderDetails;
  const { orderItems } = finalOrder;

  const orderPay = useSelector((state) => state.order);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.order);
  const { success: successDeliver } = orderDeliver;

  const [sdkReady, setSdkReady] = useState(false);

  // Calculate Prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  useEffect(() => {
    if (!userInfo) history.push('/login?redirect=placeorder');

    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      // Create paypal script "<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>"
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.id = 'paypal-script';
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPaypalScript();
    } else {
      !sdkReady && setSdkReady(true);
    }

    if (finalOrder.isPaid || successPay || successDeliver) {
      dispatch(getOrderDetails(orderId));
    }
  }, [userInfo, orderId, history, dispatch, successPay, sdkReady]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{errorMsg}</Message>
  ) : (
    <>
      <h3>Order - {orderId}</h3>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {userInfo && userInfo.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${userInfo && userInfo.email}`}>{userInfo && userInfo.email}</a>
              </p>

              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {finalOrder.isDelivered ? (
                <Message variant="success">Delivered at {finalOrder.deliveredAt}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {finalOrder.isPaid ? (
                <Message variant="success">Paid on {finalOrder.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, i) => (
                    <ListGroup.Item key={i}>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${addDecimals(orderItems?.reduce((acc, { price, qty }) => acc + price * qty, 0))}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${finalOrder.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${finalOrder.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${finalOrder.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!finalOrder.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalBtn amount={finalOrder.totalPrice} onSuccess={successPaymentHandler} />
                  )}
                </ListGroup.Item>
              )}

              {userInfo.isAdmin && finalOrder.isPaid && !finalOrder.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" className="btn btn-block" onClick={deliverHandler}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>

          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
