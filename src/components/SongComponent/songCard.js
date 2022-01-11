import React, { Component } from "react";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import colors from "assets/colors";
import { convert_to_unicode } from "utills/stringUtil";

const SongCard = ({
  title,
  thumbnail,
  songUrl,
  onDelete,
  onClick,
  onPlay,
  isPlaying,
  isDeletable
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
          flexDirection: "column"
        }}
        onClick={() => onClick()}
      >
      <img style={{width: 100, height: 100}} src={thumbnail}/>
        <span style={{ textOverflow: "ellipsis", wordWrap: "break-word", color: "white" }}>
          {title}
        </span>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.1)"
          }}
          onClick={() => onPlay()}
        >
          <SimpleIcon iconName={isPlaying?"mdi-pause-circle-outline":"mdi-play-circle-outline"} />
        </div>
      </div>
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
export default SongCard;
