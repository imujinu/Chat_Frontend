<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center text-h5"> 채팅 </v-card-title>
          <v-card-text>
            <div class="chat-box">
              <div
                v-for="(msg, index) in messages"
                :key="index"
                :class="[
                  'chat-message',
                  msg.senderEmail === this.senderEmail ? 'sent' : 'received',
                ]"
              >
                <strong>{{ msg.senderEmail }} : {{ msg.message }}</strong>
              </div>
            </div>
            <v-text-field
              v-model="newMessage"
              label="메시지 입력"
              @keyup.enter="sendMessage"
            />
            <v-btn color="primary" block @click="sendMessage">전송</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import axios from "axios";

export default {
  data() {
    return {
      ws: null,
      messages: [],
      newMessage: "",
      stompClient: null,
      token: "",
      senderEmail: "",
      roomId: null,
    };
  },
  async created() {
    this.connectWebsocket();
    //route의 파라미터로 들어오는 roomId라는 값을 받겠다.
    this.roomId = this.$route.params.roomId;
    this.senderEmail = localStorage.getItem("email");

    const response = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/chat/history/${this.roomId}`
    );
    this.messages = response.data;
  },
  beforeUnmount() {
    this.disconnectWebSocket();
  },
  methods: {
    connectWebsocket() {
      //기존 연결 정보가 존재하면 바로 return
      if (this.stompClient && this.stompClient.connected) return;
      // sockjs는 websocket을 내장한 js 라이브러리, http 엔드포인트 사용.
      const sockJs = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/connect`);
      this.stompClient = Stomp.over(sockJs);
      this.token = localStorage.getItem("token");

      this.stompClient.connect(
        {
          Authorization: `Bearer ${this.token}`,
        },
        () => {
          //처음 연결 시 토큰 여부로 방의 참여중인지 아닌지를 알 수 있음
          this.stompClient.subscribe(
            `/topic/1`,
            (message) => {
              const parseMessage = JSON.parse(message.body);
              this.messages.push(parseMessage);
              this.scrollToBottom();
            },
            {
              Authorization: `Bearer ${this.token}`,
            }
          );
        }
      );
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;
      const message = {
        senderEmail: this.senderEmail,
        message: this.newMessage,
      };

      this.stompClient.send(`/publish/${this.roomId}`, JSON.stringify(message));
      this.newMessage = "";
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    },
    disconnectWebSocket() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.unsubscribe("/topic/1");
        this.stompClient.disconnect();
      }
    },
  },
};
</script>
<style>
.chat-box {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.chat-message {
  margin-bottom: 10px;
}
.sent {
  text-align: right;
}
.received {
  text-align: left;
}
</style>
