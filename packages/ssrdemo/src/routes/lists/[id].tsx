type ListItemProps = {
  id?: string | number,
  title?: string,
  status?: string
}
export default function ListItem({ title = 'dd', ...props }: ListItemProps) {
  return (
    <div>
      <p>{title}</p>
    </div>
  );
}
