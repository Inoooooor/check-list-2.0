import { defineStore } from 'pinia'
import { ref } from 'vue'
import HDE from '../plugin'

export const useToDoListStore = defineStore('toDoLists', () => {
  const { fieldID } = HDE.vars

  // console.log('pinia ticket', HDE.getState().ticketValues.customFields[fieldID])

  const toDoLists = ref(null)

  const makeChecklist = (hdeVarValue) => {
    const checklistItems = []
    hdeVarValue.split(';').forEach((element) => {
      checklistItems.push({
        task: element,
        done: false,
        doneData: {
          executor: '',
          date: '',
        },
        editing: false,
      })
    })
    return checklistItems
  }

  console.log(makeChecklist('Сделать4;Сделать5;Сделать6'))

  const TESTinitToDoLists = (hdeVarsObj) => {
    const listEntries = Object.entries(hdeVarsObj)
    console.log('listEntries', listEntries)

    const isToDoList = (hdeVarName) => {
      const filterNames = ['fieldID', 'defaultCheckList', 'Pinia']
      return !filterNames.includes(hdeVarName)
    }

    const filteredVars = listEntries.filter((hdeVar) => isToDoList(hdeVar[0]))

    const TESTtoDoLists = filteredVars.map((list) => {
      return { name: list[0], checklist: makeChecklist(list[1]) }
    })

    console.log('TESTchecklists', TESTtoDoLists)

    console.log('filtered', filteredVars)

    return TESTtoDoLists
  }

  TESTinitToDoLists(HDE.vars)

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
