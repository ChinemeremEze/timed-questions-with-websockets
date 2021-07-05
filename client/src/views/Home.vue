<template>
  <div class="menu-items">
    <router-link to="/teacher" class="menu-item">Teacher</router-link>
    <router-link to="/student" class="menu-item">Student</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },
  components: {
    
  },
  methods: {
  }
}
</script>

<style scoped>
.menu-items {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-items .menu-item {
  width: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.3);
  background: white;
  padding: 100px 20px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 30px;
}
</style>