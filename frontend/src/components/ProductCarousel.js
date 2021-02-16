import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { getTopRatedProducts } from '../app/slices/productSlice';
import { useSelector, useDispatch } from 'react-redux';


const ProductCarousel = () => {
  const dispatch = useDispatch();

  const productsTopRated = useSelector((state) => state.productList);
  const { loading, error, errorMsg, topProducts } = productsTopRated;

  useEffect(() => {
    dispatch(getTopRatedProducts());
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{errorMsg}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
