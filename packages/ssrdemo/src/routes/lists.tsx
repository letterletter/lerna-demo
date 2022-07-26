const data = [
  { id: 1, title: '待完成1', status: 'active' },
  { id: 2, title: '待完成2', status: 'active' },
  { id: 3, title: '待完成3', status: 'active' },
  { id: 4, title: '已完成', status: 'completed' },
];
export function getData() {
  return 'data';
}
export default function List() {
  return (
    <div>
      Hello Demo!
      {
        data.map((item) => (
          <div>
            {item.title}
            {' '}
            ---
            {' '}
            {item.status}
          </div>
        ))
      }
    </div>
  );
}
