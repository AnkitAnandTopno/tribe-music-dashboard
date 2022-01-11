import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader";
import Button from "components/CustomButtons/Button";
import SimpleIcon from "components/simpleIcon/simpleIcon";
import React from "react";

const Modal = ({
  isVisible,
headerTitle,
children,
onSuccess,
isSuccessButtonActive,
successLabel,
onClose,
isCancelButtonActive,
cancelLabel
}) => {
  return !isVisible?null:(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
    <div style={{padding: 20, backgroundColor: "white", width: "fit-content", borderRadius: 10}}>
    <CardHeader>
    <div style={{ display: "flex", flexDirection:"row"}}>
    <div style={{flex: 3}}>
    <h2>{headerTitle}</h2>
    </div>
    <div style={{flex:1}}>
      <Button onClick={()=>{onClose();}} color="danger"><SimpleIcon iconName="mdi-close" iconSize={10}/></Button>
    </div>
    </div></CardHeader>
      {children}
      <CardFooter>
      <div style={{ display: "flex", flexDirection:"row"}}>
      <div style={{flex: 2, display: "flex"}}>
      </div>
      <div style={{flex:1, display: "flex"}}>
        <Button onClick={()=>{onClose();}} disabled={isCancelButtonActive} color="danger"><div style={{display: "flex", alignItems:"center", justifyContent: "center"}}><span>{cancelLabel?cancelLabel:"Cancel"}</span></div></Button>
      </div>
      <div style={{flex:1, display: "flex"}}>
        <Button onClick={()=>{onSuccess();}} disabled={isSuccessButtonActive} color="success"><div style={{display: "flex", alignItems:"center", justifyContent: "center"}}><span>{successLabel?successLabel:"OK"}</span></div></Button>
      </div>
      </div>
      </CardFooter>
    </div>
          </div>
  );
};
export default Modal;
