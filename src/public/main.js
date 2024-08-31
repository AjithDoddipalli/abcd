// src/public/main.js
document.getElementById('itemForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const newItem = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price')
    };
  
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
  
      const data = await response.json();
      console.log('Item added:', data);
      // You can handle success UI updates or redirects here
    } catch (error) {
      console.error('Error adding item:', error);
      // Handle error UI updates or messages here
    }
  });
  