import { defineStore } from 'pinia'
import { ref } from 'vue'
import HDE from '../plugin'

export const useCheckListsStore = defineStore('checkLists', () => {
  const { fieldID } = HDE.vars
  const checkLists = ref(
    JSON.parse(HDE.getState().ticketValues.customFields[fieldID])
  )
  console.log(
    'pinia ticket',
    JSON.parse(HDE.getState().ticketValues.customFields[fieldID])
  )
  return { checkLists }
})
