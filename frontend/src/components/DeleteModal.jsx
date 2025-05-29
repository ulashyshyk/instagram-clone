import React from "react";

const DeleteModal = ({ commentId, onConfirmDelete, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-[400px] h-[100px] bg-white rounded-xl shadow-lg flex flex-col items-center  pb-0">
        <button
          onClick={onConfirmDelete}
          className="border-t border-gray-200 w-[95%] h-[50%] text-[14px] font-medium h-[48px] text-[#ED4956] hover:bg-gray-100"
        >
          Delete
        </button>
        <button
          className="border-t border-gray-200 w-[100%] h-[50%] text-[14px]  hover:bg-gray-100 hover:rounded-b-xl h-[50px]"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
