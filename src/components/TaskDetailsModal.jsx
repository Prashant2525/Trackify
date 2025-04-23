import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import "./css/TaskDetailsModal.css";

const TaskDetailsModal = ({ isOpen, onClose, task, onSuccess }) => {
  const { backendUrl } = useContext(AppContext);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([null, null]);
  const [files, setFiles] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([null, null]);

  // Reset form when modal opens with a new task
  useEffect(() => {
    if (isOpen && task) {
      setDescription("");
      setImages([null, null]);
      setFiles([null, null]);
      setImagePreview([null, null]);
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Update images array
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreview];
        newPreviews[index] = reader.result;
        setImagePreview(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Please provide a description of your work");
      return;
    }

    try {
      setLoading(true);

      // Create form data
      const formData = new FormData();
      formData.append("taskId", task._id);
      formData.append("description", description);

      // Add images if they exist
      images.forEach((image, index) => {
        if (image) formData.append(`image${index + 1}`, image);
      });

      // Add files if they exist
      files.forEach((file, index) => {
        if (file) formData.append(`projectFile${index + 1}`, file);
      });

      // Send to backend using the correct endpoint
      const response = await axios.post(
        `${backendUrl}/api/submission/submit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.message) {
        toast.success(response.data.message);

        // Call the onSuccess callback to update the parent component
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else {
        toast.error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit task"
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...imagePreview];
    newPreviews[index] = null;
    setImagePreview(newPreviews);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles[index] = null;
    setFiles(newFiles);
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal-container">
        <div className="task-modal-header">
          <h2>
            Weekly {task.weekNumber}: {task.taskName}
          </h2>
          <button className="task-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="task-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="task-form-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                rows="5"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Describe what you accomplished this week..."
                required
              ></textarea>
            </div>

            <div className="task-form-group">
              <label>Images (Max 2)</label>
              <div className="task-image-uploads">
                {[0, 1].map((index) => (
                  <div key={`img-${index}`} className="task-upload-item">
                    {imagePreview[index] ? (
                      <div className="task-image-preview-container">
                        <img
                          src={imagePreview[index]}
                          alt={`Preview ${index + 1}`}
                          className="task-image-preview"
                        />
                        <button
                          type="button"
                          className="task-remove-btn"
                          onClick={() => removeImage(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="task-upload-placeholder">
                        <label
                          htmlFor={`image-${index}`}
                          className="task-upload-label"
                        >
                          <span>+ Upload Image {index + 1}</span>
                          <input
                            type="file"
                            id={`image-${index}`}
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="task-form-group">
              <label>Files (Max 2)</label>
              <div className="task-file-uploads">
                {[0, 1].map((index) => (
                  <div key={`file-${index}`} className="task-upload-item">
                    {files[index] ? (
                      <div className="task-file-preview">
                        <span className="task-file-name">
                          {files[index].name}
                        </span>
                        <button
                          type="button"
                          className="task-remove-btn"
                          onClick={() => removeFile(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="task-upload-placeholder">
                        <label
                          htmlFor={`file-${index}`}
                          className="task-upload-label"
                        >
                          <span>+ Upload File {index + 1}</span>
                          <input
                            type="file"
                            id={`file-${index}`}
                            onChange={(e) => handleFileChange(e, index)}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="task-form-actions">
              <button
                type="button"
                onClick={onClose}
                className="task-cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="task-submit-btn"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
