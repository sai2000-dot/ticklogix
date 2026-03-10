const STYLES = {
  draft:     'bg-gray-100   text-gray-600',
  submitted: 'bg-yellow-100 text-yellow-700',
  approved:  'bg-green-100  text-green-700',
  rejected:  'bg-red-100    text-red-700',
  sent:      'bg-blue-100   text-blue-700',
  paid:      'bg-green-100  text-green-700',
  overdue:   'bg-red-100    text-red-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STYLES[status] || STYLES.draft}`}>
      {status}
    </span>
  );
}