import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import GridItem from "components/Grid/GridItem.js";
import CardBody from "components/Card/CardBody.js";
import { articlesApi } from "constant/api.js";
import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { sendRequest } from "utills/util.js";

class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false
    };
  }

  toggleDelete(isDeleting) {
    this.setState({ isDeleting });
  }
  render() {
    let { isDeleting } = this.state;
    let {
      onDelete,
      item,
      headerColor,
      itemTitle,
      itemImage,
      onEdit: Edit
    } = this.props;
    return (
      <Card key={item.slug}>
        <CardHeader color={headerColor || "primary"}>
          <img src={itemImage} style={{ width: "100%", height: "100%" }} />
        </CardHeader>
        <CardBody>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h4>{itemTitle}</h4>
            {!isDeleting ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  padding: 10
                }}
              >
                <p
                  onClick={() => {
                    onDelete(isDeleting => this.toggleDelete(isDeleting));
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </p>

                {Edit ? <Edit /> : null}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  padding: 10
                }}
              >
                <CircularProgress />
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default ListCard;
