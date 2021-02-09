import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUser, userUpdateReset } from '../app/slices/userSlice';
import FormContainer from '../components/FormContainer';

const UserEditScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userDetail = useSelector((state) => state.user);
  const { loading, error, errorMsg, userDetails } = userDetail;

  const userUpdate = useSelector((state) => state.user);
  const { success: successUpdate } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch(userUpdateReset());
      history.push('/admin/users');
    } else {
      if (!userDetails.name || userDetails._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(userDetails.name);
        setEmail(userDetails.email);
        setIsAdmin(userDetails.isAdmin);
      }
    }
  }, [dispatch, userId, successUpdate, userDetails, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Row className="edit-page">
        <Link to="/admin/userList">
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
          Go back
        </Link>
      </Row>

      <FormContainer>
        <h1>Edit User</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{errorMsg}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
