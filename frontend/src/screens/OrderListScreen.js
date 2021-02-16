import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrders } from '../app/slices/orderSlice';

const OrderListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  const orderList = useSelector((state) => state.order);
  const { loading, error, errorMsg, orders } = orderList;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    } else {
        dispatch(getOrders());
      }
    
  }, [dispatch, history, userInfo]);

 

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Orders</h1>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{errorMsg}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm product-list">
          <thead>
            <tr>
              <th>ID</th>
              <th>CREATED</th>
              <th>PAID</th>
              <th>DELIVERED</th>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'Not paid'}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'Not delivered'}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="warning" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
