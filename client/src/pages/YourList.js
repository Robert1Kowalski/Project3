import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import CompBtn from "../components/CompBtn";
import AddBtn from "../components/AddBtn";
import { Jumbotron } from "reactstrap";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Card, CardImg, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';
import "./YourList.css";

class YourList extends Component {
    state = {
        bucketList: [],
        onBList: [],
        completedItems: [],
        incompleteItems: [],
        notRecommended: [],
        activity: "",
        author: "",
        description: "",
        image: "https://thumbs.dreamstime.com/z/no-user-profile-picture-24185395.jpg",
        modal: false,
        currentAuthor: "",
        userID: ""
    };

    componentDidMount() {
        console.log("component did mount");
        console.log(this.props);
        this.toggle = this.toggle.bind(this);
        API.isLoggedIn()
            .then(user => {
                if (user.data.loggedIn) {
                    this.setState(
                        {
                            loggedIn: true,
                            user: user.data.user
                        },
                        () => {
                            this.loadBuckets();
                        }
                    );
                }
            })
            .catch(err => {
                console.log(err);
            });
        // push completed and incomplete items to respective arrays
    }
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    loadBuckets = () => {
        API.getUserBucket(this.state.user._id)
            .then(res => {
                const completedItems = res.data.bucketArray.filter(
                    listItem => listItem.completed
                );
                const incompleteItems = res.data.bucketArray
                    .filter(listItem => !listItem.completed)
                    .reverse();

                // const completedItems = res.data.bucketArray.filter(listItem => listItem.completed && listItem.onBlist && listItem.recommended);
                // const incompleteItems = res.data.bucketArray.filter(listItem => !listItem.completed && listItem.onBlist && listItem.recommended).reverse();
                // const notRecommended = res.data.filter(listItem => !listItem.recommended);

                this.setState({
                    userID: res.data._id,
                    currentAuthor: res.data.username,
                    completedItems,
                    incompleteItems,
                    bucketList: res.data.bucketArray,
                    // image: "",
                    description: "",
                    activity: ""
                });
            })
            .catch(err => console.log(err));
    };

    addBucket(id) {
        console.log("add id =" + id);
    }

    deleteBucket(id) {
        console.log("id = " + id);
        API.deleteBucket(id)
            .then(res => this.loadBuckets())
            .catch(err => console.log(err));
    }

    updateBucket(id, key, value) {
        console.log(value);
        API.updateBucket(id, key, value)
            .then(res => this.loadBuckets())
            .catch(err => console.log(err));
    }

    compBucket(id) {
        console.log("comp id =" + id);
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.activity) {
            API.saveBucket({
                activity: this.state.activity,
                author: this.state.currentAuthor,
                description: this.state.description,
                date: this.state.date,
                image: this.state.image,
                userID: this.state.userID
            })
                .then(() => this.loadBuckets())
                .catch(err => console.log(err));
        }
        this.toggle();
    }

    render() {
        console.log(this.props);
        console.log(this.state);
        return (
            <div id="backgroundImage">
                <Container fluid>
                    <Row>
                        <Col sm="12" md={{ size: 6 }}>
                            <Jumbotron id="jumbo">
                                <h1 className="display-4 text-light">Bucket List</h1>
                            </Jumbotron>
                            <div id="cardSpacing">
                                {this.state.user && this.state.user.bucketArray.length ? (
                                    <>
                                        {this.state.incompleteItems.map(listItem => (
                                            // <ListItem key={listItem._id}>
                                            <Card key={listItem._id} id="bucketCard">
                                                <CardBody>
                                                    <CardTitle><Link to={"/buckets/" + listItem._id}>
                                                        <strong>
                                                            {listItem.activity}
                                                        </strong>
                                                    </Link></CardTitle>
                                                </CardBody>
                                                <img width="100%" src={listItem.image} alt="Card image cap" />
                                                <CardBody>
                                                    <CardText>{listItem.description}</CardText>
                                                    <CompBtn
                                                        onClick={() =>
                                                            this.updateBucket(
                                                                listItem._id,
                                                                "completed",
                                                                !this.state.bucketList.find(
                                                                    item => item._id === listItem._id
                                                                ).completed
                                                            )
                                                        }
                                                    />
                                                </CardBody>
                                            </Card>
                                            // </ListItem>
                                        ))}
                                    </>
                                ) : (
                                        <h3>No Results to Display</h3>
                                    )}
                            </div>
                        </Col>
                        <Col sm="12" md={{ size: 6 }}>
                            <Jumbotron id="jumbo">
                                <h1 className="display-4 text-light">Completed Bucket List</h1>
                            </Jumbotron>
                            <div id="cardSpacing">
                                {this.state.user && this.state.user.bucketArray.length ? (
                                    <>
                                        {this.state.completedItems.map(listItem => (
                                            // <ListItem key={listItem._id}>
                                            <Card key={listItem._id} id="bucketCard">
                                                <CardBody>
                                                    <CardTitle><Link to={"/buckets/" + listItem._id}>
                                                        <strong>
                                                            {listItem.activity}
                                                        </strong>
                                                    </Link></CardTitle>
                                                </CardBody>
                                                <img width="100%" src={listItem.image} alt="Card image cap" />
                                                <CardBody>
                                                    <CardText>{listItem.description}</CardText>
                                                    <CompBtn
                                                        onClick={() =>
                                                            this.updateBucket(
                                                                listItem._id,
                                                                "completed",
                                                                !this.state.bucketList.find(
                                                                    item => item._id === listItem._id
                                                                ).completed
                                                            )
                                                        }
                                                    />
                                                   
                                                    
                                                </CardBody>
                                            </Card>
                                            // </ListItem>
                                        ))}
                                    </>
                                ) : (
                                        <h3>No Results to Display</h3>
                                    )}

                            </div>
                        </Col>
                    </Row>
                    <Row>

                        <div className="modelbutt">
                            <Button color="success" onClick={this.toggle}>
                                Create Your Own!
                </Button>
                            <Modal
                                isOpen={this.state.modal}
                                toggle={this.toggle}
                                className={this.props.className}
                            >
                                <ModalHeader toggle={this.toggle}>
                                    Create Your Own!
                  </ModalHeader>
                                <ModalBody>
                                    <form>
                                        <Input
                                            value={this.state.activity}
                                            onChange={this.handleInputChange}
                                            name="activity"
                                            placeholder="Activity (required)"
                                        />

                                        <TextArea
                                            value={this.state.description}
                                            onChange={this.handleInputChange}
                                            name="description"
                                            placeholder="Description (Optional)"
                                        />
                                        <Input
                                            value={this.state.image}
                                            onChange={this.handleInputChange}
                                            name="image"
                                            placeholder="Pic (or it didn't happen)"
                                        />
                                        <FormBtn
                                            disabled={!this.state.activity}
                                            onClick={this.handleFormSubmit}
                                        >
                                            Submit Activity
                      </FormBtn>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.toggle}>
                                        Close
                    </Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default YourList;