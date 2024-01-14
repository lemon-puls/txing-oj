// ws连接
let connection: WebSocket;
// 心跳定时器
let heartTimer: number | null = null;
// 重连次数限制
const reconnectCountLimit = 100;
let reconnectCount = 0;
// 重连定时器
let reconnectTimer: null | number = null;
// 重连锁标识
let reconnectLock = false;
// 用户token
let token: null | string = null;

/**
 * 建立ws连接
 */
const initWsConnection = () => {
  connection?.removeEventListener("message", onConnectMsg);
  connection?.removeEventListener("open", onConnectOpen);
  connection?.removeEventListener("close", onConnectClose);
  connection?.removeEventListener("error", onConnectError);
  // 建立连接
  connection = new WebSocket(
    "wss://api.mallchat.cn/websocket" + (token ? "?token" + token : "")
  );
  // 消息监听器
  connection.addEventListener("message", onConnectMsg);
  connection.addEventListener("open", onConnectOpen);
  connection.addEventListener("close", onConnectClose);
  connection.addEventListener("error", onConnectError);
};
// ws连接消息监听器
const onConnectMsg = (e: any) => {
  pushToMainThread({ type: "message", value: e.data });
};
// ws连接 连接打开监听器
const onConnectOpen = () => {
  pushToMainThread({ type: "open" });
  // 设置心跳包发送定时器
  setHeartPackSendTimer();
};
const setHeartPackSendTimer = () => {
  // 10s内发送一次
  heartTimer = window.setInterval(() => {
    wsConnectionSend({ type: 2 });
  }, 9900);
};

// ws连接 关闭监听器
const onConnectClose = () => {
  onCloseHandler();
  token = null;
  pushToMainThread({ type: "close" });
};
// ws连接关闭处理器
const onCloseHandler = () => {
  clearHeartTimer();
  // 判断是否已经在重连
  if (reconnectLock) {
    return;
  }
  // 上重连 锁
  reconnectLock = true;
  // 清楚原有的重连定时器
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  // 判断是否达到重连尝试最大次数限制
  if (reconnectCount >= reconnectCountLimit) {
    reconnectCount = 0;
    return;
  }
  // 断线重连
  reconnectTimer = window.setTimeout(() => {
    initWsConnection();
    reconnectCount++;
    reconnectLock = false;
  }, 2000);
};
/**
 * ws连接 error监听器
 */
const onConnectError = () => {
  onCloseHandler();
  pushToMainThread({ type: "error" });
};

// 移除心跳定时器
const clearHeartTimer = () => {
  if (heartTimer) {
    clearInterval(heartTimer);
    heartTimer = null;
  }
};

/**
 * 往ws发送消息
 */
const wsConnectionSend = (value: object) => {
  connection?.send(JSON.stringify(value));
};
/**
 * 接收、处理主线程的消息
 * @param e
 */
self.onmessage = (e: MessageEvent<string>) => {
  const { type, value } = JSON.parse(e.data);
  switch (type) {
    case "initWS": {
      reconnectCount = 0;
      token = value;
      initWsConnection();
      break;
    }
    case "message": {
      if (connection?.readyState !== 1) {
        return;
      }
      wsConnectionSend(value);
      break;
    }
  }
};

/**
 * 发消息给主线程
 */
const pushToMainThread = ({
  type,
  value,
}: {
  type: string;
  value?: object;
}) => {
  self.postMessage(JSON.stringify({ type, value }));
};
