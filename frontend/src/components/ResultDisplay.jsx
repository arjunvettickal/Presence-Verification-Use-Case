import React from 'react';

const ResultDisplay = ({ result, onReset }) => {
    if (!result) return null;

    const statusColors = {
        "Verified": "bg-green-100 text-green-800 border-green-500",
        "Incomplete": "bg-yellow-100 text-yellow-800 border-yellow-500",
        "Excess": "bg-orange-100 text-orange-800 border-orange-500",
        "Fail": "bg-red-100 text-red-800 border-red-500"
    };

    return (
        <div className={`p-6 border-l-4 rounded shadow ${statusColors[result.status] || "bg-gray-100"}`}>
            <h2 className="text-3xl font-bold mb-4">{result.status}</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold">Detected Counts:</h4>
                    <pre className="text-sm">{JSON.stringify(result.detected, null, 2)}</pre>

                    {Object.keys(result.missing).length > 0 && (
                        <div className="mt-2 text-red-600">
                            <strong>Missing:</strong> {JSON.stringify(result.missing)}
                        </div>
                    )}

                    {Object.keys(result.excess).length > 0 && (
                        <div className="mt-2 text-orange-600">
                            <strong>Excess:</strong> {JSON.stringify(result.excess)}
                        </div>
                    )}
                </div>

                <div>
                    {result.image_url && (
                        <img
                            src={`http://localhost:8000${result.image_url}`}
                            alt="Detection Result"
                            className="w-full rounded shadow"
                        />
                    )}
                </div>
            </div>

            <button
                onClick={onReset}
                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
                New Order
            </button>
        </div>
    );
};

export default ResultDisplay;
