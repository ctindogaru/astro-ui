import cn from 'classnames';
import get from 'lodash/get';
import { useFormContext } from 'react-hook-form';
import React, { VFC, useRef, ReactNode } from 'react';

import { InputFormWrapper } from 'components/inputs/input-form-wrapper/InputFormWrapper';

import styles from './DaoNameInputSection.module.scss';

interface DaoNameInputSectionProps {
  label: ReactNode;
  className?: string;
  labelClassName?: string;
  component: JSX.Element;
}

export const DaoNameInputSection: VFC<DaoNameInputSectionProps> = props => {
  const { label, component, className, labelClassName } = props;

  const {
    formState: { errors },
  } = useFormContext();

  const errorEl = useRef(null);

  function hasError() {
    const name = component?.props?.name;
    const error = get(errors, name);

    return !!error;
  }

  const labClassName = cn(styles.label, labelClassName, {
    [styles.hasError]: hasError(),
  });

  return (
    <section className={className}>
      <div className={styles.labelContainer}>
        <div className={labClassName}>{label}:</div>
        &nbsp;
        <div ref={errorEl} />
      </div>

      <InputFormWrapper
        errors={errors}
        errorElRef={errorEl}
        errorClassName={styles.error}
        component={component}
      />
    </section>
  );
};
