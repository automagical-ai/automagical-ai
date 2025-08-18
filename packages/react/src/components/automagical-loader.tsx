export function AutomagicalLoader({ isLoading }: { isLoading: boolean }) {
    return (
        <>
            <style>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>

            <div
                style={{
                    animation: "spin 1.75s linear infinite",
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 2147483647,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "18px",
                    border: "2px solid #222222",
                    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    opacity: isLoading ? 1 : 0,
                    transition: "opacity 0.25s ease-in-out"
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="m12 15.39l-3.76 2.27l.99-4.28l-3.32-2.88l4.38-.37L12 6.09l1.71 4.04l4.38.37l-3.32 2.88l.99 4.28M22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.45 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03z"
                    />
                </svg>
            </div>
        </>
    )
}
