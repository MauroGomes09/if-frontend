import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';

const API_URL = process.env.API_URL || 'https://api-if-mauro-gomes.vercel.app';

async function handler(req: NextRequest) {
  try {
    
    const requestPath = req.nextUrl.pathname;

    let apiSubPath = requestPath.startsWith('/proxy') ? requestPath.substring(6) : '/';

    if (apiSubPath === "" || !apiSubPath.startsWith('/')) {
      apiSubPath = `/${apiSubPath}`;
    }
  
    const destinationUrl = `${API_URL}${apiSubPath}${req.nextUrl.search}`;
    console.log(`Proxying ${requestPath} to: ${destinationUrl}`); 

    const headers: HeadersInit = {
    'Content-Type': 'application/json', 
    };

    let requestBody: BodyInit | null | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    try {
        const jsonBody = await req.json();
        requestBody = JSON.stringify(jsonBody);
    } catch (e) {
        requestBody = await req.text();
        headers['Content-Type'] = req.headers.get('Content-Type') || 'text/plain';
    }
}

const response = await fetch(destinationUrl, {
  method: req.method,
  headers: headers, 
  body: requestBody, 
  //@ts-ignore 
  duplex: 'half', 
});

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("API returned invalid JSON despite content-type:", await response.text());
        data = { error: "Invalid JSON response from API" };
      }
    } else {
      data = await response.text();
      console.log("API did not return JSON. Body:", data.substring(0, 200)); 
    }

    const nextResponse = NextResponse.json(data, { 
      status: response.status,
      statusText: response.statusText,
    });
    
    response.headers.forEach((value, key) => {
      if (key !== 'content-encoding' && key !== 'transfer-encoding') { 
         nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;

  } catch (error: any) {
    console.error("Erro no proxy da API:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor do front-end.", error: error.message },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE };