import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { bibleStudyApi } from "constant/api";
import _ from "lodash";
import {
  addBibleStudy,
  getBibleStudy,
  setBibleStudy
} from "modules/bibleStudy/reducer";
import React, { Component } from "react";
import { connect } from "react-redux";
import { sendRequest } from "utills/util";
import { withRouter } from "react-router-dom";

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };
  }
  getDatas() {
    let { api, queries } = this.props;
    const thenFn = res => {
      let tableData = _.map(res.data, (item, index) => [
        index + 1,
        item.message
      ]);
      this.setState({ tableData, isLoading: false });
    };
    const errorFn = () => {
      this.setState({ isLoading: false });
    };
    sendRequest(api, {
      ...queries,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  componentDidMount() {
    this.getDatas();
  }
  render() {
    let { tableData, isLoading } = this.state;
    let { tableHead, color, title, subTitle, classes } = this.props;
    return (
      <Card>
        <CardHeader color={color || "warning"}>
          <h4 className={classes.cardTitleWhite}>{title}</h4>
          <p className={classes.cardCategoryWhite}>{subTitle}</p>
        </CardHeader>
        {isLoading ? (
          <CircularProgress color={color || "warning"} />
        ) : (
          <CardBody>
            <Table
              tableHeaderColor={color || "warning"}
              tableHead={tableHead || []}
              tableData={tableData}
            />
          </CardBody>
        )}
      </Card>
    );
  }
}
const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TableComponent)
);
