import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const ResumeUploader = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) {
      setError('Please upload a resume file.');
      return;
    }

    setLoading(true);
    // Simulate file upload
    setTimeout(() => {
      setLoading(false);
      alert('Resume uploaded successfully!');
      setFile(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Upload Your Resume</h2>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-4 rounded-lg w-full text-center">
        <input {...getInputProps()} />
        <p className="text-gray-300">Drag & drop your resume here, or click to select a file</p>
      </div>
      {file && (
        <motion.div
          className="mt-4 p-2 bg-gray-700 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white">Selected file: {file.name}</p>
        </motion.div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <Button onClick={handleUpload} disabled={loading} className="mt-4">
        {loading ? 'Uploading...' : 'Upload Resume'}
      </Button>
    </div>
  );
};

export default ResumeUploader;