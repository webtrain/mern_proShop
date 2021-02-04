import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../app/slices/orderSlice';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [itemsPrice, setItemPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const cart = useSelector((state) => state.cart);
  const { products, shippingAddress, paymentMethod } = cart;

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const orderCreate = useSelector((state) => state.order);
  const { error, errorMsg, success, order } = orderCreate;

  // Calculate Prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const productsItemsPrice = addDecimals(products.reduce((acc, { price, qty }) => acc + price * qty, 0));
  const productsShippingPrice = addDecimals(productsItemsPrice > 100 ? 0 : 100);
  const productsTaxPrice = addDecimals(Number((0.15 * productsItemsPrice).toFixed(2)));
  
  const productsTotalPrice = (
    Number(productsItemsPrice) +
    Number(productsShippingPrice) +
    Number(productsTaxPrice)
  ).toFixed(2);

  useEffect(() => {
    setItemPrice(productsItemsPrice);
    setShippingPrice(productsShippingPrice);
    setTaxPrice(productsTaxPrice);
    setTotalPrice(productsTotalPrice);
  }, [history, productsItemsPrice, productsShippingPrice, productsTaxPrice, productsTotalPrice]);

  useEffect(() => {
    if (!userInfo) history.push('/login?redirect=placeorder');
  }, [userInfo, history]);

  useEffect(() => {
    if (success) history.push(`/order/${order._id}`);
  }, [history, success, order._id]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: products,
        paymentMethod,
        itemsPrice,
        shippingAddress,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {products.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {products.map((item, i) => (
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
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant="danger">{errorMsg}</Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn btn-block"
                  disabled={products.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
