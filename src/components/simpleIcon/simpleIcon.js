import React from "react";

class SimpleIcon extends React.Component {
  render() {
    return (
      <div
        onClick={e => {
          this.props.onClick(e);
        }}
        style={{
          fontSize: this.props.iconSize,
          color: this.props.iconColor,
          margin: 0,
          border: 0,
          width: this.props.iconSize * 2,
          height: this.props.iconSize * 2,
          borderRadius: this.props.iconSize,
          lineHeight: this.props.iconSize * 2 + "px",
          textAlign: "center",
          cursor: "pointer"
        }}
      >
        <span className={"mdi " + this.props.iconName} />
      </div>
    );
  }
}

SimpleIcon.defaultProps = {
  iconBackgroundColor: "transparent",
  iconColor: "#fff",
  iconName: "mdi-file-question",
  iconSize: 20,
  onClick: () => {}
};
export default SimpleIcon;
