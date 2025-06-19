export default async function Table({ items }: { items: object[] }) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full table-auto text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {Object.keys(items[0] ?? {}).map((key) => {
              if (key === "id") {
                // Skip the first column if it's an index or ID
                return null;
              }
              return (
                <th key={key} scope="col" className="px-6 py-3">
                  {key}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {Object.values(item).map((value, idx) => {
                if (idx === 0) {
                  // Skip the first column if it's an index or ID
                  return null;
                } else if (idx === 1) {
                  return (
                    <th
                      key={idx}
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
                    >
                      {String(value)}
                    </th>
                  );
                } else {
                  return (
                    <td key={idx} className="px-6 py-4">
                      {value === null ? '' : String(value)}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
