import React, { Component } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import Connection from "./Connection";
import Teleop from "./teleop";
import RobotState from "./RobotState"
import Config from "../scripts/config";

class Home extends Component {

    constructor() {
        super();
        this.init_connection();
        this.poseNavGoal = this.poseNavGoal.bind(this);

    }
    state = {
        text: null,
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        orientationX: 0,
        orientationY: 0,
        orientationZ: 0,
        orientationW: 0,
        ros: null,
    };
    init_connection() {
        this.state.ros = new window.ROSLIB.Ros();//add window keyword as javascript library added in index.html
        console.log(this.state);
        this.state.ros.on("connection", () => {
            console.log("Connection established");
            this.setState({ Connected: true });
        });
        this.state.ros.on("close", () => {
            console.log("connection is closed");
            this.setState({ Connected: false });
            setTimeout(() => {
                try {
                    this.state.ros.connect("ws://" + Config.ROSBRIDGE_SERVER_IP + ":" + Config.ROSBRIDGE_SERVER_PORT + "");
                } catch (error) { console.log("connection problem") }
            }, Config.RECONNECTION_TIMER);
        });
        try {
            this.state.ros.connect("ws://" + Config.ROSBRIDGE_SERVER_IP + ":" + Config.ROSBRIDGE_SERVER_PORT + "");
        } catch (error) {
            console.log("connection problem")
        }
    }
    poseNavGoal() {
        console.log("Goal", this.state);
        var nav_goal = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.NAV_GOAL_TOPIC,
            messageType: "geometry_msgs/PoseStamped"
        })
        //we need to create a pose message to be published to rosbridge
        var message = new window.ROSLIB.Message({
            pose:
            {
                position:
                {
                    x: Number.parseFloat(this.state.positionX),
                    y: Number.parseFloat(this.state.positionY),
                    z: Number.parseFloat(this.state.positionZ)
                },
                orientation:
                {
                    x: Number.parseFloat(this.state.orientationX),
                    y: Number.parseFloat(this.state.orientationY),
                    z: Number.parseFloat(this.state.orientationZ),
                    w: Number.parseFloat(this.state.orientationW)
                },
            },
        });
        //we need to publish the message on the cmd_vel topic
        nav_goal.publish(message);
    }


    render() {
        return (
            <div>
                <Form>
                    <Form.Group><Form.Text>Enter Geometry</Form.Text>
                        <Form.Control placeholder="Position X" onChange={(e) => this.setState({ positionX: (e.target.value) })} />
                        <Form.Control placeholder="Position Y" onChange={(e) => this.setState({ positionY: (e.target.value) })} />
                        <Form.Control placeholder="Position Z" onChange={(e) => this.setState({ positionZ: (e.target.value) })} />
                        <Form.Control placeholder="Orientation X" onChange={(e) => this.setState({ orientationX: (e.target.value) })} />
                        <Form.Control placeholder="Orientation Y" onChange={(e) => this.setState({ orientationY: (e.target.value) })} />
                        <Form.Control placeholder="Orientation Z" onChange={(e) => this.setState({ orientationZ: (e.target.value) })} />
                        <Form.Control placeholder="Orientation W" onChange={(e) => this.setState({ orientationW: (e.target.value) })} />
                        <Button onClick={this.poseNavGoal}>run</Button>
                    </Form.Group>

                </Form>

                <Container>
                    <h1 className="text-center mt-3">Robot Control Page</h1>
                    <Row>
                        <Col>
                            <Connection />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Teleop />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <RobotState />
                        </Col>
                    </Row>

                </Container>
            </div>
        );
    }
}
export default Home;