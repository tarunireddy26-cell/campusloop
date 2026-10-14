package com.campusloop.backend.library;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public Book reserveBook(Long id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            throw new IllegalArgumentException("Book not found with ID: " + id);
        }
        if (!book.isAvailable()) {
            throw new IllegalStateException("This book is already reserved or unavailable.");
        }
        book.setAvailable(false);
        return bookRepository.save(book);
    }

    public Book returnBook(Long id) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) {
            throw new IllegalArgumentException("Book not found with ID: " + id);
        }
        book.setAvailable(true);
        return bookRepository.save(book);
    }
}