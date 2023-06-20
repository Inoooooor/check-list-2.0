<script setup>
import PluginApp from './components/PluginApp.vue'
import { useToDoListStore } from './stores/toDoLists'
import HDE from './plugin'

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
    <template v-for="(checklist, index) in store.toDoLists" :key="index">
      <PluginApp :to-do-name="checklist.name" :to-do-index="index" />
    </template>
  </div>
</template>

<style lang="scss"></style>
