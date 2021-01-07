import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../app/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
  // const [products, setProducts] = useState([]);

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, errorMsg, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant={'danger'}>{errorMsg}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4}>
              <Product {...product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
