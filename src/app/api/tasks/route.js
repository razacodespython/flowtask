export async function POST(request) {
  try {
    const { title, description, dueDate, priority, status, type } = await request.json();

    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For now, we'll just return the task data
    // In a real app, you'd save this to a database
    const task = {
      id: Date.now().toString(),
      title,
      description: description || '',
      dueDate: dueDate || new Date().toISOString(),
      priority: priority || 'medium',
      status: status || 'pending',
      type: type || 'manual',
      createdAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(task), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 