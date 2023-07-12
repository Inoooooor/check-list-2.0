import { defineStore } from 'pinia'
import { ref } from 'vue'
import HDE from '../plugin'
import webHookErrorHandler from './utilities/webHookErrorHandler'

export const useToDoListStore = defineStore('toDoLists', () => {
  const toDoLists = ref(null)
  const DEV = import.meta.env.DEV

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

    const isToDoList = (hdeVarName) => {
      const filterNames = ['webHook']
      return !filterNames.includes(hdeVarName)
    }

    const varsForLists = listEntries.filter((hdeVar) => isToDoList(hdeVar[0]))

    if (!varsForLists.length)
      throw new Error('Отстутсвуют чек-листы в настройках плагина')

    const defaultLists = varsForLists.map((list) => {
      return { name: list[0], checklist: makeChecklist(list[1]) }
    })

    if (DEV) {
      console.log('listEntries', listEntries)
      console.log('TESTchecklists', defaultLists)
      console.log('filtered', varsForLists)
    }

    return defaultLists
  }

  const initToDoLists = async () => {
    const { ticketId } = HDE.getState()
    try {
      webHookErrorHandler(HDE.vars)

      const { data } = await HDE.webhook({
        endpoint: 'toDoList',
        value: ticketId,
      })

      if (data) toDoLists.value = JSON.parse(data.data.toDoListData)
      else toDoLists.value = initDefaultLists(HDE.vars)

      if (DEV) {
        console.log('GET INFO FROM WH', data)
        console.log('from init', toDoLists.value)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { toDoLists, initToDoLists }
})
