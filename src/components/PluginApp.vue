<script>
import HDE from '../plugin/index'
import { useToDoListStore } from '../stores/toDoLists'

export default {
  name: 'ToDoListContainer',
  props: {
    toDoName: {
      type: String,
      required: true,
    },
    toDoIndex: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const store = useToDoListStore()
    return { store }
  },
  data: () => {
    return {
      toDoList: [],
      fieldID: HDE.vars.fieldID,
      defaultCheckList: HDE.vars.defaultCheckList,
      ticketValues: HDE.getState().ticketValues,
      activeNames: ['1'],
    }
  },
  computed: {
    completedTasks() {
      return (
        (this.toDoList.filter((item) => item.done).length /
          this.toDoList.length) *
        100
      ).toFixed()
    },
  },
  mounted() {
    this.initToDoList()
    console.log('checklist-index', this.toDoIndex)
    // const checklistData = window.parent.document.querySelector(
    //   `#ticket-custom-field-${this.fieldID}`
    // )
  },
  methods: {
    addItem() {
      const toDoItem = {
        task: '',
        done: false,
        doneData: {
          executor: '',
          date: '',
        },
        editing: true,
      }

      this.toDoList.push(toDoItem)
      this.focusOnCurInput()
    },
    finishItem(e, index) {
      if (e.target.checked && !this.toDoList[index].task) {
        this.toDoList.splice(index, 1)
        this.updateFieldData()
        return
      }
      let state = JSON.parse(
        window.parent.document.querySelector('#ticketAppInitialState').innerHTML
      )
      let executor = state.usersOnline.find(
        (item) => item.id === state.currentUser.userId
      ).name
      this.toDoList[index].done = e.target.checked
      if (e.target.checked) {
        this.toDoList[index].doneData.date = this.dateGroup(new Date(), true)
        this.toDoList[index].doneData.executor = executor
      } else {
        this.toDoList[index].doneData.date = ''
        this.toDoList[index].doneData.executor = ''
      }

      this.disableAllEditing()
      this.updateFieldData()
    },
    initToDoList() {
      // ЗДЕСЬ в dataField ДОЛЖЕН ОТПРАВЛЯТЬСЯ МАССИВ ИЗ КАСТОМ ПОЛЕЙ ТИКЕТА!!!
      // let dataField = this.store.checkLists[this.checklistIndex].checklist
      // console.log('dataField', dataField)
      // if (this.defaultCheckList && !dataField) {
      //   this.defaultCheckList.split(';').forEach((element) => {
      //     this.toDoList.push({
      //       task: element,
      //       done: false,
      //       doneData: {
      //         executor: '',
      //         date: '',
      //       },
      //       editing: false,
      //     })
      //   })
      // }
      this.toDoList = this.store.toDoLists[this.toDoIndex].checklist
      // window.parent.document.querySelector(
      //   `#ticket-custom-field-${this.fieldID}`
      // ).parentElement.parentElement.parentElement.parentElement.style.display =
      //   'none'
    },
    updateFieldData() {
      HDE.emit('setTicketCustomFieldValue', {
        customFieldId: this.fieldID,
        value: JSON.stringify(this.store.toDoLists),
      })
      this.disableAllEditing()
    },
    editItem(index) {
      if (!this.toDoList[index].done) {
        this.disableAllEditing()
        this.toDoList[index].editing = true
        this.focusOnCurInput()
      }
    },
    disableAllEditing() {
      this.toDoList.map((item) => (item.editing = false))
    },
    focusOnCurInput() {
      setTimeout(() => {
        this.$refs.todoref[0].focus()
      })
    },
    handleChange(val) {
      console.log(val)
    },
    dateGroup(date, withTime) {
      let minutes = this.setDoubleTime(date.getMinutes())
      let hours = this.setDoubleTime(date.getHours())
      let day = this.setDoubleTime(date.getDate())
      let month = this.setDoubleTime(date.getMonth() + 1)
      return withTime
        ? `${day}.${month}.${date.getFullYear()} ${hours}:${minutes} `
        : `${day}.${month}.${date.getFullYear()}`
    },
    setDoubleTime(value) {
      return value.toString().padStart(2, '0')
    },
  },
}
</script>

<template>
  <div class="demo-collapse">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-progress
        :percentage="completedTasks"
        :stroke-width="17"
        :show-text="false"
        color="#23869b"
      />
      <el-collapse-item :title="toDoName" name="1">
        <div id="toDoListContainer" class="toDo-container">
          <div class="panel">
            <div class="toDo-header">Добавить пункт</div>
            <div>
              <button class="add-button" @click="addItem()">+</button>
            </div>
          </div>
          <div v-if="!toDoList.length" class="empty-text">Задач нет.</div>
          <div v-else>
            <div v-for="(item, index) in toDoList" :key="index" class="item">
              <div class="item-container">
                <div class="item-text">
                  <div>{{ index + 1 }}.</div>
                  <input
                    v-if="item.editing"
                    ref="todoref"
                    v-model="item.task"
                    class="task-editing"
                    placeholder="Не заполнено"
                    @focusout="disableAllEditing()"
                    @change="updateFieldData()"
                  />
                  <div
                    v-if="!item.editing"
                    :class="item.done ? 'finished task-text' : 'task-text'"
                    @click="editItem(index)"
                  >
                    <span v-if="!item.task">Не заполнено</span>
                    <span v-else> {{ item.task }} </span>
                  </div>
                </div>
                <input
                  :checked="item.done"
                  type="checkbox"
                  class="checkbox"
                  @change="(e) => finishItem(e, index)"
                />
              </div>
              <div v-if="item.done" class="info">
                выполнил(a) {{ item.doneData.executor }}
                {{ item.doneData.date }}
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: Arial;
}

.empty-text {
  color: #606266;
  width: calc(100% - 20px);
  text-align: center;
  font-size: 13px;
}

.toDo-container {
  padding: 10px;
}

.toDo-header {
  margin: 0 10px 10px 10px;
  line-height: 28px;
}

.item-container {
  display: flex;
  justify-content: space-between;
}

.panel {
  display: flex;
  color: #606266;
}

.task-editing {
  border: none;
  font-size: 16px;
  flex-grow: 1;
  color: #606266;
}

.finished {
  text-decoration: line-through;
  cursor: default !important;
}

.task-text {
  padding-left: 3px;
  color: #606266 !important;
  word-break: break-all;
  cursor: pointer;
}

.task-editing:focus {
  outline: none;
  border: none;
}

.add-button {
  padding: 6px 9px;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;
  outline: none;
  border: 1px solid #dcdfe6;
  color: #606266;
  line-height: 1;
  background: #fff;
  font-size: 14px;
}

.add-button:hover {
  color: #23869b;
  background-color: #e9f3f5;
  border-color: #bddbe1;
}

.checkbox {
  accent-color: #23869b;
}

.checkbox {
  background: gray;
}
.checkbox:hover {
  background: rgb(121, 121, 121);
  border: 1px solid #0000ff;
}

.item-text {
  display: flex;
  flex-grow: 1;
  width: 100%;
}

.info {
  font-size: 11px;
  color: #a9a9a9;
}

.item {
  margin-bottom: 6px;
}
</style>
