import MyTable from 'simpletable-letter-xr';
import Card from 'card-letter-xr';
import Note from 'note-letter-xr';
// import Title, { Card as TitleCard } from 'reactcard/dist/index';
// import 'reactcard/dist/main.css';
import 'card-letter-xr/dist/main.css';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('app')
const root = createRoot(container)
const App = () => {
  return (
    <div className='testclass'>
      <Card title='ddd' text='sss' />
      <Note />
      {/* <Title title="React 开发" />
      <TitleCard /> */}
    </div>
  );
}

// console.log('App', Main)
root.render(<App />)

var tableHead = document.getElementById('thead')
var tableBody = document.getElementById('tbody')
// 表格的列,field为字段名，title为展示的表头
var tableColumns = [
  {
    field: 'id',
    title: 'ID'
  },
  {
    field: 'fieldName',
    title: '字段1'
  },
  {
    field: 'fieldName2',
    title: '字段2'
  },
  {
    field: 'KeyFactor1',
    title: '因素1'
  },
  {
    field: 'KeyFactor2',
    title: '因素2'
  },
  {
    field: 'KeyFactor3',
    title: '因素3'
  },
  {
    field: 'KeyFactor4',
    title: '因素4'
  },
  {
    field: 'KeyFactor5',
    title: '因素5'
  },
]
var data = mockTableData(tableColumns.map(item => item.field), 20)
var tableObj = new MyTable(tableColumns, 3, data)
tableObj.init(tableHead, tableBody)


function mockTableData(columns, size = 50) {
  let arr = [];
  for (let i = 0; i < size; i++) {
    let row = columns.reduce((prev, cur) => {
      prev[cur] = Math.random().toFixed(3);
      return prev;
    }, {});
    arr.push(row);
  }
  return arr;
}