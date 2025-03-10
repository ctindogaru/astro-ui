import React, { FC, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Tabs } from 'components/Tabs';
import {
  IWizardInitialData,
  IWizardResult,
} from 'features/plugins/components/UsePluginPopup/types';
import PreviousFunctionsView from 'features/plugins/components/UsePluginPopup/components/UsePluginWizard/components/pevious-functions-view/PreviousFunctionsView';
import CreateTokenView from 'features/plugins/components/UsePluginPopup/components/UsePluginWizard/components/create-token-view/CreateTokenView';

import { WizardContext } from './helpers';

import styles from './UsePluginWizard.module.scss';

const NewFunctionView = dynamic(
  import(
    'features/plugins/components/UsePluginPopup/components/UsePluginWizard/components/new-function-view/NewFunctionView'
  ),
  {
    ssr: false,
  }
);

const TABS = [
  {
    id: 1,
    label: 'Previous functions',
    content: <PreviousFunctionsView />,
  },
  {
    id: 2,
    label: 'New function',
    content: <NewFunctionView />,
  },
];

interface UsePluginWizardProps {
  initialData: IWizardInitialData;
  onClose: () => void;
  onSubmit: (d: IWizardResult) => void;
}

export const UsePluginWizard: FC<UsePluginWizardProps> = ({
  initialData,
  onClose,
  onSubmit,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [data, setWizardData] = useState({
    nearFunction: undefined,
    tokenName: '',
    amountToMint: '',
    recipient: '',
  });

  const setData = useCallback(
    d => {
      setWizardData({
        ...data,
        ...d,
      });

      if (activeStep !== 2) {
        setActiveStep(activeStep + 1);
      } else {
        onSubmit(d);
      }
    },
    [activeStep, data, onSubmit]
  );

  return (
    <div className={styles.root}>
      <WizardContext.Provider value={{ data, setData, initialData, onClose }}>
        {activeStep === 1 && <Tabs tabs={TABS} isControlled={false} />}
        {activeStep === 2 && <CreateTokenView />}
      </WizardContext.Provider>
    </div>
  );
};
