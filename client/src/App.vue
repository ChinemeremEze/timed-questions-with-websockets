<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  sockets: {
    connect() {
      console.log('App.vue socket connected');
    },
  },
  data() {
    return {}
  },
  mounted() {
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 40px;
}

input[type=text],
input[type=number],
textarea,
select {
  width: 100%;
  padding: 4px;
}

.text-right {
  text-align: right;
}
</style>
