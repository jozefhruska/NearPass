import React from 'react';
import { Table, Button } from '@nextui-org/react';
import PasswordCell from './PasswordCell';

export default ({
  records,
  setActiveRecord,
  setIsAddRecordModalOpen,
  PasswordManagerSC,
  getPasswordRecords,
}) => {
  const columns = [
    { name: "PASSWORD NAME", uid: "passwordName" },
    { name: "WEBSITE", uid: "link" },
    { name: "ACTIONS", uid: "actions" },
  ]
  return (
    <Table
      aria-label="Password overview table"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
      selectionMode="none"
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            hideHeader={column.uid === "actions"}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body>
        {
          records.map((record, index) => (
            <Table.Row key={index}>
              {(columnKey) => (
                <Table.Cell>
                  <PasswordCell
                    record={record}
                    columnKey={columnKey}
                    openEditModal={(record) => {
                      setActiveRecord(record)
                      setIsAddRecordModalOpen(true)
                    }}
                    PasswordManagerSC={PasswordManagerSC}
                    getPasswordRecords={getPasswordRecords}
                  />
                </Table.Cell>
              )}
            </Table.Row>
          ))
        }
        { !records.length &&
          <Table.Row>
            <Table.Cell>
              <Button light color="primary" auto onPress={() => setIsAddRecordModalOpen(true)}>
                Start by adding your first password here.
              </Button>
            </Table.Cell>
            <Table.Cell/>
            <Table.Cell/>
          </Table.Row>
        }
      </Table.Body>
    </Table>
  )
}
