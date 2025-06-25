const ResultModal = ({ show, closeResultModal, msg }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
             style={{ backgroundColor: 'rgba(169, 169, 169, 0.7)' }}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-4">
                    결과
                </h2>
                <p className="text-xl text-gray-600 mb-6">{msg}</p>
                <button
                    onClick={closeResultModal}
                    className="px-6 py-2 text-white font-semibold rounded-lg shadow-md transition duration-300"
                    style={{ backgroundColor: '#FFE3A9', color: '#333' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFD278'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFE3A9'}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ResultModal;