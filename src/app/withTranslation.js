import React from 'react';
import useTranslation from 'next-translate/useTranslation';

const withTranslation = (WrappedComponent) => {
  const ComponentWithTranslation = (props) => {
    const { t } = useTranslation('common');
    return <WrappedComponent t={t} {...props} />;
  };

  ComponentWithTranslation.displayName = `withTranslation(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithTranslation;
};

export default withTranslation;
