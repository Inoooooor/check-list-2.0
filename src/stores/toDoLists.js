import { defineStore } from 'pinia'
import { ref } from 'vue'
import HDE from '../plugin'

export const useToDoListStore = defineStore('toDoLists', () => {
  const { fieldID } = HDE.vars

  const toDoLists = ref(null)

  const makeChecklist = (hdeVarValue) => {
    const checklistItems = []
    const toDoItem = (taskName) => {
      return {
        task: taskName,
        done: false,
        doneData: {
          executor: '',
          date: '',
        },
        editing: false,
      }
    }
    hdeVarValue.split(';').forEach((element) => {
      checklistItems.push(toDoItem(element))
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

    if (customFieldData) toDoLists.value = JSON.parse(customFieldData)
    else toDoLists.value = TESTinitToDoLists(HDE.vars)

    console.log('from init', toDoLists.value)
  }

  return { toDoLists, initToDoLists }
})
