import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import SongCard from "components/SongComponent/songCard";
import SongPreview from "components/SongComponent/songPreview";
import Button from "components/CustomButtons/Button.js";

class AddItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      lastScrollY: 0,
      isModal: false,
      activeSong: {}
    };
  }
  toggleModal() {
    this.setState(prevState => ({
      activeSong: {}
    }));
  }
  submit() {}
  componentDidMount() {}
  render() {
    let { onSubmit } = this.props;
    return (
      <div style={{ width: "100%" }}>
        <Button color={"primary"} onClick={() => onSubmit()}>
          Send To App
        </Button>
        {_.map(this.props.songList, (item, index) => (
          <div>
            <SongCard
              hindi={item.hindi}
              songName={item.songName}
              newNo={item.newNum}
              oldNo={item.oldNum}
              onDelete={() => this.props.onDelete(index)}
              onClick={() => {
                this.setState({ activeSong: item });
                // this.toggleModal();
              }}
            />
            <SongPreview
              toggle={() => this.toggleModal()}
              isModal={this.state.activeSong.songName === item.songName}
              {...item}
            />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    songList: ownProps.songList
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddItemList);
