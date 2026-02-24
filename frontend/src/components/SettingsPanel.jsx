import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPanel = ({ settings, onSettingsChange, isOpen, onToggle }) => {
    const handleChange = (key, value) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="mb-4">
            <button
                onClick={onToggle}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
                <Settings className="w-4 h-4 mr-2" />
                {isOpen ? 'Hide Settings' : 'Advanced Settings'}
            </button>

            {isOpen && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4">

                    {/* Image Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image Size (px)</label>
                        <div className="flex space-x-2">
                            {[320, 640, 1024].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleChange('img_size', size)}
                                    className={`px-3 py-1 text-sm rounded border ${settings.img_size === size
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Confidence Threshold */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium text-gray-700">Confidence Threshold</label>
                            <span className="text-sm text-gray-500">{settings.conf_thres}</span>
                        </div>
                        <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            value={settings.conf_thres}
                            onChange={(e) => handleChange('conf_thres', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* IoU Threshold */}
                    <div>
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium text-gray-700">IoU Threshold</label>
                            <span className="text-sm text-gray-500">{settings.iou_thres}</span>
                        </div>
                        <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            value={settings.iou_thres}
                            onChange={(e) => handleChange('iou_thres', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                </div>
            )}
        </div>
    );
};

export default SettingsPanel;
