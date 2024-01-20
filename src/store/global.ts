import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { RoomTypeEnum } from "@/enume";
import { ContactItem, FriendApplyItem } from "@/service/types";
import Ws from "@/utils/websocket";
import { Service } from "../../generated";
import { useChatStore } from "@/store/chat";

export const useGlobalStore = defineStore("global", () => {
  // Ws对象（管理websocket连接）
  const ws = ref<Ws | undefined>(undefined);
  /**
   * 当前选中会话
   */
  const currentSession = reactive<{ roomId: number; type: RoomTypeEnum }>({
    roomId: 1,
    type: RoomTypeEnum.GROUP,
  });
  const currentSelectedContact = ref<ContactItem | FriendApplyItem>();

  const unReadMark = reactive<{
    newFriendUnreadCount: number;
    newMessageUnreadCount: number;
  }>({
    newFriendUnreadCount: 0,
    newMessageUnreadCount: 0,
  });

  return { currentSession, currentSelectedContact, unReadMark, ws };
});
