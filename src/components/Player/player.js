import React, { Component, useRef, useState } from "react";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import colors from "assets/colors";
import { convert_to_unicode } from "utills/stringUtil";

const Player = ({
    albumArtKey,
    songNameKey,
    songUrlKey,
    songItem,
  onInitialized,
  onPlay,
  isPlaying
}) => {
    let song = songItem||{};
    
    let audioRef = useRef();
    onInitialized(audioRef);
  return (
    <div
      style={{
        margin: 5,
        backgroundColor: colors.colorPrimary,
        display: "flex",
        borderRadius: 10,
        overflow: "hidden"
      }}
    >
      <div
        style={{
          padding: 10,
          flex: 6,
          display: "flex",
          alignItems: "center",
          flexDirection: "row"
        }}
      >
      <img style={{width: 50, height: 50}} src={song[albumArtKey]||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAS1BMVEW1tbX///+2trbR0dGvr6/MzMyysrL7+/v19fXX19e/v7/i4uKpqamenp7BwcGioqLs7OyYmJjn5+eLi4vU1NTHx8eFhYWQkJDw8PA11woWAAADG0lEQVR4nO3c23aqMBSF4STGgALiier7P+kGD+1Wi1ddaznXmP9NB72J30gAibYheS+k4DsK8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aPw7yuX9MZTF25WU4PegNrCcoxT+6w2orpwcRHW7oVxrTailbBRm0Qrod4kmglrrRuGmTA2SkQ7YTzqnIqGwnhUmUVLYVxpEE2FKueirTBug7jRWBirtTTRWhirQZhoLoxxKUv8AKEw0U5Y/xBFF6qdcEj/XW4ER7QTLtt++33TEJxEQ2FO3fJ+sJAjWgpDatf3k9KpMKR8Pxk3YiPaCsfj2yzKvQm3FoZ83V6sW6kRzYWhXG+MnoXX34g98NsLQ/E+hyFvvQtLMx32Uq/jU4TVzruw8TyH+TweDa1nYTUeiS3STxBO79vOnoVleoRaiy3STxDuJa+knyAM42l47BwLL4u0c7qLcf3NOIUrwUVqLxwf8vcHn7uJd2G/+8qSr8FcGFJJoi/BXigdhX+dV+Ht+5Z5/OFSWMKw2tZj52YZHApLaqr4XXX2Jhx98fecCMtQzQCdCMtyzhfj4EFYhnlgFP+ayS1R4foNUPDztMckhWX7Tig27FOSws07YJTbmXlMUDhtwLzp5EA4e6OYagS3Zh4SFL69zsRW68v6VsJGa5FKCtMbYHXy8PcWuZ4XdmIfNb0keaU5zgJ7ye3Dp0Tv+DMX0/NO6zo6JSr8/Vqz+NJbokH6nXd6ncV9fxDdHn1J+Ompf3r+bdpxAnX3voSfgFPXr+7zWO03p4O2T34XI5Xu1Oe0Trk7HLqs7tPYiUqp5Lbv21ySgU9pvzRdkh/n98GV97z1oxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxA/CvGjED8K8aMQPwrxoxC/dPunFY77B+gCGJm/tIG1AAAAAElFTkSuQmCC"}/>
        <span style={{ textOverflow: "ellipsis", wordWrap: "break-word", color: "white" }}>
          {songNameKey?song[songNameKey]:""}
        </span>
        <div>
        {!song?null:<div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "rgba(255,255,255,0.1)"
          }}
          onClick={() => {
            if(!isPlaying){
                onPlay(false);
                audioRef.current.pause();
            }
            else{
                onPlay(true);
                audioRef.current.play()
            }
        }}
        >
          <SimpleIcon iconColor="white" iconName={isPlaying?"mdi-pause":"mdi-play"} iconSize={15} />
        </div>}
          <audio ref={audioRef} src={song[songUrlKey]}/>
        </div>
      </div>
      
    </div>
  );
};
export default Player;
