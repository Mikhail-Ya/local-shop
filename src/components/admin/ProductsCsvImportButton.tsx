'use client';

import { useRef, useState, ChangeEvent } from 'react';

export default function ProductsCsvImportButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setMessage(null);
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || data.message || 'Ошибка импорта');
      } else {
        setMessage(data.message || 'Импорт успешно выполнен');
      }
    } catch (err) {
      console.error('Ошибка импорта CSV:', err);
      setError('Ошибка сети при импорте');
    } finally {
      setIsUploading(false);
      // позволяем выбрать тот же файл повторно
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={isUploading}
        >
          {isUploading ? 'Импортирую...' : 'Импорт из CSV'}
        </button>
        <span className="text-xs text-gray-500">
          Формат: name, description, price, stock, brand, imageUrl
        </span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

