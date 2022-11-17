import React from 'react';
import { Col, Text, Tooltip, Popover, Row, Link  } from "@nextui-org/react";
import { IconButton } from "./IconButton";
import { EditIcon } from './EditIcon';
import { EyeIcon } from './EyeIcon';
import { DeleteIcon } from './DeleteIcon';
import { DeleteRecord } from './popovers/DeleteRecord';
import { ViewRecord } from './popovers/ViewRecord';

export default ({ record, columnKey, getPasswordRecords, openEditModal, PasswordManagerSC }) => {
  const cellValue = record[columnKey];
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = React.useState(false);
  const [isViewPopoverOpen, setIsViewPopoverOpen] = React.useState(false);
  switch (columnKey) {
    case "passwordName":
      return (
        <Text size="$md">
          {cellValue}
        </Text>
      );
    case "link":
      return (
        <Col>
          <Row>
            <Text b size={14} css={{ tt: "capitalize" }}>
              {
                cellValue
                  ? (
                    <Link href={cellValue} isExternal target="_blank">
                      Open
                    </Link>
                  )
                  : '-'
              }
            </Text>
          </Row>
          {
            cellValue && (
              <Row>
                <Text b size={13} css={{ color: "$accents7" }}>
                  {record.link}
                </Text>
              </Row>
            )
          }
        </Col>
      );

    case "actions":
      return (
        <Row justify="center" align="center">
          <Col css={{ d: "flex" }}>
            <Tooltip content="View details">
              <Popover isOpen={isViewPopoverOpen} onOpenChange={setIsViewPopoverOpen}>
                <Popover.Trigger>
                  <IconButton>
                    <EyeIcon size={20} fill="#979797" />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Content>
                  <ViewRecord
                    closePopover={() => setIsViewPopoverOpen(false)}
                    record={record}
                  />
                </Popover.Content>
              </Popover>
            </Tooltip>
          </Col>
          <Col css={{ d: "flex" }}>
            <Tooltip content="Edit record">
              <IconButton onClick={() => openEditModal(record)}>
                <EditIcon size={20} fill="#979797" />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: "flex" }}>
            <Tooltip
              content="Delete record"
              color="error"
            >
              <Popover isOpen={isDeletePopoverOpen} onOpenChange={setIsDeletePopoverOpen}>
                <Popover.Trigger>
                  <IconButton>
                    <DeleteIcon size={20} fill="#FF0080" />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Content>
                  <DeleteRecord
                    closePopover={() => setIsDeletePopoverOpen(false)}
                    getPasswordRecords={getPasswordRecords}
                    index={record.index}
                    PasswordManagerSC={PasswordManagerSC}
                  />
                </Popover.Content>
              </Popover>
            </Tooltip>
          </Col>
        </Row>
      );
    default:
      return cellValue;
  }
}
