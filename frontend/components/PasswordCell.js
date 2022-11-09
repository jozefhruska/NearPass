import React from 'react';
import { Col, Text, Tooltip, User, Row, Link  } from "@nextui-org/react";
import { IconButton } from "./IconButton";
import { EditIcon } from './EditIcon';
import { EyeIcon } from './EyeIcon';
import { DeleteIcon } from './DeleteIcon';

export default ({ user, columnKey }) => {
  const cellValue = user[columnKey];
  switch (columnKey) {
    case "name":
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
                  {user.link}
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
              <IconButton onClick={() => console.log("View user", user.id)}>
                <EyeIcon size={20} fill="#979797" />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: "flex" }}>
            <Tooltip content="Edit record">
              <IconButton onClick={() => console.log("Edit record", user.id)}>
                <EditIcon size={20} fill="#979797" />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: "flex" }}>
            <Tooltip
              content="Delete"
              color="error"
              onClick={() => console.log("Delete record", user.id)}
            >
              <IconButton>
                <DeleteIcon size={20} fill="#FF0080" />
              </IconButton>
            </Tooltip>
          </Col>
        </Row>
      );
    default:
      return cellValue;
  }
}
