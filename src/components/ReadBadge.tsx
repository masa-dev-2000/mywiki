interface Props {
  isRead: boolean;
}

export default function ReadBadge({ isRead }: Props) {
  if (isRead) {
    return <span className="read-badge read">✓ 既読</span>;
  }
  return <span className="read-badge unread">NEW</span>;
}
