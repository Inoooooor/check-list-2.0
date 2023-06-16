<script setup>
import PluginApp from './components/PluginApp.vue'
import { useToDoListStore } from './stores/toDoLists'
import HDE from './plugin'

const store = useToDoListStore()

console.log(HDE)
console.log('App', store.toDoLists)

store.initToDoLists()
</script>

<template>
  <div class="plugin">
    <template v-for="(checklist, index) in store.toDoLists" :key="index">
      <PluginApp :to-do-name="checklist.name" :to-do-index="index" />
    </template>
    <!-- <PluginApp /> -->
  </div>
</template>

<style lang="scss"></style>
