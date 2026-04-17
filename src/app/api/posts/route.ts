import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('health_posts')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost = {
      authorName: body.authorName,
      authorRole: body.authorRole,
      content: body.content,
      category: body.category,
      imageUrl: body.imageUrl || null,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      status: 'published',
    };
    
    const { data, error } = await supabase
      .from('health_posts')
      .insert([newPost])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 400 });
  }
}
