import React from 'react';
import useTranslation from 'next-translate/useTranslation';

const withTranslation = (WrappedComponent) => {
  return (props) => {
    const { t } = useTranslation('common');
    console.log('Translation function in HOC:', t); // Logga översättningsfunktionen
    return <WrappedComponent t={t} {...props} />;
  };
};

export default withTranslation;
