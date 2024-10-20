import { useState } from 'react';
import React from 'react'; 

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const submitPost = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, name, comment }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit post');
      }
      await fetchPosts(); // Refresh posts after submission
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div>
      
        <title>Comunidad de la Ciudad</title>
        <meta name="description" content="Comunidad de la Ciudad" />
     

      <main>
        <h1>Bienvenidos a la Comunidad de la Ciudad</h1>
        
        <section>
          <h2>Eventos</h2>
          <form onSubmit={submitPost}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu Nombre" />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentario"></textarea>
            <button type="submit">Publicar</button>
          </form>
        </section>

        <section>
          <h2>Ventas de Segunda Mano</h2>
          <form onSubmit={submitPost}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu Nombre" />
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comentario"></textarea>
            <button type="submit">Publicar</button>
          </form>
        </section>

        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.comment}</p>
            <small>By: {post.name}</small>
          </div>
        ))}
      </main>

      <footer>
        © 2024 Comunidad de la Ciudad
      </footer>
    </div>
  );
}