<script setup>
import ToDoList from './components/ToDoList.vue'
import { useToDoListStore } from './stores/toDoLists'
import HDE from './plugin'
console.log(HDE.getState())

const store = useToDoListStore()

const hideCustomField = () => {
  const { fieldID } = HDE.vars
  window.parent.document.querySelector(
    `#ticket-custom-field-${fieldID}`
  ).parentElement.parentElement.parentElement.parentElement.style.display =
    'none'
}

store.initToDoLists()

hideCustomField()
</script>

<template>
  <div class="plugin">
    <template v-for="(toDoList, index) in store.toDoLists" :key="index">
      <ToDoList :to-do-name="toDoList.name" :to-do-index="index" />
    </template>
  </div>
</template>
