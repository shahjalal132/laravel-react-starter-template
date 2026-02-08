export default function DataTable({ columns, data, actions, emptyMessage = 'No data available' }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr className="overflow-x-auto">
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
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
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
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

