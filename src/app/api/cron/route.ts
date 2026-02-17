import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Check for Vercel's Cron Secret to prevent random people from triggering this
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const vercelToken = process.env.VERCEL_TOKEN;
  const teamId = process.env.NEXT_PUBLIC_VERCEL_TEAM_ID;
  const ntfyTopic = process.env.NTFY_TOPIC;
  const ntfyToken = process.env.NTFY_TOKEN;

  const headers = { Authorization: `Bearer ${vercelToken}` };
  const teamParam = teamId ? `&teamId=${teamId}` : '';

  try {
    const res = await fetch(`https://api.vercel.com/v9/projects?limit=100${teamParam}`, { headers });
    const data = await res.json();

    const issues = data.projects.filter((p: any) => 
      p.targets?.production?.readyState === 'ERROR'
    );

    if (issues.length > 0) {
      for (const project of issues) {
        await fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${ntfyToken}`,
            'Title': `⚠️ PROJECT DOWN: ${project.name}`,
            'Priority': '5',
            'Tags': 'rotating_light,skull'
          },
          body: `${project.name} is in ERROR state. Manual intervention required.`
        });
      }
    }

    return NextResponse.json({ checked: data.projects.length, issues: issues.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to monitor' }, { status: 500 });
  }
}