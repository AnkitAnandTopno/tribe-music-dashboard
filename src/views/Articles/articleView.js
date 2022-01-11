import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { withRouter } from "react-router-dom";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Uploader from "components/CustomInput/uploader.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import Settings from "@material-ui/icons/Settings";
import { addEvent } from "modules/events/reducer.js";
import { getEvents } from "modules/events/reducer.js";
import { sendRequest } from "utills/util";
import { setEvents } from "modules/events/reducer";

import CircularProgress from "@material-ui/core/CircularProgress";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./tools";
import { getArticles } from "modules/articles/reducer";
import { addArticles } from "modules/articles/reducer";
import { recipeApi } from "constant/api";
import { setArticles } from "modules/articles/reducer";

class ArticleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {},
      isLoading: true
    };
  }

  updateArticleUp() {
    let { article } = this.state;
    let { setArticle, history } = this.props;
    console.log(article);
    this.editorInstance
      .save()
      .then(od => {
        let newArticle = _.cloneDeep(article);
        newArticle.content = od;
        newArticle.date = moment().format("YYYY-MM-DD");
        console.log(od);
        this.setState({ isLoading: true });
        const thenFn = res => {
          // setEvents({res});
          this.setState({ isLoading: false });
          setArticle(res && res.data);
          console.log(res.data);
          this.setState({
            article: {
              title: "",
              imageUrl: undefined,
              content: {},
              date: ""
            }
          });
          history.push("/admin/articles/");
        };
        const errorFn = () => {
          this.setState({ isLoading: false });
          alert("error");
        };
        sendRequest(recipeApi.updateRecipe, {
          id: newArticle._id,
          article: newArticle,
          success: { fn: thenFn },
          error: { fn: errorFn }
        });
      })
      .catch(er => {
        console.log(er);
        alert(er);
      });
  }
  componentDidMount() {
    let { match } = this.props;
    let id = match && match.params && match.params.id;

    this.setState({ isLoading: true });
    const thenFn = res => {
      let article = res && res.data;
      this.setState({ article }, () => {
        this.setState({ isLoading: false });
      });
    };
    const errorFn = () => {
      this.setState({ isLoading: false });
      alert("error");
    };
    sendRequest(recipeApi.getRecipe, {
      id,
      success: { fn: thenFn },
      error: { fn: errorFn }
    });
  }
  render() {
    let { article, isLoading } = this.state;
    return (
      <GridItem xs={12} sm={12} md={8}>
        {isLoading ? (
          <CircularProgress color="secondary" />
        ) : (
          <Card>
            <CardHeader color="info">
              <h4>Edit Article</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <CustomInput
                    labelText="Title"
                    id="title"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: e => {
                        let newArticle = _.cloneDeep(article);
                        newArticle.title = e.target.value;
                        this.setState({ article: newArticle });
                      },
                      value: article.title
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem>
                  <h5>Title Image</h5>
                  <Uploader
                    value={article.imageUrl}
                    onChange={link => {
                      let newArticle = _.cloneDeep(article);
                      newArticle.imageUrl = link;
                      this.setState({ article: newArticle });
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        )}
        {isLoading ? null : (
          <Card>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                  <h3>Content</h3>
                  <EditorJs
                    data={article.content}
                    tools={EDITOR_JS_TOOLS}
                    instanceRef={instance => (this.editorInstance = instance)}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button
                color="info"
                onClick={() => {
                  this.updateArticleUp();
                }}
              >
                Update Article
              </Button>
            </CardFooter>
          </Card>
        )}
      </GridItem>
    );
  }
}
const mapStateToProps = state => {
  return {
    articles: getArticles(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addArticle: payload => dispatch(addArticles(payload)),
    setArticle: payload => dispatch(setArticles(payload))
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArticleView)
);
