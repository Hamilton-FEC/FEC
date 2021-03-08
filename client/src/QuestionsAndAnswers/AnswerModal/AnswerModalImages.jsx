import React from 'react';

const AnswerModalImages = function ({ photos, onChange, imageClose }) {
  if (photos.length >= 5) {
    return (
      <div className="qa-answer-modal-griditem13">
      {photos.map((photo) => (
        <div className="qa-answer-modal-photos" key={photos.indexOf(photo)}>
          <input type="click" className="qa-answer-modal-remove-photo" onClick={imageClose} placeholder="Remove Image"/>
          <img className="qa-answer-thumbnails" src={photo} alt="Image you just uploaded" />
        </div>
      ))}
    </div>
    );
  }
  return (
    <div className="qa-answer-modal-griditem13">
      {photos.map((photo) => (
        <div className="qa-answer-modal-photos" key={photos.indexOf(photo)}>
          <input type="click" className="qa-answer-modal-remove-photo" onClick={imageClose} placeholder="Remove Image"/>
          <img className="qa-answer-thumbnails" src={photo} alt="Image you just uploaded" />
        </div>
      ))}
      <input type="file" accept="image/*" placeholder="Add Image" onChange={onChange} />
    </div>
  );
};

export default AnswerModalImages;
