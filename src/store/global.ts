import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { RoomTypeEnum } from "@/enume";
import { ContactItem, FriendApplyItem } from "@/service/types";

export const useGlobalStore = defineStore("global", () => {
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

  return { currentSession, currentSelectedContact, unReadMark };
});
