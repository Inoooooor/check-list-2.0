import { defineStore } from 'pinia'
import { ref } from 'vue'
import HDE from '../plugin'

export const useToDoListStore = defineStore('toDoLists', () => {
  const { fieldID } = HDE.vars

  console.log('pinia ticket', HDE.getState().ticketValues.customFields[fieldID])

  const toDoLists = ref(null)

  const initToDoLists = () => {
    const customFieldData = HDE.getState().ticketValues.customFields[fieldID]
    const initData = JSON.parse(HDE.vars.Pinia)

    if (customFieldData) toDoLists.value = JSON.parse(customFieldData)

    console.log('from init', toDoLists.value)
    console.log('initData', initData)

    if (initData && !customFieldData) toDoLists.value = initData
  }
  return { toDoLists, initToDoLists }
})
