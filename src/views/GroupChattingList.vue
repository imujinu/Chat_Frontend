<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-center text-h5">채팅방 목록</v-card-title>
          <div class="d-flex justify-end">
            <v-btn color="secondary" @click="showCreateRoomModal = true"
              >채팅방 생성</v-btn
            >
          </div>

          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>방번호</th>
                  <th>방제목</th>
                  <th>채팅</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="chat in chatRoomList" :key="chat.id">
                  <td>{{ chat.id }}</td>
                  <td>{{ chat.name }}</td>
                  <td>
                    <v-btn color="primary" @click="joinChatRoom(chat.id)"
                      >참여하기</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showCreateRoomModal" max-width="500px">
      <v-card-title class="text-h6"> 채팅방 생성 </v-card-title>
      <v-card-text>
        <v-text-field label="방제목" v-model="newRoomTitle" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="gray" @click="showCreateRoomModal = false">취소</v-btn>
        <v-btn color="primary" @click="createChatRoom">생성</v-btn>
      </v-card-actions>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      showCreateRoomModal: false,
      newRoomTitle: "",
      chatRoomList: [],
    };
  },
  async created() {
    await this.loadChatRoom();
  },
  methods: {
    async joinChatRoom(roomId) {
      await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/chat/room/group/${roomId}/join`
      );
      this.$router.push(`/chatpage/${roomId}`);
    },
    async createChatRoom() {
      await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/chat/room/group/create?roomName=${this.newRoomTitle}`,
        // post 요청은 바디의 입력을 기대하기 때문에 null을 받아줌
        null
      );
      this.showCreateRoomModal = false;
      this.loadChatRoom();
    },
    async loadChatRoom() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/chat/room/group/list`
      );
      this.chatRoomList = response.data;
      console.log(response.data);
    },
  },
};
</script>
