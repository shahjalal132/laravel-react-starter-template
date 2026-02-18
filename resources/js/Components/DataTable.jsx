export default function DataTable({ 
    columns, 
    data, 
    actions, 
    emptyMessage = 'No data available', 
    actionLabel = 'Actions',
    selectable = false,
    selectedIds = [],
    onSelectToggle = () => {},
    onSelectAllToggle = () => {}
}) {
    const allSelected = data.length > 0 && selectedIds.length === data.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {selectable && (
                            <th scope="col" className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    checked={allSelected}
                                    ref={(input) => {
                                        if (input) {
                                            input.indeterminate = isIndeterminate;
                                        }
                                    }}
                                    onChange={onSelectAllToggle}
                                />
                            </th>
                        )}
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                        {actions && (
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {actionLabel}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => {
                            const isSelected = selectedIds.includes(row.id);
                            return (
                                <tr
                                    key={rowIndex}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                checked={isSelected}
                                                onChange={() => onSelectToggle(row.id)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                                        >
                                            {column.render ? column.render(row) : row[column.accessor]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

