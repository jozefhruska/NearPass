import React from 'react';
import { Container } from '@nextui-org/react';
import { AddRecord } from '../components/modals/AddRecord';
import { decryptAndSetRecords, getPasswordRecords as getPasswordRecordsWithArgs } from '../helpers/encryption';
import PasswordRecordsTable from '../components/PasswordRecordsTable';
import { getTotalAccountBalanceSanitized, sanitizeYoctoNear } from '../helpers/near';

export default ({
  closeKeyPhraseModal,
  PasswordManagerSC,
  keyPhrase,
  wallet,
  hasEnoughFunds,
  isAddRecordModalOpen,
  setHasEnoughFunds,
  setIsNotEnoughNearModalOpen,
  setTriggerDecrypting,
  setIsIncorrectPassPhrase,
  setIsAddRecordModalOpen,
  setIsDecrypting,
  triggerDecrypting,
}) => {
  const [contractResponse, setContractResponse] = React.useState([]);
  const [decryptedContractResponse, setDecryptedContractResponse] = React.useState([]);
  const [activeRecord, setActiveRecord] = React.useState(null);
  const getPasswordRecords = () => getPasswordRecordsWithArgs({
    PasswordManagerSC,
    setContractResponse,
    keyPhrase,
    setIsDecrypting,
    setIsIncorrectPassPhrase,
    setDecryptedContractResponse,
    closeKeyPhraseModal,
    wallet,
  });
  React.useEffect(() => {
    getPasswordRecords();
    // Needs to be here so it is executed once user logs in
    getTotalAccountBalanceSanitized(wallet).then(balance => {
      if (balance > 0) {
        setHasEnoughFunds(true)
      }
    });
  }, []);
  React.useEffect(() => {
    if (contractResponse.length && triggerDecrypting) {
      decryptAndSetRecords({
        keyPhrase,
        setIsDecrypting,
        setIsIncorrectPassPhrase,
        setDecryptedContractResponse,
        closeKeyPhraseModal,
        wallet,
        passwordRecords: contractResponse,
      }).then(() => setTriggerDecrypting(false))
    }
    // If there are no entries stored yet, let user enter with the new passphrase
    if (triggerDecrypting && !contractResponse.length) {
      closeKeyPhraseModal();
    }
  }, [triggerDecrypting])
  return (
    <Container md>
      <PasswordRecordsTable
        hasEnoughFunds={hasEnoughFunds}
        setIsNotEnoughNearModalOpen={setIsNotEnoughNearModalOpen}
        PasswordManagerSC={PasswordManagerSC}
        getPasswordRecords={getPasswordRecords}
        setActiveRecord={hasEnoughFunds ? setActiveRecord : () => {}}
        setIsAddRecordModalOpen={hasEnoughFunds ? setIsAddRecordModalOpen : setIsNotEnoughNearModalOpen}
        records={decryptedContractResponse}
      />
      { isAddRecordModalOpen &&
        <AddRecord
          PasswordManagerSC={PasswordManagerSC}
          setIsOpen={(value) => {
            // If value is false (modal is closing), reset active record
            if (!value) {
              setActiveRecord(null)
              setIsAddRecordModalOpen(value)
            }
          }}
          getPasswordRecords={getPasswordRecords}
          isOpen={isAddRecordModalOpen}
          keyPhrase={keyPhrase}
          editingRecord={activeRecord}
          wallet={wallet}
        />
      }
    </Container>
  )
}
