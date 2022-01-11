import Button from "components/CustomButtons/Button.js";
import _ from "lodash";
import React, { Component } from "react";

class StringArrayCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: this.props.values || []
    };
  }
  componentDidMount() {}
  render() {
    let { array } = this.state;
    let { onChange } = this.props;
    return (
      <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
        {_.map(array, (item, index) => (
          <div key={index} style={{ width: "50%", padding: 10 }}>
            <input
              value={item}
              type="text"
              onChange={e => {
                let newArray = _.cloneDeep(array);
                newArray[index] = e.target.value;
                this.setState({ array: newArray }, () => {
                  onChange(this.state.array);
                });
              }}
            />
          </div>
        ))}
        <Button
          color="primary"
          onClick={() => {
            let newArray = _.cloneDeep(array);
            newArray.push("");
            this.setState({ array: newArray }, () => {
              onChange(this.state.array);
            });
          }}
        >
          Add Item
        </Button>
      </div>
    );
  }
}

export default StringArrayCreator;
