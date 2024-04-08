import React, { useState, FormEvent } from 'react'

function PlaylistUrlSubmissionForm() {
  const [url, setUrl] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Handle the url submission here
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="playlistUrl" className='text-white'>Playlist URL:</label>
      <input 
        type="text" 
        id="playlistUrl" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
      />
  <button className='bg-[#1FDF64]'>
    Submit Url
  </button>
    </form>
  )
}

export default PlaylistUrlSubmissionForm