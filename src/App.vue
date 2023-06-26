<script setup>
import ToDoList from './components/ToDoList.vue'
import { useToDoListStore } from './stores/toDoLists'
import HDE from './plugin'
console.log(HDE.getState())

const store = useToDoListStore()

store.initToDoLists()
</script>

<template>
  <div class="plugin">
    <template v-for="(toDoList, index) in store.toDoLists" :key="index">
      <ToDoList :to-do-name="toDoList.name" :to-do-index="index" />
    </template>
  </div>
</template>
