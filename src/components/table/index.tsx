import React from "react";

interface Props {
  head: { key: string; hiddenTitle: boolean; title: string }[];
  data: any[];
  loading?: boolean;
}

const Table: React.FC<Props> = ({ head, data, loading }) => {
  return (
    <div className="flex flex-col w-full z-10">
      <div className="-my-2 overflow-x-auto sm:-mx-6">
        <div className="inline-block min-w-full py-2 align-middle px-0.5 sm:px-6 pb-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 bg-opacity-50">
                <tr>
                  {head.map((item) => (
                    <th
                      key={item.key}
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-medium text-white uppercase min-w-[250px]"
                    >
                      {!item.hiddenTitle && item.title}
                    </th>
                  ))}

                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-transparent">
                {loading ? (
                  <>
                    {mockedData.map((_, index) => (
                      <tr key={index} className="h-11 relative">
                        <td>
                          <span className="absolute top-0 w-[98%] ml-4 mt-4 rounded h-4 animate-pulse bg-gray-300 flex" />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <>
                    {data.map((item, key) => (
                      <tr key={key} className="overflow-auto">
                        {head.map((headItem, index) => (
                          <td
                            key={index}
                            className="whitespace-nowrap px-3 py-3 text-xs sm:text-sm text-richBlack"
                          >
                            {item[headItem.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

//
// Utils
//

const mockedData = ["", "", "", "", "", "", "", ""];
