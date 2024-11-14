import { useState } from "react";
import { GetRecordsByUserIdResponse } from "../../types/responses/GetRecordsByIdResponse";
import { formatDate } from "../../utils";

interface IJournalListProps {
  records: Array<GetRecordsByUserIdResponse>;
}

function JournalList({ records }: IJournalListProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Journal List</h2>
      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            onClick={() => setCurrentImageUrl(record.generatedImageUrl)}
            className="flex items-center p-4 bg-white shadow rounded-lg border border-gray-200 cursor-pointer"
          >
            <div className="flex-1">
              <span className="block font-medium text-gray-700">
                {record.promptText}
              </span>
              <span className="block text-gray-500 text-sm">
                {formatDate(record.createdAt.toString())}
              </span>
              <span className="block text-gray-600 mt-1">{record.status}</span>
            </div>
          </div>
        ))}

        {currentImageUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setCurrentImageUrl(null)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setCurrentImageUrl(null)}
                className="absolute top-0 right-0 p-1 bg-gray-200 rounded-full text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
              <img
                src={currentImageUrl}
                alt="Generated"
                className="w-64 h-64 object-cover rounded-lg border border-gray-300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalList;
