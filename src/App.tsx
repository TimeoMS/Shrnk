import React, { useState, useEffect, useCallback, useRef, FC, DragEvent, ChangeEvent } from 'react';
import "./style.css";

// --- Icônes SVG (pour remplacer lucide-react dans un seul fichier) ---

// Ajout d'une interface pour les props d'icônes
interface IconProps {
  className?: string;
}

// Icône pour le logo (Shrink)
const LogoIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

// Icône d'upload
const UploadCloudIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

// Icône de fichier
const FileIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// Icône de succès (coche)
const CheckCircleIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// Icône de téléchargement
const DownloadIcon: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// --- Composant Logo ---
const Logo: FC = () => (
  <div className="flex items-center gap-2">
    <div className="bg-indigo-600 text-white p-2 rounded-lg">
      <LogoIcon className="w-6 h-6" />
    </div>
    <span className="text-2xl font-bold text-slate-800">Shrnk</span>
  </div>
);

// --- Interface pour les props de FileUploadArea ---
interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

// --- Composant de la zone d'upload ---
// La logique de drag/drop a été retirée d'ici et déplacée dans App
const FileUploadArea: FC<FileUploadAreaProps> = ({ onFilesSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
      ? Array.from(e.target.files).filter((file) =>
          file.type.startsWith('image/')
        )
      : [];
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all duration-300 border-slate-300 bg-slate-50`}
      // Les gestionnaires onDragOver, onDragLeave, onDrop ont été retirés
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all bg-slate-100`}
        >
          <UploadCloudIcon
            className={`w-8 h-8 transition-all text-slate-500`}
          />
        </div>
        <p className="text-xl font-semibold text-slate-700">
          Glissez-déposez vos images ici
        </p>
        <p className="text-slate-500">
          Ou, si vous préférez...
        </p>
        <button
          onClick={openFileDialog}
          className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
        >
          Parcourir les fichiers
        </button>
      </div>
    </div>
  );
};

// --- Interface pour les props de FileProcessingItem ---
interface FileProcessingItemProps {
  file: File;
  fileId: string; // ID unique pour le callback
  onCompressionDone: (fileId: string, compressedSize: number) => void;
}

