import React, { Component } from "react";
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  Progress
} from "reactstrap";
import { connect } from "react-redux";
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "components/CustomButtons/Button.js";
import SimpleIcon from "components/simpleIcon/simpleIcon.js";
import SelectorInput from "components/CustomInput/selectorInput.js";
import { sendRequest } from "utills/util";
import { itemApi } from "constant/api";

class AddSongForm extends Component {
  constructor(props) {
    super(props);
    let {
      hindi,
      newNum,
      oldNum,
      songName,
      lyrics,
      songUrl,
      songKey
    } = this.props;
    this.state = {
      hindi,
      newNum,
      oldNum,
      songName,
      lyrics,
      songUrl,
      songKey
    };
  }
  submit = () => {
    let checkState = _.cloneDeep(this.state);
    checkState = _.omit(checkState, [
      "hindi",
      "isUploading",
      "upLoaderPercentage"
    ]);
    let isNotEmpty =
      this.state.newNum &&
      this.state.songName &&
      this.state.newNum !== "" &&
      this.state.songName !== "";
    var regex = /([S|M|K|B|Sa|E]\s)?[0-9]+/;
    var trueNum =
      this.state.newNum &&
      this.state.newNum.match(regex) &&
      this.state.newNum.match(regex).length > 0
        ? this.state.newNum.match(regex)[0]
        : undefined;

    if (isNotEmpty) {
      if (trueNum === this.state.newNum) {
        if (this.props._id) {
          console.log(this.state);
          this.setState({ isLoading: true });
          let newSong = _.omit(_.cloneDeep(this.state), [
            "isLoading",
            "isUploading",
            "upLoaderPercentage"
          ]);
          const thenFn = result => {
            console.log(result);
            checkState = _.mapValues(checkState, o => {
              return "";
            });
            checkState.lyrics = [{ value: "", count: 1 }];
            this.setState(_.assign({}, this.state, checkState));
            this.setState({ isLoading: false }, () => {
              this.props.updateSong(result.data);
            });
          };
          const errorFn = () => {
            this.setState({ isLoading: false });
          };
          sendRequest(itemApi.updateSong, {
            id: this.props._id,
            song: newSong,
            success: { fn: thenFn },
            error: { fn: errorFn }
          });
        }
      } else {
        alert("New song number is invalid. Example- 'E 123' or '123'");
      }
    } else {
      alert("New song number or song name should not be left empty.");
    }
  };
  addLyricsSegment() {
    let newLyrics = this.state.lyrics;
    newLyrics.push({
      value: "",
      count: 1
    });
    this.setState({
      lyrics: newLyrics
    });
  }
  deleteLyricsSegment(index) {
    let newLyrics = this.state.lyrics;
    newLyrics = _.filter(
      newLyrics,
      (item, indexSegment) => index != indexSegment
    );
    this.setState({
      lyrics: newLyrics
    });
  }
  render() {
    const { lyrics, songUrl, hindi, isLoading } = this.state;
    return isLoading ? (
      <CircularProgress color="secondary" />
    ) : (
      <div
        style={{
          background: "#fff",
          padding: 10
        }}
      >
        <Form>
          <FormGroup
            check
            onChange={e => {
              this.setState({ hindi: e.target.value === "hindi" });
            }}
          >
            <FormGroup>
              <Label check>
                <Input
                  checked={!hindi}
                  type="radio"
                  name="language"
                  value="english"
                />{" "}
                English
              </Label>
            </FormGroup>
            <FormGroup>
              <Label check>
                <Input
                  checked={hindi}
                  type="radio"
                  name="language"
                  value="hindi"
                />{" "}
                Hindi
              </Label>
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Row>
              <Col>
                <Label>New No.</Label>
                <Input
                  type="text"
                  name="newNo"
                  placeholder="New Song Number"
                  onChange={e => {
                    this.setState({ newNum: e.target.value });
                  }}
                  value={this.state.newNum}
                />
              </Col>
              <Col>
                <Label>Old No.</Label>
                <Input
                  type="text"
                  name="oldNo"
                  placeholder="Old Song Number"
                  onChange={e => {
                    this.setState({ oldNum: e.target.value });
                  }}
                  value={this.state.oldNum}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Label>Song Name</Label>
            <Input
              type="text"
              name="songName"
              placeholder="Song Name"
              value={this.state.songName}
              style={{ fontFamily: this.state.hindi ? "hindi" : "arial" }}
              onChange={e => {
                this.setState({
                  songName: e.target.value
                });
              }}
            />
          </FormGroup>
          <FormGroup>
            <SelectorInput
              label="Key"
              options={[
                { value: "C", name: "C" },
                { value: "C min", name: "C min" },
                { value: "C#", name: "C#" },
                { value: "C# min", name: "C# min" },
                { value: "D", name: "D" },
                { value: "D min", name: "D min" },
                { value: "D#", name: "D#" },
                { value: "D# min", name: "D# min" },
                { value: "E", name: "E" },
                { value: "E min", name: "E min" },
                { value: "F", name: "F" },
                { value: "F min", name: "F min" },
                { value: "F#", name: "F#" },
                { value: "F# min", name: "F# min" },
                { value: "G", name: "G" },
                { value: "G min", name: "G min" },
                { value: "G#", name: "G#" },
                { value: "G# min", name: "G# min" },
                { value: "A", name: "A" },
                { value: "A min", name: "A min" },
                { value: "A#", name: "A#" },
                { value: "A# min", name: "A# min" },
                { value: "B", name: "B" },
                { value: "B min", name: "B min" }
              ]}
              onChange={value => {
                this.setState({ songKey: value });
              }}
              value={this.state.songKey}
            />
          </FormGroup>
          <FormGroup>
            <Label>Lyrics</Label>
            {_.map(lyrics, (item, index) => (
              <div
                key={"key" + index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  padding: 10
                }}
              >
                <Input
                  type="textarea"
                  name="lyrics"
                  value={item.value}
                  style={{
                    height: 100,
                    fontFamily: this.state.hindi ? "hindi" : "arial"
                  }}
                  onChange={e => {
                    let newLyrics = this.state.lyrics;
                    newLyrics[index].value = e.target.value;
                    this.setState({
                      lyrics: newLyrics
                    });
                  }}
                />
                <span>X</span>
                <Input
                  type="number"
                  name="lyricsCount"
                  value={item.count}
                  onChange={e => {
                    let newLyrics = this.state.lyrics;
                    newLyrics[index].count = e.target.value;
                    this.setState({
                      lyrics: newLyrics
                    });
                  }}
                  style={{ width: 50 }}
                  defaultValue={"1"}
                />
              </div>
            ))}
            <div
              onClick={() => {
                this.addLyricsSegment();
              }}
              style={{
                padding: 5,
                border: "1px solid #333",
                borderRadius: 2,
                width: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              +
            </div>
          </FormGroup>

          <div>
            <span>Upload songs below</span>
          </div>
          <div>
            <Button color={"primary"} onClick={() => this.submit()}>
              Update Song
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSongForm);
