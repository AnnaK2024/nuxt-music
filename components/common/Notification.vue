<template>
  //указываем, куда нужно вставить компонент
  <Teleport to="body">
    <Transition name="notification">
      <div v-if="show" class="notification" :class="type">
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "error",
    validator: (value) => ["error", "success", "info"].includes(value),
  },
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification.error {
  background-color: #ff4d4f;
}

.notification.success {
  background-color: #52c41a;
}

.notification.info {
  background-color: #1890ff;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
