<template>
  <transition name="fade">
    <div v-if="animation" class="chat">
      <div class="container-sm mt-20">
        <div class="mx-5">
          <Message
            v-for="{ id, text, userPhotoURL, userName, userId } in messages"
            :key="id"
            :name="userName"
            :photo-url="userPhotoURL"
            :sender="userId === user?.uid"
          >
            {{ text }}
          </Message>
        </div>
      </div>
      <div ref="bottom" class="mt-20" />
      <div class="bottom">
        <div class="container-sm">
          <form v-if="isLogin" @submit.prevent="send">
            <input v-model="message" placeholder="Message" required />
            <button type="submit">
              <SendIcon
                class="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 ..."
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { ref, watch, nextTick } from "vue";
import { useAuth, useChat } from "@/firebase";

import SendIcon from "./SendIcon.vue";
import Message from "./Message.vue";

export default {
  components: { Message, SendIcon },

  data() {
    return {
      // Url taken from the config file
      animation: false,
    };
  },
  setup() {
    const { user, isLogin } = useAuth();
    // grab message from useChat hook
    const { messages, sendMessage } = useChat();
    const bottom = ref(null);
    watch(
      messages,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: "smooth" });
        });
      },
      { deep: true }
    );
    const message = ref("");
    const send = () => {
      sendMessage(message.value);
      message.value = "";
    };
    return { user, isLogin, messages, bottom, message, send };
  },

  mounted() {
    this.animation = true;
  },
};
</script>
