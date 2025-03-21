import React, { FC } from 'react';
import cn from 'classnames';
import { useFormContext } from 'react-hook-form';

import { Input } from 'components/inputs/input/Input';
import { DropdownSelect } from 'components/inputs/select/DropdownSelect';
import { Icon } from 'components/Icon';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';
import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { useNearPrice } from 'hooks/useNearPrice';
import { formatCurrency } from 'utils/formatCurrency';
import { useCustomTokensContext } from 'astro_2.0/features/CustomTokens/CustomTokensContext';

import styles from './TransferContent.module.scss';

export const TransferContent: FC = () => {
  const { register, setValue, getValues, watch } = useFormContext();
  const { tokens } = useCustomTokensContext();
  const amount = watch('amount');
  let amountWidth;

  if (amount?.length <= 6) {
    amountWidth = 7;
  } else if (amount?.length >= 15) {
    amountWidth = 15;
  } else {
    amountWidth = amount?.length ?? 5;
  }

  const nearPrice = useNearPrice();

  const nearToUsd = (tokenBalance: string) => {
    return formatCurrency(parseFloat(tokenBalance) * nearPrice);
  };

  const tokenOptions = Object.values(tokens).map(token => ({
    label: token.symbol,
    component: (
      <div className={styles.row}>
        <div className={styles.iconWrapper}>
          {token.symbol === 'NEAR' ? (
            <Icon name="tokenNearBig" />
          ) : (
            <div
              className={styles.icon}
              style={{
                backgroundImage: `url(${token.icon})`,
              }}
            />
          )}
        </div>
        <div className={styles.symbol}>{token.symbol}</div>
        <div className={styles.balance}>
          <span
            className={cn({
              [styles.balanceNear]: token.symbol === 'NEAR',
            })}
          >
            {token.balance}
          </span>
          {token.symbol === 'NEAR' && (
            <span className={styles.balanceUsd}>
              &#8776;&nbsp;{nearToUsd(token.balance)}&nbsp;USD
            </span>
          )}
        </div>
      </div>
    ),
  }));

  const selectedTokenData = tokens[getValues().selectedToken];

  return (
    <div className={styles.root}>
      <InputWrapper fieldName="amount" label="Amount">
        <Input
          className={cn(styles.inputWrapper, styles.narrow)}
          inputStyles={{ width: `${amountWidth}ch`, paddingRight: 4 }}
          type="number"
          min={0}
          placeholder="00.0000"
          isBorderless
          size="block"
          {...register('amount')}
        />
      </InputWrapper>
      {Object.values(tokens).length ? (
        <DropdownSelect
          className={styles.select}
          options={tokenOptions}
          label="&nbsp;"
          {...register('token')}
          onChange={v => {
            setValue('token', v, {
              shouldDirty: true,
            });
          }}
          defaultValue={selectedTokenData?.symbol ?? 'NEAR'}
        />
      ) : (
        <div className={styles.loaderWrapper}>
          <LoadingIndicator />
        </div>
      )}
      <InputWrapper fieldName="target" label="Target" flex>
        <Input
          className={cn(styles.inputWrapper, styles.wide)}
          placeholder="Specify target account"
          isBorderless
          size="block"
          {...register('target')}
        />
      </InputWrapper>
    </div>
  );
};
