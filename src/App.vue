<script setup>
import PluginApp from './components/PluginApp.vue'
import { useCheckListsStore } from './stores/checkLists'
import HDE from './plugin'

const store = useCheckListsStore()

console.log(HDE)
console.log('App', store.checkLists)
</script>

<template>
  <div class="plugin">
    <template v-for="(checklist, index) in store.checkLists" :key="index">
      <PluginApp :checklist-name="checklist.name" :checklist-index="index" />
    </template>
    <!-- <PluginApp /> -->
  </div>
</template>

<style lang="scss"></style>
