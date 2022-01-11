import CircularProgress from "@material-ui/core/CircularProgress";
import { offerApi } from "constant/api";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Cookies from "universal-cookie";
import { sendRequest } from "utills/util";
import Button from "components/CustomButtons/Button.js";
import _ from "lodash";

const cookies = new Cookies();

class OfferListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offers: []
    };
  }
  fetchOffer() {
    this.setState({ isLoading: true });
    sendRequest(offerApi.getOffer, {
      success: {
        fn: res => {
          this.setState({ isLoading: false });
          console.log(res);
          this.setState({
            offers: res.data || []
          });
        }
      },
      error: {
        fn: error => {
          this.setState({ isLoading: false });
          console.log(error);
        }
      }
    });
  }
  componentDidMount() {
    this.fetchOffer();
  }
  render() {
    let { offers, isLoading } = this.state;
    let { history } = this.props;
    return (
      <div>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <div>
            {_.map(offers, (item, name) => {
              return (
                <div key={item.slug} style={{ padding: 10, width: 400 }}>
                  <div
                    onClick={() => {
                      history.push(`/admin/editOffer/${item._id}`);
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundImage: `linear-gradient(to bottom right, ${item.cardColor1}, ${item.cardColor2})`,
                      borderRadius: 20,
                      overflow: "hidden",
                      display: "flex"
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: "300px 300px"
                      }}
                    ></div>
                    <div
                      style={{
                        flex: 4,
                        color: "white",
                        padding: 10,
                        borderRight: "1px dashed rgba(255,255,255,0.3)"
                      }}
                    >
                      <h3>{item.title}</h3>
                      <h4>{`${item.type === "discount" ? "" : "₹"}${
                        item.offerValue
                      }${item.type === "discount" ? "% OFF" : " Cashback"} on ${
                        item.category
                      } items.`}</h4>
                    </div>
                    <div
                      style={{
                        flex: 3,
                        color: "white",
                        padding: 10,
                        textAlign: "center",
                        backgroundColor: "rgba(0,0,0, 0.05)"
                      }}
                    >
                      <h4>Apply</h4>
                      <h4>Coupon Code</h4>
                      <h3>
                        <b>{item.couponCode}</b>
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Button
          color="primary"
          onClick={() => {
            history.push("/admin/addOffer");
          }}
        >
          Add Offer
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {};
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OfferListComponent)
);
