const Modal = ({
  closeModal,
  amount,
  setAmount,
  componentProps,
  pointsToBuy,
  setPointsToBuy,
}) => {
  const handlePointsChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value) || 0); // Ensure at least 1 point
    setPointsToBuy(value);
    setAmount(value * 50); // Calculate amount based on points
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <form
        onSubmit={componentProps.onSuccess}
        className="modal bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-lg font-semibold">Buy Points</h2>
        <div className="mt-4">
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700"
          >
            Enter Points to Buy:
          </label>
          <input
            type="number"
            id="points"
            value={pointsToBuy}
            onChange={handlePointsChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
            min="1"
          />
          <p className="mt-2">Total Amount: ₦{amount}</p>
        </div>
        <button
          onClick={componentProps.onSuccess}
          className="mt-4 w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          {componentProps.text}
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="mt-2 w-full bg-gray-300 text-gray-800 rounded p-2 hover:bg-gray-400"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Modal;