// --- Composant pour un fichier en cours de traitement ---
const FileProcessingItem: FC<FileProcessingItemProps> = ({ file, fileId, onCompressionDone }) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'compressing' | 'done'>('compressing'); // 'compressing', 'done'
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const originalSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  const compressedSizeInMB = compressedSize
    ? (compressedSize / (1024 * 1024)).toFixed(2)
    : null;

  // Effet pour générer l'aperçu de l'image
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Nettoyage de l'URL de l'objet
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Effet pour simuler la compression (à remplacer par votre appel Rust/WASM)
  useEffect(() => {
    setStatus('compressing');
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simuler la fin de la compression
    const compressionTimer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setStatus('done');
      // Simuler une réduction de 60%
      const finalSize = file.size * 0.4;
      setCompressedSize(finalSize);
      onCompressionDone(fileId, finalSize); // Informer le parent en utilisant fileId
    }, 2500); // Simulation de 2.5 secondes

    return () => {
      clearInterval(interval);
      clearTimeout(compressionTimer);
    };
  }, [file, fileId, onCompressionDone]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4 shadow-sm">
      {/* Aperçu */}
      <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`Aperçu de ${file.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon className="w-8 h-8 text-slate-400 m-auto" />
        )}
      </div>

      {/* Infos Fichier & Progression */}
      <div className="flex-grow min-w-0">
        <p
          className="text-sm font-medium text-slate-800 truncate"
          title={file.name}
        >
          {file.name}
        </p>
        {status === 'compressing' && (
          <p className="text-sm text-slate-500">
            {originalSizeInMB} MB - Compression...
          </p>
        )}
        {status === 'done' && (
          <p className="text-sm text-green-600 font-medium">
            {originalSizeInMB} MB &rarr; {compressedSizeInMB} MB
          </p>
        )}

        {/* Barre de progression */}
        <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              status === 'done' ? 'bg-green-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Statut & Action */}
      <div className="flex-shrink-0">
        {status === 'compressing' && (
          <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin"></div>
        )}
        {status === 'done' && (
          <button
            title="Télécharger"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-all"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// --- Interface pour l'objet fichier dans l'état ---
interface FileObject {
  id: string;
  file: File;
  status: 'waiting' | 'compressing' | 'done';
  compressedSize: number | null;
}

// --- Composant Principal de l'Application ---
export default function App() {
  // `files` stockera les objets Fichier complets
  const [files, setFiles] = useState<FileObject[]>([]);
  const [totalOriginalSize, setTotalOriginalSize] = useState<number>(0);
  const [totalCompressedSize, setTotalCompressedSize] = useState<number>(0);
  const [completedFiles, setCompletedFiles] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false); // État pour le drag-over global
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    const newFileObjects: FileObject[] = newFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`, // Clé unique
      file: file,
      status: 'waiting', // 'waiting', 'compressing', 'done'
      compressedSize: null,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFileObjects]);

    // Mettre à jour la taille totale originale
    const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    setTotalOriginalSize((prev) => prev + newFilesSize);
  };

  // Callback quand un fichier a fini sa compression
  const handleCompressionDone = useCallback((fileId: string, compressedSize: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === fileId ? { ...f, status: 'done', compressedSize } : f
      )
    );
    setTotalCompressedSize((prev) => prev + compressedSize);
    setCompletedFiles((prev) => prev + 1);
  }, []);
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Gestionnaire de drop global
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      handleFilesSelected(files);
    }
  };

  // Calculs pour le résumé
  const allDone = completedFiles === files.length && files.length > 0;
  const totalReduction =
    totalOriginalSize > 0
      ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100
      : 0;

  return (
    // Conteneur principal pour centrer et gérer le drag-over global
    <div
      className="antialiased bg-slate-100 text-slate-800 min-h-screen flex items-center justify-center p-4"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
    >
      {/* Input caché pour le bouton "Ajouter" */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files ? Array.from(e.target.files) : [])}
      />

      {/* Calque de superposition pour le drag-and-drop */}
      {isDragging && (
        <div
          className="fixed inset-0 bg-indigo-500 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()} // Nécessaire pour permettre le drop
        >
          <div className="text-center text-white p-12 border-4 border-dashed border-white rounded-lg">
            <UploadCloudIcon className="w-16 h-16 mx-auto" />
            <p className="text-3xl font-bold mt-4">Relâchez pour ajouter</p>
          </div>
        </div>
      )}

      {/* "Fenêtre" de l'application avec hauteur max et layout flex-col */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-lg flex flex-col max-h-[720px] z-10">
        {/* En-tête (non-scrollable) */}
        <header className="p-6 border-b border-slate-200 flex-shrink-0">
          <Logo />
        </header>

        {/* Contenu Principal (scrollable) */}
        <main className="flex-grow p-6 overflow-y-auto">
          {files.length === 0 ? (
            <FileUploadArea onFilesSelected={handleFilesSelected} />
          ) : (
            <div className="space-y-6">
              {/* Résumé de la compression */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Résumé de la compression
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                  <div>
                    <p className="text-sm text-slate-500">Fichiers</p>
                    <p className="text-2xl font-semibold text-indigo-600">
                      {completedFiles} / {files.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Taille d'origine</p>
                    <p className="text-2xl font-semibold text-slate-700">
                      {(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Réduction</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {allDone ? `${totalReduction.toFixed(0)}%` : '--%'}
                    </p>
                  </div>
                </div>
                {allDone && (
                  <div className="mt-6 text-center">
                    <button className="bg-green-600 text-white font-medium px-8 py-3 rounded-lg shadow-sm hover:bg-green-700 transition-all text-lg">
                      Télécharger tout (ZIP)
                    </button>
                  </div>
                )}
              </div>

              {/* Liste des fichiers & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  Fichiers en cours
                </h2>
                <button
                  onClick={openFileDialog}
                  className="bg-slate-100 text-slate-700 font-medium px-5 py-2 rounded-lg hover:bg-slate-200 transition-all"
                >
                  + Ajouter d'autres images
                </button>
              </div>

              <div className="space-y-4">
                {files.map((fileObj) => (
                  <FileProcessingItem
                    key={fileObj.id}
                    file={fileObj.file}
                    fileId={fileObj.id} // Passer l'ID ici
                    onCompressionDone={handleCompressionDone}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Pied de page (non-scrollable) */}
        <footer className="text-center p-4 bg-slate-50 border-t border-slate-200 flex-shrink-0">
          <p className="text-sm text-slate-500">
            Open Source project made with{' '}
            <span className="text-red-500" aria-label="coeur">
              &hearts;
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}