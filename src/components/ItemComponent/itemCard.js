import React, { Component } from "react";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import colors from "assets/colors";
import { convert_to_unicode } from "utills/stringUtil";

const itemCard = ({
  name,
  altName,
  inventory,
  imageUrls,
  category,
  isFeatured,
  price,
  unit,
  discount,
  isDeletable,
  onDelete
}) => {
  return (
    <div
      style={{
        margin: 5,
        backgroundColor: colors.colorPrimary,
        display: "flex",
        borderRadius: 10,
        cursor: "pointer",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          padding: 10,
          flex: 6,
          display: "flex",
          alignItems: "center",
          height: 50
        }}
        onClick={() => onClick()}
      ></div>
      {isDeletable ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.1)"
          }}
          onClick={() => onDelete()}
        >
          <SimpleIcon iconName="mdi-close" />
        </div>
      ) : null}
    </div>
  );
};
export default ItemCard;
