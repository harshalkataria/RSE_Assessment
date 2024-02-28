const Config = {
    ROSBRIDGE_SERVER_IP: "localhost",
    ROSBRIDGE_SERVER_PORT: "9090",
    RECONNECTION_TIMER: 3000,
    CMD_VEL_TOPIC: "/steer_bot/ackermann_steering_controller/cmd_vel",
    NAV_GOAL_TOPIC: "/move_base_simple/goal"
};

export default Config;