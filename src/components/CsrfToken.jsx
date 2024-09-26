import { useState, useEffect } from 'react';

const useCsrfToken = (setCsrfToken) => {
  const [csrfToken, setInternalCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('https://chatify-api.up.railway.app/csrf', {
          method: 'PATCH',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token');
        }

        const data = await response.json();
        console.log('CSRF Token fetched:', data.csrfToken);

        setCsrfToken(data.csrfToken);
        setInternalCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      
      }
    };

    fetchCsrfToken();
  }, [setCsrfToken]);

  return csrfToken;
};


const CsrfToken = ({ setCsrfToken }) => {
  useCsrfToken(setCsrfToken);

  return null;
};

export default CsrfToken;