import React, { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useWizardContext } from 'features/plugins/components/UsePluginPopup/components/UsePluginWizard/helpers';
import { NearFunction } from 'features/plugins/components/UsePluginPopup/types';
import { Select } from 'components/inputs/select/Select';
import { Button } from 'components/button/Button';

import styles from './previous-functions-view.module.scss';

interface IForm {
  functionName: string;
}

const schema = yup.object().shape({
  functionName: yup.string().required(),
});

const PreviousFunctionsView: FC = () => {
  const { setData, initialData, onClose } = useWizardContext();
  const { register, handleSubmit, setValue } = useForm<IForm>({
    resolver: yupResolver(schema),
  });

  const options = initialData.functions.map((item: NearFunction) => ({
    label: item.functionName,
    value: item.id,
  }));

  const onSubmit: SubmitHandler<IForm> = d => {
    const func = initialData.functions.find(
      (item: NearFunction) => item.functionName === d.functionName
    );

    setData({
      nearFunction: {
        id: func?.id,
        functionName: func?.functionName,
        code: func?.code,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.root}>
      <Select
        placeholder=""
        size="block"
        label="Token"
        options={options}
        {...register('functionName')}
        onChange={v => {
          setValue(
            'functionName',
            options.find(
              (item: { label: string; value: string }) => item.value === v
            )?.label ?? '',
            {
              shouldDirty: true,
            }
          );
        }}
      />
      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={onClose}
          size="small"
          className={styles.mr8}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          size="small"
          className={styles.ml8}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default PreviousFunctionsView;
