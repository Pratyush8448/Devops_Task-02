import React, { useState } from 'react'

const App = () => {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState('')

  const addBook = () => {
    if (title.trim()) {
      setBooks([...books, title])
      setTitle('')
    }
  }

  return (
    <div className="app">
      <h1>📚 Book Library</h1>
      <input
        type="text"
        placeholder="Enter the book title name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addBook}>Add Book</button>
      <ul>
        {books.map((book, idx) => (
          <li key={idx}>{book}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
