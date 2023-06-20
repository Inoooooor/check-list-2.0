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
    hdeVarValue
      .toString()
      .split(';')
      .forEach((element) => checklistItems.push(toDoItem(element)))
    return checklistItems
  }

  const initDefaultLists = (hdeVarsObj) => {
    const listEntries = Object.entries(hdeVarsObj)
    console.log('listEntries', listEntries)

    const isToDoList = (hdeVarName) => {
      const filterNames = ['fieldID']
      return !filterNames.includes(hdeVarName)
    }

    const varsForLists = listEntries.filter((hdeVar) => isToDoList(hdeVar[0]))

    const defaultLists = varsForLists.map((list) => {
      return { name: list[0], checklist: makeChecklist(list[1]) }
    })

    console.log('TESTchecklists', defaultLists)

    console.log('filtered', varsForLists)

    return defaultLists
  }

  const initToDoLists = () => {
    const customFieldData = HDE.getState().ticketValues.customFields[fieldID]

    if (customFieldData) toDoLists.value = JSON.parse(customFieldData)
    else toDoLists.value = initDefaultLists(HDE.vars)

    console.log('from init', toDoLists.value)
  }

  return { toDoLists, initToDoLists }
})
