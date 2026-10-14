import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  BookmarkCheck,
  RotateCcw
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Library() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.library.getAll();
      setBooks(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load books from the campus library. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleReserve = async (bookId) => {
    setActionLoadingId(bookId);
    setToastMessage(null);

    try {
      const res = await api.library.reserve(bookId);
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: false } : b))
      );
      setToastMessage({
        type: "success",
        text: `Reserved "${res.data.title || "Book"}". Collect at the central circulation desk.`
      });
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Could not reserve book.";
      setToastMessage({ type: "error", text: errMsg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReturn = async (bookId) => {
    setActionLoadingId(bookId);
    setToastMessage(null);

    try {
      const res = await api.library.returnBook(bookId);
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, available: true } : b))
      );
      setToastMessage({
        type: "success",
        text: `Returned "${res.data.title || "Book"}". Status is now Available.`
      });
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Could not update book status.";
      setToastMessage({ type: "error", text: errMsg });
    } finally {
      setActionLoadingId(null);
    }
  };

  const categories = ["All", ...new Set(books.map((b) => b.category).filter(Boolean))];

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((b) => b.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="library-page">
      <div className="page-header">
        <span className="page-eyebrow">LEARNING RESOURCES</span>
        <h1>Campus Library</h1>
        <p>Explore titles available in the physical campus library and reserve books for pickup.</p>
      </div>

      {toastMessage && (
        <div className={`toast-notification ${toastMessage.type}`}>
          {toastMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toastMessage.text}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="toast-close">
            &times;
          </button>
        </div>
      )}

      {categories.length > 1 && (
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="state-container">
          <Loader2 size={32} className="spin text-purple" />
          <p>Loading library catalog...</p>
        </div>
      ) : error ? (
        <div className="state-container error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={fetchBooks}>
            Try Again
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="state-container empty">
          <BookOpen size={40} />
          <h3>No books found</h3>
          <p>No titles currently available under this category.</p>
        </div>
      ) : (
        <div className="library-grid">
          {filteredBooks.map((book) => {
            const isAvailable = !!book.available;
            const isProcessing = actionLoadingId === book.id;

            return (
              <div className="book-card" key={book.id}>
                <div className="book-card-top">
                  <div className="book-cover-icon">
                    <BookOpen size={24} />
                  </div>
                  <span className={`availability-pill ${isAvailable ? "available" : "reserved"}`}>
                    {isAvailable ? (
                      <>
                        <CheckCircle2 size={12} /> Available
                      </>
                    ) : (
                      <>
                        <Clock size={12} /> Reserved
                      </>
                    )}
                  </span>
                </div>

                <div className="book-info">
                  <span className="book-category">{book.category || "General"}</span>
                  <h3>{book.title}</h3>
                  <p className="book-author">by {book.author || "Unknown Author"}</p>
                </div>

                <div className="book-card-actions">
                  {isAvailable ? (
                    <button
                      type="button"
                      className="reserve-book-btn"
                      onClick={() => handleReserve(book.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={14} className="spin" />
                          Reserving...
                        </>
                      ) : (
                        <>
                          <BookmarkCheck size={14} />
                          Reserve Book
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="reserved-action-group">
                      <span className="reserved-label">Currently Reserved</span>
                      <button
                        type="button"
                        className="return-book-btn"
                        onClick={() => handleReturn(book.id)}
                        disabled={isProcessing}
                        title="Release/Return reservation"
                      >
                        {isProcessing ? (
                          <Loader2 size={12} className="spin" />
                        ) : (
                          <>
                            <RotateCcw size={12} />
                            Release
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
