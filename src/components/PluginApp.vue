<script>
import HDE from '../plugin/index'

// const { ticketValues } = HDE.getState()

const setDoubleTime = (value) => {
  if (value.toString().length < 2) return '0' + value
  else return value
}

const dateGroup = (date, withTime) => {
  let minutes = setDoubleTime(date.getMinutes())
  let hours = setDoubleTime(date.getHours())
  let day = setDoubleTime(date.getDate())
  let month = setDoubleTime(date.getMonth() + 1)
  if (withTime)
    return (
      day +
      '.' +
      month +
      '.' +
      date.getFullYear() +
      ' ' +
      hours +
      ':' +
      minutes +
      ' '
    )
  else return day + '.' + month + '.' + date.getFullYear()
}

export default {
  name: '#toDoListContainer',
  data: () => {
    return {
      toDoList: [],
      fieldID: HDE.vars.fieldID,
      defaultCheckList: HDE.vars.defaultCheckList,
      ticketValues: HDE.getState().ticketValues,
    }
  },
  mounted() {
    console.log(HDE.vars.fieldID)
    this.initToDoList()
  },
  methods: {
    addItem() {
      this.toDoList.push({
        task: '',
        done: false,
        doneData: {
          executor: '',
          date: '',
        },
        editing: true,
      })
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
        this.toDoList[index].doneData.date = dateGroup(new Date(), true)
        this.toDoList[index].doneData.executor = executor
      } else {
        this.toDoList[index].doneData.date = ''
        this.toDoList[index].doneData.executor = ''
      }

      this.disableAllEditing()
      this.updateFieldData()
    },
    initToDoList() {
      let dataField = this.ticketValues.customFields[this.fieldID]
      if (this.defaultCheckList && !dataField) {
        this.defaultCheckList.split(';').forEach((element) => {
          this.toDoList.push({
            task: element,
            done: false,
            doneData: {
              executor: '',
              date: '',
            },
            editing: false,
          })
        })
      }
      if (dataField) {
        this.toDoList = JSON.parse(dataField)
      }
      window.parent.document.querySelector(
        `#ticket-custom-field-${this.fieldID}`
      ).parentElement.parentElement.parentElement.parentElement.style.display =
        'none'
    },
    updateFieldData() {
      HDE.emit('setTicketCustomFieldValue', {
        customFieldId: this.fieldID,
        value: JSON.stringify(this.toDoList),
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
  },
}
</script>

<template>
  <div id="toDoListContainer" class="toDo-container">
    <div class="panel">
      <div class="toDo-header">Чек-лист</div>
      <div>
        <button class="add-button" @click="addItem()">+</button>
      </div>
    </div>
    <div v-if="toDoList.length === 0" class="empty-text">Задач нет.</div>
    <div v-if="toDoList.length > 0">
      <div class="item" v-for="(item, index) in toDoList" :key="index">
        <div class="item-container">
          <div class="item-text">
            <div>{{ index + 1 }}.</div>
            <input
              v-if="item.editing"
              v-model="item.task"
              class="task-editing"
              placeholder="Не заполнено"
              ref="todoref"
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
          выполнил(a) {{ item.doneData.executor }} {{ item.doneData.date }}
        </div>
      </div>
    </div>
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
