import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "components/Card/Card.js";
import CardFooter from "components/Card/CardFooter.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Button from "components/CustomButtons/Button.js";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { sendRequest } from "utills/util";
import SimpleIcon from "components/simpleIcon/simpleIcon";

class NumberComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };
  }
  getDatas() {
    let { api, queries } = this.props;
    const thenFn = res => {
      this.setState({ number: res.data, isLoading: false });
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
    let { number, isLoading } = this.state;
    let {
      tableHead,
      color,
      title,
      iconName,
      numberUnit,
      classes,
      next,
      nextLabel
    } = this.props;
    return (
      <Card>
        <CardHeader color={color || "success"} stats icon>
          <CardIcon color={color || "success"}>
            <SimpleIcon iconName={iconName} iconColor="white" />
          </CardIcon>
          <p className={classes.cardCategory}>{title}</p>
          {isLoading ? (
            <CircularProgress color={color || "warning"} />
          ) : (
            <h3 className={classes.cardTitle}>
              {number}
              <small>{numberUnit}</small>
            </h3>
          )}
        </CardHeader>
        <CardFooter stats>
          <div className={classes.stats}>
            <NavLink to={next}>
              <Button color={color || "success"}>{nextLabel}</Button>
            </NavLink>
          </div>
        </CardFooter>
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
  )(NumberComponent)
);
