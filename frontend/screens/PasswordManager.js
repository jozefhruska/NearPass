import React from 'react';
import { Container } from '@nextui-org/react';
import { AddRecord } from '../components/modals/AddRecord';
import { decryptAndSetRecords, getPasswordRecords as getPasswordRecordsWithArgs } from '../helpers/encryption';
import PasswordRecordsTable from '../components/PasswordRecordsTable';

export default ({
  closeKeyPhraseModal,
  PasswordManagerSC,
  keyPhrase,
  wallet,
  isAddRecordModalOpen,
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
  }, [triggerDecrypting])
  return (
    <Container md>
      <PasswordRecordsTable
        setActiveRecord={setActiveRecord}
        setIsAddRecordModalOpen={setIsAddRecordModalOpen}
        PasswordManagerSC={PasswordManagerSC}
        getPasswordRecords={getPasswordRecords}
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
