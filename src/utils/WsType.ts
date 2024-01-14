/**
 * ws请求消息类型
 */
import { UserVO } from "../../generated";

export enum WsRequestMsgType {
  HeartPack,
}

/**
 * ws请求消息
 */
export type WsRequestMsgContentType = {
  type: WsRequestMsgType;
  data?: Record<string, unknown>;
};

/**
 * Ws响应消息类型
 */
export enum WsResponseMsgType {
  /**
   * 新消息
   */
  Message,
  /**
   * 群组成员变动
   */
  GroupMemberChange,
  /**
   * 用户 上下线通知
   */
  UserOlineOfflineNotify,
  /**
   * 用户token失效
   */
  UserTokenInvalid,
  /**
   * 用户登录成功
   */
  UserLoginSuccess,
}

/**
 * 用户登录成功响应
 */
export type UserLoginSuccessResponse = Pick<
  UserVO,
  "userAvatar" | "userName" | "id"
> & {
  token: string;
};
