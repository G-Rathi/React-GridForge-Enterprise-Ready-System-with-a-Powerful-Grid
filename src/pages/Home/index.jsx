import React from 'react';
import { Link } from 'react-router-dom';
import SEOHelmet from '../../common/SEO/SEOHelmet';
import { Button } from '../../common-components/Button/Button';

const Home = () => {
  return (
    <>
      <SEOHelmet 
        title="Home"
        description="Welcome to our SaaS application"
        keywords="saas, application, react"
      />
      <div className="home-container">
        <h1>Welcome to Our SaaS Platform</h1>
        <p>This is our starting point for building something amazing!</p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/todos">
            <Button variant="primary" size="large">
              Go to Todos App
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;