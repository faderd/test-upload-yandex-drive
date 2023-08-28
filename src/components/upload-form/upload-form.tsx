import { submitFiles } from '../../api/api';
import './upload-form.css';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

function UploadForm(): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUpload, setIsUpload] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Handlers=================================================================
  const handleFileSelect = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(evt.target.files as ArrayLike<File>);

    if (files.length > 0 && files.length <= 100) {
      setSelectedFiles(files);
    } else {
      // Обработка ошибки, если количество выбранных файлов некорректное
      alert('Пожалуйста, выберите от 1 до 100 файлов.');
    }
  };

  const handleUpload = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      setIsUpload(true);

      await submitFiles(selectedFiles);

      setSelectedFiles([]);
      formRef.current?.reset();
      setIsUpload(false);

    } catch (err) {
      alert(`Ошибка загрузки файлов: ${err}`);
      setIsUpload(false);
    }
  };

  return (
    <>
      <form className='upload-form' onSubmit={handleUpload} ref={formRef}>
        <div className='upload-form__buttons'>
          <label htmlFor='input_file' className='upload-form__file-label btn'>Выберите файлы</label>
          <input className='upload-form__file-input' type="file" id='input_file' multiple onChange={handleFileSelect} disabled={isUpload} />
          <button
            className='upload-form__file-button btn'
            type='submit'
            disabled={!(!!selectedFiles.length) || isUpload}>Загрузить</button>

          {isUpload && (<span className='upload-form__upload-notice'>Идет загрузка...</span>)}
        </div>
        <div className='upload-form__file-list'>
          <h3>Выбранные файлы:</h3>
          <ul>
            {selectedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      </form>
    </>
  );
}

export default UploadForm;
