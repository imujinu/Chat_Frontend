import { createRouter, createWebHashHistory } from "vue-router";
import MemberCreate from "@/views/MemberCreate.vue";
import LoginPage from "@/views/LoginPage.vue";
import MemberList from "@/views/MyChatPage.vue";
import SimpleWebsocket from "@/views/StompChatPage.vue";
import StompChatPage from "@/views/StompChatPage.vue";
import GroupChattingList from "@/views/GroupChattingList.vue";
import MyChatPage from "@/views/MyChatPage.vue";

const routes = [
  {
    path: "/member/create",
    name: "MemberCreate",
    component: MemberCreate,
  },
  {
    path: "/member/login",
    name: "MemberLogin",
    component: LoginPage,
  },
  {
    path: "/member/list",
    name: "MemberList",
    component: MemberList,
  },
  {
    path: "/simple/chat",
    name: "SimpleWebsocket",
    component: SimpleWebsocket,
  },
  {
    path: "/chatPage/:roomId",
    name: "StompChatPage",
    component: StompChatPage,
  },
  {
    path: "/groupChatting/list",
    name: "GroupChattingList",
    component: GroupChattingList,
  },
  {
    path: "/my/chat/page",
    name: "MyChatPage",
    component: MyChatPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
