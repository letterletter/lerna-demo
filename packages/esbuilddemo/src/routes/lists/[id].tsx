
const data = [
  { id: 1, title: '待完成1', status: 'active'},
  { id: 2, title: '待完成2', status: 'active'},
  { id: 3, title: '待完成3', status: 'active'},
  { id: 4, title: '已完成', status: 'completed'}
]
type ListItemProps = {
  id?: string | number,
  title?: string,
  status?: string
}
export default function ListItem(props: ListItemProps) {
  const { title = '标题', id, status } = props;
  return (
    <div>
      <p>{props.title}</p>
    </div>
  )
}