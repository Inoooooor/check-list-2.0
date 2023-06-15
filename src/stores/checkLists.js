import { defineStore } from 'pinia'
import { ref } from 'vue'
import HDE from '../plugin'

export const useCheckListsStore = defineStore('checkLists', () => {
  const checkLists = ref(JSON.parse(HDE.vars.Pinia))

  return { checkLists }
})
