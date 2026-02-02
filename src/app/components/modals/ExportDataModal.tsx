import { useState } from 'react';
import { Modal } from './Modal';
import { Download, FileText, Table, FileJson, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantName?: string;
}

export function ExportDataModal({ isOpen, onClose, plantName }: ExportDataModalProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState('7days');
  const [includeData, setIncludeData] = useState({
    humidity: true,
    temperature: true,
    light: true,
    watering: true,
  });

  const handleExport = () => {
    // Simulate export functionality
    const formatNames = {
      csv: 'CSV',
      json: 'JSON',
      pdf: 'PDF',
    };

    const fileName = plantName 
      ? `${plantName.replace(/\s+/g, '_')}_data.${exportFormat}`
      : `all_plants_data.${exportFormat}`;

    toast.success(`Exportation réussie ! Fichier: ${fileName}`, {
      description: `Format: ${formatNames[exportFormat]} • Période: ${getRangeName()}`,
    });

    onClose();
  };

  const getRangeName = () => {
    const ranges: Record<string, string> = {
      '7days': '7 derniers jours',
      '30days': '30 derniers jours',
      '3months': '3 derniers mois',
      'all': 'Toutes les données',
    };
    return ranges[dateRange] || dateRange;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={plantName ? `Exporter les données - ${plantName}` : 'Exporter les données'} 
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Format d'exportation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Format d'exportation
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setExportFormat('csv')}
              className={`p-4 border-2 rounded-lg transition-all ${
                exportFormat === 'csv'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <Table className={`w-6 h-6 mx-auto mb-2 ${exportFormat === 'csv' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">CSV</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Excel compatible</div>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('json')}
              className={`p-4 border-2 rounded-lg transition-all ${
                exportFormat === 'json'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <FileJson className={`w-6 h-6 mx-auto mb-2 ${exportFormat === 'json' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">JSON</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Données brutes</div>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('pdf')}
              className={`p-4 border-2 rounded-lg transition-all ${
                exportFormat === 'pdf'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <FileText className={`w-6 h-6 mx-auto mb-2 ${exportFormat === 'pdf' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">PDF</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Rapport visuel</div>
            </button>
          </div>
        </div>

        {/* Période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Période
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="3months">3 derniers mois</option>
            <option value="all">Toutes les données</option>
          </select>
        </div>

        {/* Données à inclure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Données à inclure
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <input
                type="checkbox"
                checked={includeData.humidity}
                onChange={(e) => setIncludeData({ ...includeData, humidity: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
              />
              <span className="text-sm text-gray-900 dark:text-white">Humidité du sol</span>
            </label>

            <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <input
                type="checkbox"
                checked={includeData.temperature}
                onChange={(e) => setIncludeData({ ...includeData, temperature: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
              />
              <span className="text-sm text-gray-900 dark:text-white">Température</span>
            </label>

            <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <input
                type="checkbox"
                checked={includeData.light}
                onChange={(e) => setIncludeData({ ...includeData, light: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
              />
              <span className="text-sm text-gray-900 dark:text-white">Luminosité</span>
            </label>

            <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <input
                type="checkbox"
                checked={includeData.watering}
                onChange={(e) => setIncludeData({ ...includeData, watering: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3"
              />
              <span className="text-sm text-gray-900 dark:text-white">Historique d'arrosage</span>
            </label>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">Aperçu de l'exportation</p>
              <p className="text-blue-700 dark:text-blue-300">
                {Object.values(includeData).filter(Boolean).length} type(s) de données • {getRangeName()}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={!Object.values(includeData).some(Boolean)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>
    </Modal>
  );
}
